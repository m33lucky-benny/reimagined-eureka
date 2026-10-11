# How to add a shrimp picture (WhatsApp)

Send the photo to the ebiya.sg WhatsApp number. The site is updated for you.

1. Send the photo with a short caption (this becomes the caption on the site).
2. The bot replies "Got your photo. Which type is it?" with a numbered list.
   Reply with the number.
3. The bot replies "Got it: <type> "<caption>". Reply YES to publish, or NO to cancel."
   Reply `yes`.
4. The bot replies "Published, it will show in a few minutes."

The photo shows on the shrimp page after the site rebuilds (a minute or two).
Reply `no` at step 3 to cancel.

## What happens behind the scenes

- Zernio sends the WhatsApp message to the Cloudflare Worker `whatsapp-gallery`
  (https://whatsapp-gallery.bennywithtv.workers.dev/webhook).
- The Worker saves the photo to the `incoming` branch of this repo.
- After you reply YES it triggers the GitHub workflow "Publish photo from
  WhatsApp" (`.github/workflows/publish-photo.yml`), which runs
  `scripts/publish_photo.py`.
- The script strips the photo's metadata, makes the full-size, 320 px and 640 px
  copies in `assets/shrimps/` and `assets/shrimps-optimized/`, and adds an entry
  to `_data/gallery.yml`.

## Types

The numbered list comes from the types in `_data/gallery_types.yml`:
Fancy red tigers, Blue king kong, White spectra, Orange boa, Neocaridina,
Red devils. A photo's type decides which gallery section it appears in.

## Fix or remove a photo

Edit or delete its entry in `_data/gallery.yml` (and its files in
`assets/shrimps/` and `assets/shrimps-optimized/`), then push to GitHub.
Set `published: false` to hide a photo without deleting it.

## If nothing happens

- No reply from the bot: check the webhook "whatsapp gallery" at Zernio is
  active and its Secret Key matches the Worker's `ZERNIO_WEBHOOK_SECRET`.
- Replied YES but nothing published: check the Actions tab of the repo for a
  failed "Publish photo from WhatsApp" run.
