# whatsapp-gallery (Cloudflare Worker)

Receives WhatsApp messages from Zernio, saves the photo to this repo's
`incoming` branch, asks the sender for the type and a YES, then dispatches the
`publish-photo` workflow (`.github/workflows/publish-photo.yml`).

- Live: https://whatsapp-gallery.bennywithtv.workers.dev (only `POST /webhook`).
- `index.js` is the **built bundle as deployed on 2026-10-12** (Worker version 7,
  downloaded with `cf workers versions get <id> --worker-id whatsapp-gallery
  --include modules`). It was bundled from a project with a `../shared` module
  whose original source is not recorded. Edit this file and redeploy; do not
  expect to regenerate it.
- No secrets are in this file. They are Worker secrets (see below).

## Sharing the number with the Synthwork leads assistant (2026-10-12)

The same WhatsApp number also serves the Synthwork leads assistant (a second Zernio
webhook, "synthwork leads"). The message decides which bot answers:

- **This bot** answers a photo, and the replies while a photo is waiting (a number, YES, NO).
- **Plain text with no photo waiting gets no answer from this bot** (it used to send the
  help text). That text may be a lead talking to the leads assistant.
- The leads assistant only answers chats whose first message carries a lead's "Ref".

`index.js` is now **version 8** (deployed 2026-10-12). Deploy from this folder with plain
Wrangler, which is signed in on the Mac mini as bennywithtv@gmail.com:
`npx wrangler versions upload`, check the new version's bindings, then
`npx wrangler versions deploy <version-id>@100% -y`. `wrangler.jsonc` here lists the three
KV namespaces and the plain variable; secrets are inherited. Roll back to version 7 with
`npx wrangler versions deploy 33bf4a0d-8ba9-4da5-884b-fc7fa8edc6a1@100% -y`.

## Flow
1. Zernio webhook "whatsapp gallery" (event `message.received`) POSTs to `/webhook`,
   signed with HMAC-SHA256 hex of the body in `X-Zernio-Signature`
   (bad signature: 401).
2. The Worker ignores everything except incoming WhatsApp messages on the account
   `ZERNIO_ACCOUNT_ID`, from a sender phone that has an entry in the `CLIENTS` KV.
3. A photo is downloaded from Zernio, its type sniffed (JPEG/PNG/WEBP), and saved as
   `incoming/<id>.<ext>` + `incoming/<id>.json` on the client's `branch`.
4. If the caption matches a type name or slug, that type is used; otherwise the
   Worker asks "Which type is it? Reply with a number" and waits (state in `PENDING`).
5. It replies "Reply YES to publish, or NO to cancel". On YES it sends a
   `repository_dispatch` with `client_payload.id`; the workflow does the rest.
   On NO it removes the incoming files.
6. `EVENTS` KV dedupes Zernio deliveries by event id for a day.

## Configuration
Secrets (Worker secrets, set with `cf workers secrets update <NAME> --worker whatsapp-gallery --type secret_text --text ...`):

| Name | Used for |
|---|---|
| `ZERNIO_WEBHOOK_SECRET` | verify `X-Zernio-Signature`; same value as the Secret Key on the Zernio webhook |
| `ZERNIO_API_KEY` | download the photo and send the WhatsApp replies |
| `GITHUB_TOKEN` | write to `incoming/` and send the `repository_dispatch` (needs contents write on the repo) |

Plain variable: `ZERNIO_ACCOUNT_ID` (the Zernio WhatsApp account's id).
Optional overrides read from env: `ZERNIO_BASE`, `GITHUB_API`.

KV namespaces (names as bound): `CLIENTS`, `EVENTS`, `PENDING`.

`CLIENTS` is keyed by the **sender's phone number** (the shape the Worker reads as
`m.phone`) and holds JSON:
`{"repo": "owner/name", "branch": "incoming", "types": [{"slug": "blue-king-kong", "name": "Blue king kong"}, ...]}`.
**The numbered type list comes from here, not from `_data/gallery_types.yml`.**
Add or rename a shrimp type in both places or the bot and the site disagree.
A sender with no `CLIENTS` entry is silently ignored.

## Rotating the webhook secret
`~/rotate-zernio-webhook-secret.sh` on the owner's Mac mini changes it on the
Worker, on Zernio and in the local `.env` together. A Worker secret takes
several seconds to go live: a 401 immediately afterwards is normal.


## Stock counts (added 2026-10-13)
- A number at the END of a photo caption is the stock count: `red devils 4`, `red devils total 4`.
  `30+`, `30++` and `30 plus` mean "at least 30" (`plus`). Prices (`$40`, `S$40`), `3pcs`, `x3` and
  decimals are not counts. The caption saved for the site is the name without the number.
- The count is saved in the incoming JSON (`qty`, `plus`), then in `_data/gallery.yml` by
  `scripts/publish_photo.py`, and shown as a badge on the photo by `_includes/stock-badge.html`.
- Plain text with no photo, `<type name> <number>` (for example `red devils 2`), changes the count on
  EVERY photo of that type (the number belongs to the type; a new photo with no number takes the type's
  current count, a new photo with a number sets it for all). The Worker sends `repository_dispatch` event `update-stock`
  (`client_payload`: `type`, `qty`, `plus`); `.github/workflows/update-stock.yml` runs
  `scripts/update_stock.py`. `0` shows "Sold out". If there is no photo of that type the workflow fails
  (see the Actions tab); the Worker has already replied "will update".
- Tests: `node --test worker/stock.test.mjs` (signed fake events, stubbed fetch).

## Opt-in list (added 2026-10-15; broadcasts are NOT built)
Who gets asked: anyone who messages the shop number and is not on the `CLIENTS` staff list, once, on their first message.
- First message -> the bot asks: "Want updates when new shrimp are available from ebiya.sg? Reply YES. Reply STOP any time."
  (override with the `OPTIN_PROMPT` variable). Stored as `pending` with the exact wording shown.
- Exact `YES` (or `Y`) within 24 hours of the question -> `subscribed`, with the time and the message id kept as evidence.
- `STOP` / `UNSUBSCRIBE` from a pending or subscribed contact -> `unsubscribed`, confirmed. They are not asked again.
- Left alone (status `ignored`, no reply): a first message containing a lead reference such as `Ref J6DJU8`
  (the Synthwork leads assistant shares this number). `YES`/`STOP` from someone never asked is ignored.
- Nothing is sent to the list. Sending broadcasts is on hold (owner, 2026-10-15).
- Needs a D1 database bound as `DB`. Without it the Worker behaves exactly as before.

Set up (once, with the owner's word, live changes):
```bash
cd worker
npx wrangler d1 create ebiya-contacts                       # note the database_id it prints
npx wrangler d1 execute ebiya-contacts --remote --file schema.sql
# add to wrangler.jsonc:  "d1_databases": [{ "binding": "DB", "database_name": "ebiya-contacts", "database_id": "<id>" }]
npx wrangler versions upload && npx wrangler versions deploy <version-id>@100% -y
```
See the list:
```bash
npx wrangler d1 execute ebiya-contacts --remote --command "SELECT phone, status, consent_at, first_seen_at FROM contacts ORDER BY first_seen_at DESC"
npx wrangler d1 execute ebiya-contacts --remote --command "SELECT status, COUNT(*) FROM contacts GROUP BY status"
```
Mark a number as not a shrimp customer (the bot never asks it):
```bash
npx wrangler d1 execute ebiya-contacts --remote --command "UPDATE contacts SET status='ignored' WHERE phone='+65...'"
```
Tests: `node --test worker/crm.test.mjs` (uses node:sqlite as a stand-in for D1).

## Answering stock questions (added 2026-10-15)
A message from a non-staff number that clearly names ONE type ("do you have red devils?", "CRS ada?") is answered from
the site's public `https://ebiya.sg/stock.json` (type, count, plus, note, photos; built from `_data/gallery.yml` and
`_data/gallery_types.yml`, refreshed on every site build; override the URL with the `STOCK_URL` variable).
- New person: the answer and the opt-in question go in ONE message. Pending, subscribed and unsubscribed numbers get the
  answer only (STOP means no updates, not "do not answer me"). Numbers marked `ignored` (leads) get nothing.
- Wording: `<Type>: <n>[+] available, as on our site. Collection is by appointment: tell us when you would like to come.`;
  `sold out right now`; a "Not for sale" note wins over a count; no count but photos -> "I do not have a count. We will
  reply to confirm"; no photos and no note -> silent.
- Silent when no single type is named, when the message is longer than 200 characters, when stock.json cannot be read,
  or after 10 answers to the same number in a day.
- Tests: `node --test worker/answer.test.mjs`.
