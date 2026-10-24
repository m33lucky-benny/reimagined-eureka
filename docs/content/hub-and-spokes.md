# Hub and spokes: ebiya.sg

Plan and status for the site's content. Read this first before writing a page. Keep it current:
when you add, change or remove a page, update the tables below in the same commit.

Started 2026-10-24 (PR #33). The repo is public: no keys, phone numbers other than the shop's,
or private notes here.

## Goal

Be found and recommended when someone asks a search engine or an AI agent (ChatGPT etc.) for a
**shrimp shop in Singapore**, Caridina shrimp in Singapore, or a named type (fancy red tiger,
blue king kong). On 2026-10-23 ChatGPT's answer to "Shrimp shop in Singapore" listed five other
shops with map ratings and cited ebiya.sg pages only as sources.

## Sourcing rule (do not break)

Every fact on a page comes from one of:
1. text already published on this site, or
2. something the owner has said (record it in the facts table below with the date), or
3. a cited outside source, linked on the page, for general hobby facts only.

Never invent sizes, behaviour, care numbers, grades, breeding rates or prices. Never copy or
closely trace another shop's article (MADSHRIMP etc.): topics yes, their words or their own
breeding history no. Never use another shop's photos. If a fact is missing, leave it out.

## Structure

Two hubs:

| Hub | URL | File | Links to |
|---|---|---|---|
| Shop hub | /shrimp/ | shrimp.md | type pages, guides, care hub |
| Care hub | /caridina-shrimp-care-guide/ | caridina-shrimp-care-guide.md | all care posts, FAQ, buy page |

Type pages (spokes of the shop hub), all built by `_includes/type-spoke.html` from
`_data/type_info.yml` + `_data/gallery.yml` + `_data/gallery_types.yml`:

| Type | URL | Status |
|---|---|---|
| Fancy red tigers | /shrimp/fancy-red-tigers/ | live with PR #33 |
| Blue king kong | /shrimp/blue-king-kong/ | live with PR #33 |
| CRS | /shrimp/crs/ | live with PR #33 |
| Neocaridina | /shrimp/neocaridina/ | live with PR #33 |
| Red devils | /shrimp/red-devils/ | live with PR #33, not for sale (no price, count or buy steps) |
| White spectra | not built | waits for a photo on the site |
| Orange boa | not built | waits for a photo on the site |

Add a type page: copy `shrimp/crs.md`, change title, description, permalink and `type`, add an
entry to `_data/type_info.yml` (only owner-stated facts), link it from shrimp.md's type list and
llms.txt.

Posts (spokes of either hub):

| Post | URL | Hub |
|---|---|---|
| Shrimp shop in Singapore: how to buy | /buy-shrimp-singapore-ebiya/ | shop |
| One tank, many looks | /one-tank-many-looks-caridina/ | care |
| Best shrimp tank setup for Caridina (owner, 2025) | /2025-05-21-best-caridina-shrimp-tank/ | care |
| Best aquarium setups for Caridina (owner, 2025) | /2025-03-01-best-aquarium-setup-for-caridina-shrimp/ | care |
| Water parameters for Caridina in Singapore (owner, 2025) | /2025-12-20-shrimp-tank-water-parameters-for-singapore/ | care |
| 7 shrimp tank accessories (owner, 2025) | /7-shrimp-tank-accessories-that-actually-matter/ | care |
| Calibrate a pH test pen (owner, 2025) | /calibrate-ph-test-pen/ | care |

The five owner posts keep their own text; each ends with a "More from ebiya.sg" block added
2026-10-24. Do not rewrite them without the owner's word.

`llms.txt` lists the key pages for AI crawlers: keep it in step with the tables above.

## Owner-stated facts (source for new pages)

| Date | Fact |
|---|---|
| 2026-10-24 | Sizes sold: juveniles less than 1 cm, young adults about 1 cm or more |
| 2026-10-24 | His Caridina are Caridina cantonensis; the type names are different looks of one species |
| 2026-10-24 | Neocaridina sold: cherry and yellow top |
| 2026-10-24 | Red devils: Caridina, offspring of his fancy red tiger tank, bigger white eyes, too small to photograph well yet, not for sale yet |
| 2026-10-24 | He breeds "to see if some new patterns or colors will appear"; most hobbyists start with one tank and mixing colours brings new patterns |
| 2026-10-24 | Fancy red tigers and blue king kong breed better than the boas; boas are one type in several colours (orange, cream, one green). Type name stays "Orange boa" (owner: leave as is) |
| 2026-10-24 | Counted about 50 fancy red tigers, of which about 20 shrimplets; about 15 boas |
| 2026-10-23 | Collection is Tuesday only, 1pm to 6pm, by appointment (Google Business Profile matches) |

## Waiting on the owner

- Red devils: a sharp side-on photo when they are bigger (send through the WhatsApp flow).
- Facts that would make the type pages stronger: adult size, grading, his own tank water numbers,
  difficulty, breeding notes, how he packs and hands over, after-sales.
- Two advice lines left out of "One tank, many looks" until he confirms them: "one mixed tank is a
  good way to start" and "keep each look in its own tank".
- Whether to show "about 30" instead of "30+" for fancy red tigers (about 20 of ~50 are shrimplets).
- Whether ebiya.sg is in Google Search Console, and under which account (not recorded).

## Next spokes (only when the facts exist)

- A page per type for white spectra and orange boa once each has a photo.
- Fancy red tigers vs blue king kong, once there are more owner facts than one line each.
- How we pack and hand over shrimp (needs the owner's process).
- Shrimplets and berried females: what buyers see in our tanks (owner has videos of berried females
  and counts of shrimplets).

## Check after each change

- Every internal link resolves to a permalink in the repo.
- The live page answers 200 and shows the change (assets are cached about 4 hours; a CSS or JS
  change needs a new `?v=` on its tag).
- Re-ask ChatGPT "Shrimp shop in Singapore" every few weeks and note the date and result here.
