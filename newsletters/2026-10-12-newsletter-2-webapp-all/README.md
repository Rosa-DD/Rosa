# Handoff: Newsletter 2, web app for everyone (DE + EN) → Brevo

## What this is

Two finished HTML emails, Version 2 from the Notion card "Newsletter 2: Web-App für alle + vier Schritte + Premium (Conversion, DE + EN)". Goal: convert free users to Premium. They are the deliverable, not a design reference. Copy is approved; do not rewrite, reformat or "improve" any text. Emoji in subjects and headings are intentional (allowed in newsletters only).

Send: **Mon 12.10., at the latest Tue 13.10.** The Shared by Design E4 block is for Wed 14.10., so this must go out before then.

## The task

1. Upload the five images in `media/` to Brevo's media library, paste their URLs into `replacements.json`.
2. Fill the upgrade deep link (Mousa) and the price/offer line (Rosa) for both languages.
3. Confirm list IDs with Maha, fill `sender.email`.
4. Decide on the font (below).
5. Run `push-to-brevo.mjs`. It creates both campaigns as **unscheduled drafts** and never sends. Maha schedules after Rosa signs off.
6. Report the two campaign IDs back.

## Images

| File | Language | Where | Size | Displays at |
| --- | --- | --- | --- | --- |
| `webapp-skills-de.png` | DE | hero banner | 1008×567 | 504×284 |
| `webapp-skills.png` | EN | hero banner | 1008×567 | 504×284 |
| `webapp-start-de.jpg` | DE | home screen section | 1008×630 | 504×315 |
| `webapp-start-en.jpg` | EN | home screen section | 1008×630 | 504×315 |
| `sbd-e4-fourth-trimester.jpg` | both | top of Shared by Design card, links to the event | 896×504 | 448×252 |

Logo and Rosa's photo already point at Brevo media URLs.

**Known mismatch:** the home screen images show the ring at 0/1 (EN) and 0/2 (DE), while the copy describes the celebrated ring ("All done for today"). Notion names `web-app-start.jpg` in the website repo (`src/content/blog/de/_assets/familymind-web-app/web-app-start.jpg`, "Alle 9 Aufgaben erledigt. Klasse!") as the intended image. If that file is reachable, use it for the home screen slot instead and tell Rosa. Otherwise ship as is and flag it.

## Already resolved in the HTML

- Web app buttons (3 per mail) go to `https://app.familymind.ai/` with `utm_source=newsletter&utm_medium=email&utm_campaign=webapp-all` and a per-button `utm_content` (`open-hero`, `try-steps`). The blog link uses `utm_content=blog`.
- Shared by Design E4 event: `https://www.linkedin.com/events/7515454124197515264?viewAsMember=true` (button and banner).
- "Platz sichern" / "Save my spot": `mailto:rdd@familymind.ai?subject=Shift`. Reply deadline in copy is "bis morgen" / "by tomorrow", relative to the send day. If the send slips past Tue 13.10., ask Rosa whether to change it.
- Footer socials, privacy (`/dataprivacy/de` for DE).

**Check before sending:** the blog link is `familymind.ai/blog/familymind-web-app/de` (DE) and `familymind.ai/blog/familymind-web-app` (EN), following the team's `/de` suffix convention. Notion lists the DE URL as `familymind.ai/de/blog/familymind-web-app`, live with the next deploy. Open both forms and use whichever resolves.

## Upgrade link and price

- `https://REPLACE-WITH-UPGRADE-DEEP-LINK`: a deep link to the Premium page **inside the web app**, not the App Store (Rosa 10.10.: web checkout has the higher margin). Ask Mousa. Append `utm_source=newsletter&utm_medium=email&utm_campaign=webapp-all&utm_content=premium`.
- The price/offer line is a lime-highlighted placeholder at the end of the Premium paragraph. `replacements.json → copy` replaces the whole highlighted span; put plain text (no highlight) as the value. If Rosa decides there is no price line, set the value to a single space.

## Lists

Prefilled from the Notion card, **confirm with Maha** before running:

- DE: include 29 (All App Users DE), 7 (ContactList_DE). Exclude 36 (DE Paid Users), 14 (Paid Users).
- EN: include 30 (All App Users EN), 8 (Contact_EN), 15 (Newsletter). Exclude 35 (EN Paid Users), 14 (Paid Users).

Open question in Notion: Rosa said "an alle User" on 11.10.; confirm whether Premium families are in this time. If yes, remove the exclusions. The "Ihr seid schon Premium?" line is already in the copy either way. Lists 31 and 32 are not language-split; check overlap and consent before adding them.

## Font

Cooper BT Light loads via `@font-face`. Brevo does not host fonts; it needs a public woff2 with `Access-Control-Allow-Origin: *` and a confirmed webfont licence. Otherwise **delete the whole `@font-face { … }` block from both files** and leave the `font` values empty; everything falls back to Georgia. Do not substitute another font.

## Run

```
BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
```

Node 18+, no dependencies. Validates before any network call, then checks each file for unresolved tokens, the price placeholder, inline data URIs, exactly 5 images, and Gmail's ~102KB clip threshold.

## Before anyone sends

- Test-send to Gmail, Outlook and an iPhone.
- Confirm DE shows the German banners (`-de` files) and EN the English ones.
- Tap "Platz sichern" on a phone: it should open a mail to rdd@familymind.ai, subject "Shift".
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.
- EN copy says "The Mental Load Shift Programm" verbatim from Notion; flag to Rosa, it is probably meant to be "Program".
- Ask Mousa whether the PostHog partner events (invite_sent, invite_viewed, invite_accepted, partner_activated) are live, so the forwarding effect can be measured.

## Structure

600px table on beige `#EDE1D5`, white panel. Logo; pink hero with headline and web app banner; intro + open button; Home Hub paragraph; "Warum das so viel verändert"; celebrating home screen with image; lime Mia card; four numbered steps + try button; Premium with orange upgrade button; already-Premium and Mental Load Shift note with blog link; cream Shared by Design E4 card with centred banner and LinkedIn button; try-tonight paragraph; teal Mental Load Shift band with dates and reply button; Rosa's signature; P.S. card; dark footer.

Do not restructure the tables; nested tables with explicit widths make this render in Outlook.

## Files

```
campaign-de.html     German campaign
campaign-en.html     English campaign
replacements.json    fill this in
push-to-brevo.mjs    creates both campaigns as drafts
media/               5 images + Cooper TTF
```
