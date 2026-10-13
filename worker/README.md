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
