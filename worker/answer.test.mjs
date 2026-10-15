// Run: node --test worker/answer.test.mjs
// A stock question from a customer is answered from the site's stock.json, whatever their opt-in status.
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import worker from "./index.js";

const SECRET = "test-secret";
const STAFF = "+6580001111";
const P = "+6591234567";
const PROMPT = "Want updates when new shrimp are available from ebiya.sg? Reply YES. Reply STOP any time.";
const STOCK = {
  updated: "2026-10-15T13:00:00Z",
  types: [
    { slug: "red-devils", name: "Red devils", note: "", photos: 1, qty: 4, plus: false },
    { slug: "fancy-red-tigers", name: "Fancy red tigers", note: "", photos: 2, qty: 30, plus: true },
    { slug: "blue-king-kong", name: "Blue king kong", note: "", photos: 1, qty: null, plus: false },
    { slug: "white-spectra", name: "White spectra", note: "", photos: 0, qty: null, plus: false },
    { slug: "orange-boa", name: "Orange boa", note: "Not for sale yet", photos: 0, qty: null, plus: false },
    { slug: "crs", name: "CRS", note: "", photos: 1, qty: 0, plus: false },
  ],
};

function kv() {
  const m = new Map();
  return { get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => void m.set(k, v), delete: async (k) => void m.delete(k), _m: m };
}
function d1() {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
  return { _db: db, prepare(sql) { return { bind(...a) { return { first: async () => db.prepare(sql).get(...a) ?? null, run: async () => (db.prepare(sql).run(...a), {}), all: async () => ({ results: db.prepare(sql).all(...a) }) }; } }; } };
}
function setup({ stock = STOCK } = {}) {
  const replies = [];
  const env = { ZERNIO_WEBHOOK_SECRET: SECRET, ZERNIO_ACCOUNT_ID: "acct1", ZERNIO_API_KEY: "k", GITHUB_TOKEN: "t", CLIENTS: kv(), EVENTS: kv(), PENDING: kv(), DB: d1() };
  env.CLIENTS._m.set(STAFF, JSON.stringify({ repo: "o/r", branch: "incoming", types: [] }));
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url);
    if (u.endsWith("/stock.json")) return stock === "down" ? new Response("no", { status: 503 }) : new Response(JSON.stringify(stock), { status: 200 });
    if (u.includes("/inbox/conversations/")) { replies.push(JSON.parse(init.body).message); return new Response("{}", { status: 200 }); }
    return new Response("{}", { status: 404 });
  };
  return { env, replies };
}
let n = 0;
async function send(env, phone, text) {
  n += 1;
  const body = JSON.stringify({ event: "message.received", id: "a-" + n, message: { id: "m" + n, platform: "whatsapp", direction: "incoming", text, conversationId: "c-" + phone, accountId: "acct1", sender: { phoneNumber: phone }, attachments: [] } });
  const sig = createHmac("sha256", SECRET).update(body).digest("hex");
  const pend = [];
  await worker.fetch(new Request("https://w.example/webhook", { method: "POST", body, headers: { "X-Zernio-Signature": sig } }), env, { waitUntil: (p) => pend.push(p) });
  await Promise.all(pend);
}
const setStatus = (env, phone, status) => env.DB._db.prepare("INSERT OR REPLACE INTO contacts (phone, status, first_seen_at) VALUES (?, ?, ?)").run(phone, status, new Date().toISOString());

test("a new person asking about a type gets the answer and the opt-in question in one message", async () => {
  const { env, replies } = setup();
  await send(env, P, "Hi, do you have red devils?");
  assert.equal(replies.length, 1);
  assert.match(replies[0], /Red devils: 4 available, as on our site/);
  assert.ok(replies[0].endsWith(PROMPT));
});

test("a plus count and 'CRS' sold out", async () => {
  const { env, replies } = setup();
  setStatus(env, P, "subscribed");
  await send(env, P, "fancy red tigers still got?");
  assert.match(replies.at(-1), /Fancy red tigers: 30\+ available/);
  await send(env, P, "CRS ada?");
  assert.match(replies.at(-1), /CRS: sold out right now/);
});

test("someone who said STOP still gets an answer, and no opt-in question", async () => {
  const { env, replies } = setup();
  setStatus(env, P, "unsubscribed");
  await send(env, P, "red devils available?");
  assert.equal(replies.length, 1);
  assert.match(replies[0], /Red devils: 4 available/);
  assert.ok(!replies[0].includes("Reply YES"));
});

test("a pending contact is answered without being asked again", async () => {
  const { env, replies } = setup();
  setStatus(env, P, "pending");
  await send(env, P, "red devils?");
  assert.equal(replies.length, 1);
  assert.ok(!replies[0].includes("Reply YES"));
});

test("a lead number marked ignored gets nothing", async () => {
  const { env, replies } = setup();
  setStatus(env, P, "ignored");
  await send(env, P, "red devils?");
  assert.equal(replies.length, 0);
});

test("no type named: only the opt-in question for a new person, nothing for a known one", async () => {
  const { env, replies } = setup();
  await send(env, P, "hello, what time can I come?");
  assert.deepEqual(replies, [PROMPT]);
  await send(env, P, "what time can I come?");
  assert.equal(replies.length, 1);
});

test("a type with no photos yet, a note, and a type with no count", async () => {
  const { env, replies } = setup();
  setStatus(env, P, "subscribed");
  await send(env, P, "orange boa?");
  assert.match(replies.at(-1), /Orange boa: not for sale yet\./);
  await send(env, P, "white spectra?");
  assert.equal(replies.length, 1, "no photos and no note: silent");
  await send(env, P, "blue king kong?");
  assert.match(replies.at(-1), /do not have a count/);
});

test("if the site's stock list cannot be read, nothing changes", async () => {
  const { env, replies } = setup({ stock: "down" });
  await send(env, P, "red devils?");
  assert.deepEqual(replies, [PROMPT]);
});

test("at most 10 answers a day to the same number", async () => {
  const { env, replies } = setup();
  setStatus(env, P, "subscribed");
  for (let i = 0; i < 12; i++) await send(env, P, "red devils?");
  assert.equal(replies.length, 10);
});

test("a type marked 'Not for sale yet' says so even when a count exists", async () => {
  const { env, replies } = setup({ stock: { types: [{ slug: "red-devils", name: "Red devils", note: "Not for sale yet", photos: 1, qty: 4, plus: false }] } });
  setStatus(env, P, "subscribed");
  await send(env, P, "red devils?");
  assert.match(replies.at(-1), /Red devils: not for sale yet\./);
});

test("YES and STOP are still handled as before", async () => {
  const { env, replies } = setup();
  await send(env, P, "red devils?");
  await send(env, P, "yes");
  assert.equal(env.DB._db.prepare("SELECT status FROM contacts WHERE phone = ?").get(P).status, "subscribed");
  assert.match(replies.at(-1), /on the list/);
  await send(env, P, "stop");
  assert.match(replies.at(-1), /unsubscribed/);
});
