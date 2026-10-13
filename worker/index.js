var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../shared/index.js
var MAX_CAPTION = 120;
function sanitiseText(input, max = MAX_CAPTION) {
  if (typeof input !== "string") return "";
  let t = input.normalize("NFC").replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028\u2029\u202a-\u202e\u2060\ufeff]/g, " ").replace(/\$\(/g, "(").replace(/[<>{}`\\]/g, "").replace(/\s+/g, " ").trim();
  const cps = [...t];
  if (cps.length > max) t = cps.slice(0, max).join("").trim();
  return t;
}
__name(sanitiseText, "sanitiseText");
function normaliseKey(s) {
  if (typeof s !== "string") return "";
  return s.toLowerCase().replace(/[-_‐-―]+/g, " ").replace(/[^\p{L}\p{N}$.\s]/gu, " ").replace(/\s+/g, " ").trim().split(" ").map((w) => w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w).join(" ");
}
__name(normaliseKey, "normaliseKey");
var NOISE = [
  /(?:^|\s)(?:s\$|\$|sgd)\s*\d+(?:\.\d+)?$/,
  // S$40, $40, sgd 40
  /(?:^|\s)\d+(?:\.\d+)?\s*(?:sgd|dollars?|bucks)$/,
  // 40 dollars
  /(?:^|\s)\d+\s*(?:pcs?|pieces?|pc|ea|each|nos?)$/,
  // 3pcs, 3 pc
  /(?:^|\s)x\s*\d+$/,
  // x3
  /(?:^|\s)\d+(?:\.\d+)?$/,
  // bare trailing number
  /[@/,.:;!?\s]+$/
  // dangling punctuation
];
function stripNoise(normalised) {
  let s = normalised.trim();
  for (let i = 0; i < 6; i++) {
    let changed = false;
    for (const re of NOISE) {
      const next = s.replace(re, "").trim();
      if (next !== s) {
        s = next;
        changed = true;
      }
    }
    if (!changed) break;
  }
  return s;
}
__name(stripNoise, "stripNoise");
function matchType(caption, types) {
  if (!Array.isArray(types) || types.length === 0) return null;
  const cap = normaliseKey(typeof caption === "string" ? caption : "");
  if (!cap) return null;
  const stripped = stripNoise(cap);
  const keyed = types.filter((t) => t && typeof t.slug === "string").map((t) => ({ t, keys: [...new Set([normaliseKey(t.name || ""), normaliseKey(t.slug)].filter(Boolean))] }));
  for (const candidate of [stripped, cap]) {
    if (!candidate) continue;
    const hits = keyed.filter((k) => k.keys.includes(candidate));
    if (hits.length === 1) return hits[0].t;
  }
  let best = null;
  let bestLen = 0;
  let tie = false;
  for (const { t, keys } of keyed) {
    for (const key of keys) {
      if (` ${cap} `.includes(` ${key} `) || ` ${stripped} `.includes(` ${key} `)) {
        if (key.length > bestLen) {
          best = t;
          bestLen = key.length;
          tie = false;
        } else if (key.length === bestLen && best && best.slug !== t.slug) {
          tie = true;
        }
      }
    }
  }
  return tie ? null : best;
}
__name(matchType, "matchType");
function parseReply(text) {
  if (typeof text !== "string") return { kind: "other" };
  const t = text.trim().replace(/[.!\s]+$/g, "").toLowerCase();
  if (["yes", "y", "ok"].includes(t)) return { kind: "yes" };
  if (["no", "n", "cancel"].includes(t)) return { kind: "no" };
  if (/^\d{1,2}$/.test(t)) return { kind: "number", n: Number(t) };
  return { kind: "other" };
}
__name(parseReply, "parseReply");
var ID_RE = /^\d{8}-\d{6}-[0-9a-f]{6}$/;
function makeId(date, randomHex6) {
  const p = /* @__PURE__ */ __name((n, w = 2) => String(n).padStart(w, "0"), "p");
  const stamp = `${p(date.getUTCFullYear(), 4)}${p(date.getUTCMonth() + 1)}${p(date.getUTCDate())}-${p(date.getUTCHours())}${p(date.getUTCMinutes())}${p(date.getUTCSeconds())}`;
  const id = `${stamp}-${randomHex6}`;
  if (!ID_RE.test(id)) throw new Error("unsafe id");
  return id;
}
__name(makeId, "makeId");
function randomHex(bytes = 3) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(randomHex, "randomHex");

// src/envelope.js
var isObj = /* @__PURE__ */ __name((v) => v !== null && typeof v === "object" && !Array.isArray(v), "isObj");
function toE164(v) {
  if (typeof v !== "string") return null;
  const digits = v.replace(/[^\d]/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return "+" + digits;
}
__name(toE164, "toE164");
function parseEnvelope(body) {
  if (!isObj(body)) return null;
  const root = isObj(body.data) ? body.data : body;
  const event = body.event ?? body.type ?? root.event ?? root.type;
  const eventId = body.id ?? root.eventId ?? root.id;
  let msg = null;
  if (isObj(root.message)) msg = root.message;
  else if (isObj(body.message)) msg = body.message;
  else if (root.conversationId || Array.isArray(root.attachments)) msg = root;
  if (!msg) return { event, eventId, message: null };
  const account = isObj(root.account) ? root.account : isObj(body.account) ? body.account : {};
  const conversation = isObj(root.conversation) ? root.conversation : isObj(body.conversation) ? body.conversation : {};
  const sender = isObj(msg.sender) ? msg.sender : {};
  let text = null;
  if (typeof msg.text === "string") text = msg.text;
  else if (typeof msg.message === "string") text = msg.message;
  let phone = toE164(sender.phoneNumber) ?? toE164(msg.senderPhoneNumber);
  if (!phone && typeof sender.id === "string" && /^\d{7,15}$/.test(sender.id)) phone = "+" + sender.id;
  if (!phone && typeof msg.senderId === "string" && /^\d{7,15}$/.test(msg.senderId)) phone = "+" + msg.senderId;
  const attachments = (Array.isArray(msg.attachments) ? msg.attachments : []).filter(isObj).map((a) => ({
    type: typeof a.type === "string" ? a.type.toLowerCase() : "",
    mimeType: typeof a.mimeType === "string" ? a.mimeType.toLowerCase() : null,
    url: typeof a.url === "string" ? a.url : null
  }));
  return {
    event,
    eventId,
    test: body.test === true,
    message: {
      messageId: String(msg.platformMessageId ?? msg.id ?? ""),
      conversationId: String(msg.conversationId ?? conversation.id ?? ""),
      platform: String(msg.platform ?? account.platform ?? "").toLowerCase(),
      direction: msg.direction ? String(msg.direction).toLowerCase() : "incoming",
      text,
      attachments,
      phone,
      accountId: String(account.accountId ?? account.id ?? msg.accountId ?? root.accountId ?? ""),
      sentAt: String(msg.sentAt ?? msg.createdAt ?? body.timestamp ?? root.timestamp ?? "")
    }
  };
}
__name(parseEnvelope, "parseEnvelope");

// src/services.js
var MAX_BYTES = 8 * 1024 * 1024;
function toBase64(bytes) {
  let s = "";
  const chunk = 32768;
  for (let i = 0; i < bytes.length; i += chunk) s += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(s);
}
__name(toBase64, "toBase64");
function sniffImage(bytes) {
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return { mime: "image/jpeg", ext: "jpg" };
  if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) return { mime: "image/png", ext: "png" };
  if (bytes.length >= 12 && String.fromCharCode(...bytes.subarray(0, 4)) === "RIFF" && String.fromCharCode(...bytes.subarray(8, 12)) === "WEBP") return { mime: "image/webp", ext: "webp" };
  return null;
}
__name(sniffImage, "sniffImage");
var Zernio = class {
  static {
    __name(this, "Zernio");
  }
  constructor(env, f) {
    this.base = (env.ZERNIO_BASE || "https://zernio.com").replace(/\/$/, "");
    this.key = env.ZERNIO_API_KEY;
    this.f = f;
  }
  /** Only the media path on Zernio's own host receives the API key. */
  mediaUrl(url) {
    if (typeof url !== "string") return null;
    if (url.startsWith("/api/v1/whatsapp/media/")) return this.base + url;
    try {
      const u = new URL(url);
      if (u.origin === new URL(this.base).origin && u.pathname.startsWith("/api/v1/whatsapp/media/")) return u.href;
    } catch {
    }
    return null;
  }
  async downloadMedia(url) {
    const full = this.mediaUrl(url);
    if (!full) return { error: "bad_url" };
    const r = await this.f(full, { headers: { Authorization: `Bearer ${this.key}` } });
    if (!r.ok) return { error: "http_" + r.status };
    const len = Number(r.headers.get("content-length") || 0);
    if (len > MAX_BYTES) return { error: "too_big" };
    const buf = new Uint8Array(await r.arrayBuffer());
    if (buf.length > MAX_BYTES) return { error: "too_big" };
    return { bytes: buf, contentType: (r.headers.get("content-type") || "").toLowerCase() };
  }
  async reply(conversationId, accountId, message) {
    const r = await this.f(`${this.base}/api/v1/inbox/conversations/${encodeURIComponent(conversationId)}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID()
      },
      body: JSON.stringify({ accountId, message })
    });
    return r.ok;
  }
};
var GitHub = class {
  static {
    __name(this, "GitHub");
  }
  constructor(env, f, repo, branch) {
    this.api = (env.GITHUB_API || "https://api.github.com").replace(/\/$/, "");
    this.token = env.GITHUB_TOKEN;
    this.f = f;
    this.repo = repo;
    this.branch = branch;
  }
  headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "whatsapp-gallery-worker",
      "Content-Type": "application/json"
    };
  }
  url(path) {
    return `${this.api}/repos/${this.repo}/contents/${path}`;
  }
  /** Create or update a file. Returns the blob sha or null. */
  async put(path, bytesOrString, message, sha) {
    const bytes = typeof bytesOrString === "string" ? new TextEncoder().encode(bytesOrString) : bytesOrString;
    const body = { message, content: toBase64(bytes), branch: this.branch };
    if (sha) body.sha = sha;
    const r = await this.f(this.url(path), { method: "PUT", headers: this.headers(), body: JSON.stringify(body) });
    if (!r.ok) return null;
    const j = await r.json();
    return j?.content?.sha ?? null;
  }
  async remove(path, sha, message) {
    if (!sha) return false;
    const r = await this.f(this.url(path), {
      method: "DELETE",
      headers: this.headers(),
      body: JSON.stringify({ message, sha, branch: this.branch })
    });
    return r.ok;
  }
  async dispatch(eventType, payload) {
    const r = await this.f(`${this.api}/repos/${this.repo}/dispatches`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ event_type: eventType, client_payload: payload })
    });
    return r.ok;
  }
};

// src/handler.js
var DAY = 86400;
var MAX_PHOTOS_PER_DAY = 20;
var ALLOWED_MIME = /* @__PURE__ */ new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
var enc = new TextEncoder();
async function hmacHex(secret, rawBytes) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, rawBytes));
  return [...sig].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hmacHex, "hmacHex");
function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
__name(timingSafeEqual, "timingSafeEqual");
function typeList(types) {
  return types.map((t, i) => `${i + 1}. ${t.name}`).join("\n");
}
__name(typeList, "typeList");
var HELP = "Send a photo with a caption to add it to your gallery. When I ask, reply YES to publish or NO to cancel.";
async function receive(request, env, deps) {
  const json = /* @__PURE__ */ __name((status, obj) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } }), "json");
  if (request.method !== "POST") return { response: json(405, { error: "method" }) };
  if (!env.ZERNIO_WEBHOOK_SECRET) return { response: json(401, { error: "not configured" }) };
  const raw = new Uint8Array(await request.arrayBuffer());
  const given = request.headers.get("X-Zernio-Signature") || "";
  const expected = await hmacHex(env.ZERNIO_WEBHOOK_SECRET, raw);
  if (!timingSafeEqual(given.toLowerCase(), expected)) return { response: json(401, { error: "bad signature" }) };
  let body;
  try {
    body = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    return { response: json(400, { error: "bad json" }) };
  }
  const ev = parseEnvelope(body);
  const ok = { response: json(200, { ok: true }) };
  if (!ev || ev.event !== "message.received" || !ev.message || !ev.eventId) return ok;
  const m = ev.message;
  if (m.platform !== "whatsapp" || m.direction !== "incoming") return ok;
  if (!env.ZERNIO_ACCOUNT_ID || m.accountId !== env.ZERNIO_ACCOUNT_ID) return ok;
  if (!m.phone) return ok;
  const raw_client = await env.CLIENTS.get(m.phone);
  if (!raw_client) return ok;
  let client;
  try {
    client = JSON.parse(raw_client);
  } catch {
    return ok;
  }
  if (!client || typeof client.repo !== "string" || !/^[\w.-]+\/[\w.-]+$/.test(client.repo)) return ok;
  client.types = Array.isArray(client.types) ? client.types.filter((t) => t && typeof t.slug === "string" && /^[a-z0-9-]{1,40}$/.test(t.slug) && typeof t.name === "string") : [];
  const dedupeKey = "evt:" + String(ev.eventId).slice(0, 100);
  if (await env.EVENTS.get(dedupeKey)) return ok;
  await env.EVENTS.put(dedupeKey, "1", { expirationTtl: DAY });
  const work = /* @__PURE__ */ __name(async () => {
    try {
      await processMessage(m, client, env, deps);
    } catch (e) {
      await env.EVENTS.delete(dedupeKey).catch(() => {
      });
      console.log("processing failed", e && e.message);
    }
  }, "work");
  return { response: ok.response, work };
}
__name(receive, "receive");
async function processMessage(m, client, env, deps) {
  const zernio = new Zernio(env, deps.fetch);
  const gh = new GitHub(env, deps.fetch, client.repo, client.branch || "incoming");
  const say = /* @__PURE__ */ __name((text) => zernio.reply(m.conversationId, m.accountId, text), "say");
  const hasAttachment = m.attachments.length > 0;
  if (hasAttachment) return handlePhoto(m, client, env, deps, zernio, gh, say);
  return handleText(m, client, env, deps, gh, say);
}
__name(processMessage, "processMessage");
async function deleteIncoming(gh, pending) {
  if (!pending) return;
  const msg = "Remove incoming photo";
  await gh.remove(`incoming/${pending.id}.${pending.ext}`, pending.photoSha, msg).catch(() => {
  });
  await gh.remove(`incoming/${pending.id}.json`, pending.jsonSha, msg).catch(() => {
  });
}
__name(deleteIncoming, "deleteIncoming");
function metaJson(p) {
  return JSON.stringify(
    {
      id: p.id,
      caption: p.caption,
      type: p.type ? p.type.slug : null,
      type_name: p.type ? p.type.name : null,
      sender: p.senderMasked,
      received: p.received,
      message_id: p.messageId,
      ext: p.ext
    },
    null,
    2
  );
}
__name(metaJson, "metaJson");
function maskPhone(phone) {
  return phone.slice(0, 3) + "****" + phone.slice(-4);
}
__name(maskPhone, "maskPhone");
async function handlePhoto(m, client, env, deps, zernio, gh, say) {
  const pendingKey = "pending:" + m.phone;
  const att = m.attachments[0];
  const isImage = att.type === "image" || att.mimeType && att.mimeType.startsWith("image/");
  if (!isImage) {
    await say("Sorry, I can only take photos (JPEG, PNG or WebP). Please send the picture as a photo.");
    return;
  }
  if (att.mimeType && !ALLOWED_MIME.has(att.mimeType)) {
    await say("Sorry, that photo format is not supported. Please send it as a normal photo (JPEG, PNG or WebP).");
    return;
  }
  const day = deps.now().toISOString().slice(0, 10);
  const rateKey = `rate:${m.phone}:${day}`;
  const count = Number(await env.PENDING.get(rateKey) || 0);
  if (count >= MAX_PHOTOS_PER_DAY) {
    await say(`That is the limit of ${MAX_PHOTOS_PER_DAY} photos for today. Please send more tomorrow.`);
    return;
  }
  await env.PENDING.put(rateKey, String(count + 1), { expirationTtl: 2 * DAY });
  const dl = await zernio.downloadMedia(att.url);
  if (dl.error === "too_big") {
    await say("That photo is too big (the limit is 8 MB). Please send a smaller one.");
    return;
  }
  if (dl.error) {
    await say("Sorry, I could not get that photo. Please send it again.");
    return;
  }
  const sniffed = sniffImage(dl.bytes);
  if (!sniffed || dl.bytes.length > MAX_BYTES) {
    await say("Sorry, that file is not a photo I can use (JPEG, PNG or WebP).");
    return;
  }
  const caption = sanitiseText(m.text || "");
  const type = matchType(caption, client.types);
  const id = makeId(deps.now(), deps.randomHex());
  const pending = {
    id,
    ext: sniffed.ext,
    caption,
    type: type ? { slug: type.slug, name: type.name } : null,
    senderMasked: maskPhone(m.phone),
    received: deps.now().toISOString(),
    messageId: m.messageId.slice(0, 120),
    conversationId: m.conversationId,
    accountId: m.accountId,
    photoSha: null,
    jsonSha: null
  };
  pending.photoSha = await gh.put(`incoming/${id}.${sniffed.ext}`, dl.bytes, "Incoming photo");
  if (!pending.photoSha) {
    await say("Sorry, something went wrong saving your photo. Please try again in a moment.");
    return;
  }
  pending.jsonSha = await gh.put(`incoming/${id}.json`, metaJson(pending), "Incoming photo details");
  if (!pending.jsonSha) {
    await gh.remove(`incoming/${id}.${sniffed.ext}`, pending.photoSha, "Remove incoming photo");
    await say("Sorry, something went wrong saving your photo. Please try again in a moment.");
    return;
  }
  const oldRaw = await env.PENDING.get(pendingKey);
  if (oldRaw) {
    try {
      await deleteIncoming(gh, JSON.parse(oldRaw));
    } catch {
    }
  }
  await env.PENDING.put(pendingKey, JSON.stringify(pending), { expirationTtl: DAY });
  if (type) {
    const cap = caption ? ` "${caption}"` : "";
    await say(`Got it: ${type.name}${cap}. Reply YES to publish, or NO to cancel.`);
  } else {
    if (client.types.length === 0) {
      await say("Got your photo. Reply YES to publish, or NO to cancel.");
    } else {
      await say(`Got your photo. Which type is it? Reply with a number:
${typeList(client.types)}`);
    }
  }
}
__name(handlePhoto, "handlePhoto");
async function handleText(m, client, env, deps, gh, say) {
  const pendingKey = "pending:" + m.phone;
  const reply = parseReply(m.text || "");
  const raw = await env.PENDING.get(pendingKey);
  let pending = null;
  if (raw) {
    try {
      pending = JSON.parse(raw);
    } catch {
    }
  }
  // This number also serves the Synthwork leads assistant. Plain text with no photo
  // waiting is not for this bot, so it stays silent and leaves the chat alone.
  if (!pending) return;
  if (reply.kind === "other") {
    await say(HELP);
    return;
  }
  if (!pending) {
    await say("There is no photo waiting. Send a photo with a caption first.");
    return;
  }
  if (reply.kind === "no") {
    await deleteIncoming(gh, pending);
    await env.PENDING.delete(pendingKey);
    await say("Cancelled.");
    return;
  }
  if (reply.kind === "number") {
    if (pending.type) {
      await say("Reply YES to publish, or NO to cancel.");
      return;
    }
    const chosen = client.types[reply.n - 1];
    if (!chosen) {
      await say(`Please reply with a number from the list:
${typeList(client.types)}`);
      return;
    }
    pending.type = { slug: chosen.slug, name: chosen.name };
    const sha = await gh.put(`incoming/${pending.id}.json`, metaJson(pending), "Set photo type", pending.jsonSha);
    if (!sha) {
      await say("Sorry, something went wrong. Please try again.");
      return;
    }
    pending.jsonSha = sha;
    await env.PENDING.put(pendingKey, JSON.stringify(pending), { expirationTtl: DAY });
    const cap = pending.caption ? ` "${pending.caption}"` : "";
    await say(`Got it: ${chosen.name}${cap}. Reply YES to publish, or NO to cancel.`);
    return;
  }
  if (!pending.type && client.types.length > 0) {
    await say(`Which type is it? Reply with a number first:
${typeList(client.types)}`);
    return;
  }
  const ok = await gh.dispatch("publish-photo", { id: pending.id });
  if (!ok) {
    await say("Sorry, I could not publish just now. Please reply YES again in a moment.");
    return;
  }
  await env.PENDING.delete(pendingKey);
  await say("Published, it will show in a few minutes.");
}
__name(handleText, "handleText");
function defaultDeps() {
  return { fetch: /* @__PURE__ */ __name((...a) => fetch(...a), "fetch"), now: /* @__PURE__ */ __name(() => /* @__PURE__ */ new Date(), "now"), randomHex: /* @__PURE__ */ __name(() => randomHex(3), "randomHex") };
}
__name(defaultDeps, "defaultDeps");

// src/index.js
var index_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== "/webhook") return new Response("Not found", { status: 404 });
    const { response, work } = await receive(request, env, defaultDeps());
    if (work) ctx.waitUntil(work());
    return response;
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
