// Run: node --test worker/stock.test.mjs
// Drives the Worker's webhook with signed fake events and a stubbed fetch.
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import worker from "./index.js";

const SECRET = "test-secret";
const PHONE = "+6580001111";
const TYPES = [
  { slug: "red-devils", name: "Red devils" },
  { slug: "fancy-red-tigers", name: "Fancy red tigers" },
  { slug: "blue-king-kong", name: "Blue king kong" },
];

function kv() {
  const m = new Map();
  return {
    get: async (k) => (m.has(k) ? m.get(k) : null),
    put: async (k, v) => void m.set(k, v),
    delete: async (k) => void m.delete(k),
    _m: m,
  };
}

function setup() {
  const calls = { replies: [], puts: [], dispatches: [] };
  const env = {
    ZERNIO_WEBHOOK_SECRET: SECRET,
    ZERNIO_ACCOUNT_ID: "acct1",
    ZERNIO_API_KEY: "k",
    GITHUB_TOKEN: "t",
    CLIENTS: kv(),
    EVENTS: kv(),
    PENDING: kv(),
  };
  env.CLIENTS._m.set(PHONE, JSON.stringify({ repo: "o/r", branch: "incoming", types: TYPES }));
  const jpeg = new Uint8Array([255, 216, 255, 224, 0, 16, 74, 70, 73, 70]);
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url);
    if (u.includes("/api/v1/whatsapp/media/"))
      return new Response(jpeg, { status: 200, headers: { "content-type": "image/jpeg", "content-length": String(jpeg.length) } });
    if (u.includes("/inbox/conversations/")) {
      calls.replies.push(JSON.parse(init.body).message);
      return new Response("{}", { status: 200 });
    }
    if (u.endsWith("/dispatches")) {
      calls.dispatches.push(JSON.parse(init.body));
      return new Response(null, { status: 204 });
    }
    if (u.includes("/contents/")) {
      const body = JSON.parse(init.body);
      calls.puts.push({ url: u, body });
      return new Response(JSON.stringify({ content: { sha: "sha" + calls.puts.length } }), { status: 201 });
    }
    return new Response("{}", { status: 404 });
  };
  return { env, calls };
}

let n = 0;
async function send(env, { text, photo = false, sentAt }) {
  n += 1;
  const body = JSON.stringify({
    event: "message.received",
    id: "evt-" + n,
    message: {
      id: "m" + n,
      platform: "whatsapp",
      direction: "incoming",
      text,
      conversationId: "conv1",
      sentAt,
      accountId: "acct1",
      sender: { phoneNumber: PHONE },
      attachments: photo ? [{ type: "image", mimeType: "image/jpeg", url: "/api/v1/whatsapp/media/abc" }] : [],
    },
  });
  const sig = createHmac("sha256", SECRET).update(body).digest("hex");
  const pending = [];
  const res = await worker.fetch(
    new Request("https://w.example/webhook", { method: "POST", body, headers: { "X-Zernio-Signature": sig } }),
    env,
    { waitUntil: (p) => pending.push(p) },
  );
  await Promise.all(pending);
  return res.status;
}

test("a photo with 'red devils 4' keeps the name and stores qty 4", async () => {
  const { env, calls } = setup();
  assert.equal(await send(env, { text: "Red devils 4", photo: true }), 200);
  const meta = calls.puts.find((p) => p.url.endsWith(".json"));
  const json = JSON.parse(Buffer.from(meta.body.content, "base64").toString());
  assert.equal(json.caption, "Red devils");
  assert.equal(json.qty, 4);
  assert.equal(json.plus, false);
  assert.equal(json.type, "red-devils");
  assert.match(calls.replies.at(-1), /Red devils.*4 available.*YES/s);
});

test("30+, 30++ and 30 plus are 'at least 30'", async () => {
  for (const text of ["Fancy red tigers 30+", "Fancy red tigers 30++", "Fancy red tigers 30 plus"]) {
    const { env, calls } = setup();
    await send(env, { text, photo: true });
    const meta = calls.puts.find((p) => p.url.endsWith(".json"));
    const json = JSON.parse(Buffer.from(meta.body.content, "base64").toString());
    assert.equal(json.qty, 30, text);
    assert.equal(json.plus, true, text);
    assert.equal(json.caption, "Fancy red tigers", text);
    assert.match(calls.replies.at(-1), /30\+ available/, text);
  }
});

test("'total 4' and a caption with no number still work", async () => {
  let { env, calls } = setup();
  await send(env, { text: "Red Devils total 4", photo: true });
  let json = JSON.parse(Buffer.from(calls.puts.find((p) => p.url.endsWith(".json")).body.content, "base64").toString());
  assert.equal(json.qty, 4);
  assert.equal(json.caption, "Red Devils");
  ({ env, calls } = setup());
  await send(env, { text: "Blue king kong", photo: true });
  json = JSON.parse(Buffer.from(calls.puts.find((p) => p.url.endsWith(".json")).body.content, "base64").toString());
  assert.equal(json.qty, null);
  assert.equal(json.caption, "Blue king kong");
});

test("prices, pieces and decimals are not counts", async () => {
  for (const text of ["Red devils $40", "Red devils S$40", "Red devils 3pcs", "Red devils x3", "Red devils 1.5"]) {
    const { env, calls } = setup();
    await send(env, { text, photo: true });
    const json = JSON.parse(Buffer.from(calls.puts.find((p) => p.url.endsWith(".json")).body.content, "base64").toString());
    assert.equal(json.qty, null, text);
  }
});

test("text 'red devils 2' with no photo dispatches update-stock", async () => {
  const { env, calls } = setup();
  await send(env, { text: "red devils 2" });
  assert.deepEqual(calls.dispatches.at(-1), { event_type: "update-stock", client_payload: { type: "red-devils", qty: 2, plus: false } });
  assert.match(calls.replies.at(-1), /Red devils: 2 available/);
});

test("text 'red devils 0' is sold out; '30+' keeps plus", async () => {
  let { env, calls } = setup();
  await send(env, { text: "red devils 0" });
  assert.equal(calls.dispatches.at(-1).client_payload.qty, 0);
  assert.match(calls.replies.at(-1), /sold out/);
  ({ env, calls } = setup());
  await send(env, { text: "fancy red tigers 30+" });
  assert.deepEqual(calls.dispatches.at(-1).client_payload, { type: "fancy-red-tigers", qty: 30, plus: true });
});

test("plain text, bare numbers and unknown names stay silent", async () => {
  const { env, calls } = setup();
  await send(env, { text: "hello there" });
  await send(env, { text: "3" });
  await send(env, { text: "pandas 5" });
  assert.equal(calls.replies.length, 0);
  assert.equal(calls.dispatches.length, 0);
});

test("YES still publishes with qty carried in the pending photo", async () => {
  const { env, calls } = setup();
  await send(env, { text: "Red devils 4", photo: true });
  await send(env, { text: "yes" });
  assert.equal(calls.dispatches.at(-1).event_type, "publish-photo");
  assert.match(calls.replies.at(-1), /Published/);
});

test("bad signature is rejected", async () => {
  const { env } = setup();
  const res = await worker.fetch(
    new Request("https://w.example/webhook", { method: "POST", body: "{}", headers: { "X-Zernio-Signature": "00" } }),
    env,
    { waitUntil() {} },
  );
  assert.equal(res.status, 401);
});

test("a comma, colon or dash between the name and the number still works", async () => {
  for (const text of ["CRS, 20", "CRS: 20", "CRS - 20", "CRS,20"]) {
    const { env, calls } = setup();
    env.CLIENTS._m.set(PHONE, JSON.stringify({ repo: "o/r", branch: "incoming", types: [...TYPES, { slug: "crs", name: "CRS" }] }));
    await send(env, { text, photo: true });
    const json = JSON.parse(Buffer.from(calls.puts.find((p) => p.url.endsWith(".json")).body.content, "base64").toString());
    assert.equal(json.qty, 20, text);
    assert.equal(json.caption, "CRS", text);
    assert.equal(json.type, "crs", text);
  }
  const { env, calls } = setup();
  await send(env, { text: "Red devils 1,5", photo: true });
  const json = JSON.parse(Buffer.from(calls.puts.find((p) => p.url.endsWith(".json")).body.content, "base64").toString());
  assert.equal(json.qty, null);
});

test("a late 'no' that was sent BEFORE the photo is ignored", async () => {
  const { env, calls } = setup();
  await send(env, { text: "Red devils 4", photo: true, sentAt: "2026-10-13T11:52:08.000Z" });
  const before = calls.replies.length;
  await send(env, { text: "no", sentAt: "2026-10-13T11:51:32.000Z" });
  assert.equal(calls.replies.length, before, "stale reply must be silent");
  assert.ok(await env.PENDING.get("pending:" + PHONE), "photo still waiting");
  await send(env, { text: "yes", sentAt: "2026-10-13T11:52:35.000Z" });
  assert.equal(calls.dispatches.at(-1).event_type, "publish-photo");
});
