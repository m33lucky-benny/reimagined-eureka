// Run: node --test worker/crm.test.mjs
// The opt-in list: people who message the shop first get one question; YES subscribes, STOP unsubscribes.
// D1 is faked with node:sqlite behind the same prepare().bind().first()/run() calls.
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import worker from "./index.js";

const SECRET = "test-secret";
const STAFF = "+6580001111";
const STRANGER = "+6591234567";
const PROMPT = "Want updates when new shrimp are available from ebiya.sg? Reply YES. Reply STOP any time.";

function kv() {
  const m = new Map();
  return { get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => void m.set(k, v), delete: async (k) => void m.delete(k), _m: m };
}
function d1() {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
  return {
    _db: db,
    prepare(sql) {
      return {
        bind(...args) {
          return {
            first: async () => db.prepare(sql).get(...args) ?? null,
            run: async () => (db.prepare(sql).run(...args), { success: true }),
            all: async () => ({ results: db.prepare(sql).all(...args) }),
          };
        },
      };
    },
  };
}

function setup({ withDb = true } = {}) {
  const replies = [];
  const env = {
    ZERNIO_WEBHOOK_SECRET: SECRET, ZERNIO_ACCOUNT_ID: "acct1", ZERNIO_API_KEY: "k", GITHUB_TOKEN: "t",
    CLIENTS: kv(), EVENTS: kv(), PENDING: kv(),
  };
  if (withDb) env.DB = d1();
  env.CLIENTS._m.set(STAFF, JSON.stringify({ repo: "o/r", branch: "incoming", types: [{ slug: "red-devils", name: "Red devils" }] }));
  globalThis.fetch = async (url, init = {}) => {
    if (String(url).includes("/inbox/conversations/")) {
      replies.push(JSON.parse(init.body).message);
      return new Response("{}", { status: 200 });
    }
    return new Response("{}", { status: 404 });
  };
  return { env, replies };
}

let n = 0;
async function send(env, phone, text, { attachments = [] } = {}) {
  n += 1;
  const body = JSON.stringify({
    event: "message.received", id: "evt-" + n,
    message: { id: "m" + n, platform: "whatsapp", direction: "incoming", text, conversationId: "conv-" + phone, accountId: "acct1", sender: { phoneNumber: phone }, attachments },
  });
  const sig = createHmac("sha256", SECRET).update(body).digest("hex");
  const pending = [];
  await worker.fetch(new Request("https://w.example/webhook", { method: "POST", body, headers: { "X-Zernio-Signature": sig } }), env, { waitUntil: (p) => pending.push(p) });
  await Promise.all(pending);
}
const row = (env, phone) => env.DB._db.prepare("SELECT * FROM contacts WHERE phone = ?").get(phone);
const logs = (env, phone) => env.DB._db.prepare("SELECT event FROM consent_log WHERE phone = ? ORDER BY id").all(phone).map((r) => r.event);

test("a stranger's first message gets the opt-in question once", async () => {
  const { env, replies } = setup();
  await send(env, STRANGER, "Hi, do you have red devils?");
  assert.deepEqual(replies, [PROMPT]);
  assert.equal(row(env, STRANGER).status, "pending");
  assert.equal(row(env, STRANGER).prompt_text, PROMPT);
  await send(env, STRANGER, "How much are they?");
  assert.equal(replies.length, 1, "asked only once");
});

test("YES within 24 hours subscribes and records the evidence", async () => {
  const { env, replies } = setup();
  await send(env, STRANGER, "Hello");
  await send(env, STRANGER, "yes");
  const r = row(env, STRANGER);
  assert.equal(r.status, "subscribed");
  assert.ok(r.consent_at && r.consent_message_id && r.prompt_text === PROMPT);
  assert.equal(r.consent_source, "whatsapp-reply");
  assert.match(replies.at(-1), /on the list/);
  assert.deepEqual(logs(env, STRANGER), ["prompted", "subscribed"]);
});

test("YES after the 24-hour window does not subscribe", async () => {
  const { env, replies } = setup();
  await send(env, STRANGER, "Hello");
  env.DB._db.prepare("UPDATE contacts SET prompted_at = ? WHERE phone = ?").run(new Date(Date.now() - 25 * 3600 * 1000).toISOString(), STRANGER);
  const before = replies.length;
  await send(env, STRANGER, "yes");
  assert.equal(row(env, STRANGER).status, "pending");
  assert.equal(replies.length, before);
});

test("STOP unsubscribes, confirms, and a later YES does not bring them back", async () => {
  const { env, replies } = setup();
  await send(env, STRANGER, "Hello");
  await send(env, STRANGER, "YES");
  await send(env, STRANGER, "stop");
  assert.equal(row(env, STRANGER).status, "unsubscribed");
  assert.match(replies.at(-1), /unsubscribed/);
  const before = replies.length;
  await send(env, STRANGER, "yes");
  assert.equal(row(env, STRANGER).status, "unsubscribed");
  assert.equal(replies.length, before);
  assert.deepEqual(logs(env, STRANGER), ["prompted", "subscribed", "unsubscribed"]);
});

test("a lead answering the outreach email (Ref code) is left alone", async () => {
  const { env, replies } = setup();
  await send(env, STRANGER, "Hi Setout, I got your email about recommending painters. Ref J6DJU8");
  assert.equal(replies.length, 0);
  assert.equal(row(env, STRANGER).status, "ignored");
  await send(env, STRANGER, "When can we talk?");
  assert.equal(replies.length, 0, "still silent");
});

test("YES or STOP from someone we never asked is ignored", async () => {
  const { env, replies } = setup();
  await send(env, STRANGER, "yes");
  await send(env, "+6592222222", "stop");
  assert.equal(replies.length, 0);
  assert.equal(row(env, STRANGER), undefined);
  assert.equal(row(env, "+6592222222"), undefined);
});

test("staff numbers never become contacts", async () => {
  const { env, replies } = setup();
  await send(env, STAFF, "hello there");
  assert.equal(row(env, STAFF), undefined);
  assert.equal(replies.length, 0);
});

test("without a D1 binding nothing changes (silent, as before)", async () => {
  const { env, replies } = setup({ withDb: false });
  await send(env, STRANGER, "Hello");
  assert.equal(replies.length, 0);
});

test("a duplicate delivery of the same event asks only once", async () => {
  const { env, replies } = setup();
  const body = JSON.stringify({ event: "message.received", id: "dup-1", message: { id: "mx", platform: "whatsapp", direction: "incoming", text: "Hi", conversationId: "c", accountId: "acct1", sender: { phoneNumber: STRANGER }, attachments: [] } });
  const sig = createHmac("sha256", SECRET).update(body).digest("hex");
  for (let i = 0; i < 2; i++) {
    const p = [];
    await worker.fetch(new Request("https://w.example/webhook", { method: "POST", body, headers: { "X-Zernio-Signature": sig } }), env, { waitUntil: (x) => p.push(x) });
    await Promise.all(p);
  }
  assert.equal(replies.length, 1);
});
