-- Opt-in list for the shop's WhatsApp number (Cloudflare D1).
-- Apply once:  npx wrangler d1 execute <database-name> --remote --file schema.sql
CREATE TABLE IF NOT EXISTS contacts (
  phone              TEXT PRIMARY KEY,           -- E.164, e.g. +6591234567
  status             TEXT NOT NULL CHECK (status IN ('pending', 'subscribed', 'unsubscribed', 'ignored')),
  first_seen_at      TEXT NOT NULL,              -- first message received (ISO 8601 UTC)
  prompted_at        TEXT,                       -- when the opt-in question was sent
  prompt_text        TEXT,                       -- the exact wording they were shown
  consent_at         TEXT,                       -- when they replied YES
  consent_message_id TEXT,                       -- Zernio/WhatsApp id of the YES message (evidence)
  consent_source     TEXT,                       -- how consent was given (whatsapp-reply)
  unsubscribed_at    TEXT,
  last_inbound_at    TEXT
);
CREATE INDEX IF NOT EXISTS contacts_status ON contacts (status);

-- One row per step, so there is a record of what was asked and answered.
CREATE TABLE IF NOT EXISTS consent_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  phone      TEXT NOT NULL,
  event      TEXT NOT NULL,                      -- prompted | subscribed | unsubscribed
  text       TEXT,
  message_id TEXT,
  at         TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS consent_log_phone ON consent_log (phone);
