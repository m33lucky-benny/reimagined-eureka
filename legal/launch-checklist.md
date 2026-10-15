# Legal launch checklist: ebiya.sg (Ebiya.SG, UEN 53515433W)

Project: ebiya.sg shrimp shop website + WhatsApp tools. Date: 2026-10-15. Method: app-launch-kit SOP (Singapore).
General information, not legal advice. A Singapore lawyer should review the drafts.

## 0. Classification
| Item | Ticked? | Evidence |
|---|---|---|
| Collects personal data | YES | Contact form (name, email, message), WhatsApp messages, opt-in list (phone, consent record) |
| Shows money, investment or crypto | no | |
| Quotes, estimates, measurements | no | Prices per piece are shown, not quotes |
| Bookings or payments | no (light) | Payment on collection by PayNow or cash; no online payment; collection by appointment on WhatsApp |
| AI-generated content | no | Shop bot is rule-based; no AI on the site |
| Affiliate links | no | |
| User uploads | no | Visitors cannot upload; customers' WhatsApp photos are not published |
| Client work | no | |

## 1. Business structure
- TODO (owner decision): the business is a **sole proprietorship**, not a Pte Ltd (ACRA profile, registered 18-12-2025). The SOP assumes a company; with a sole proprietorship the owner is personally liable. Read the terms' liability cap with that in mind.
- Needs human check: 2FA on Zernio and the Meta business account (2FA on Cloudflare, GitHub and Google was confirmed on 2026-10-04 per the notes).

## 2. Terms of Use
- DONE (draft): /terms (terms.md), linked in the footer by this PR.
- N/A: sign-up checkbox and acceptance log (the site has no accounts).
- DONE: "as is" wording, liability cap (amount paid for the purchase, or SGD 100), no exclusion of death or personal injury, Singapore law, changes clause with version at the top.
- TODO: lawyer review.

## 3. Privacy and PDPA
- DONE (draft): /privacy (privacy.md): data, purposes, sources, who sees it, overseas, retention, rights, security, cookies, marketing, children, changes, DPO.
- DONE in this PR: line under the contact form pointing to the Privacy Policy (purpose notice before collection).
- DONE: DPO named with a published email (confirm Yuen Yew Meng / bennyyuen@consultant.com is what the owner wants public).
- DONE: opt-in WhatsApp list with exact wording, consent time, message id and STOP handling (Worker v11, D1 `ebiya-contacts`).
- TODO (owner decision): retention rule is "review at least yearly"; set a number if wanted. Delete flow for the opt-in list is manual (D1 command).
- Needs human check: breach plan (PDPC notification within 3 calendar days of assessing a notifiable breach) is only a sentence in the policy.
- DONE: no marketing broadcasts are sent yet. Before any broadcast: Do Not Call rules and Meta template approval.

## 4. Security baseline
- N/A: authentication (no accounts).
- DONE: secrets are Worker secrets, `.env` is gitignored (checked 2026-10-12 per notes).
- DONE: HTTPS; Worker verifies Zernio's HMAC signature and ignores unknown senders.
- DONE: contact form validates required fields (PR #15, #17).
- Needs human check: D1 backups / restore test; admin access to Cloudflare and Zernio.
- N/A: dependency audit for the static site; the Worker has no npm dependencies.
- Needs human check: a working security contact (the email in the privacy page).

## 5. Third-party licences
- Needs human check: fonts (Montserrat via Google Fonts, an open licence), footer icons, and all images are the owner's own photos.

## 9. Public claims
- Needs human check: "Prices from S$40 each" and stock counts are current when published; the membership page is hidden.

## 11. Launch gate
**BLOCKED** for the SOP's strict gate, because: (1) lawyer has not reviewed the drafts, (2) no insurance recorded, (3) business is a sole proprietorship (SOP assumes a Pte Ltd).
Everything else on this checklist is DONE or a human check.

## Human actions
1. Decide whether to publish the registered address (it may be a home address). Meta business verification may want it on the site.
2. Have a Singapore lawyer review privacy.md and terms.md.
3. Decide on insurance and the sole-proprietorship risk.
4. Confirm the DPO details and the email to publish.
5. Set a concrete retention period if you want one.
6. Set the version date again when the pages go live.
