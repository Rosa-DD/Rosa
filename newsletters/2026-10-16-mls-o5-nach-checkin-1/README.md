# Handoff: The Mental Load Shift, O5 "Nach Check-In 1" → Brevo

## What this is

One finished German HTML email from the Mental Load Shift cascade for the open cohort (Notion: "Mental Load Shift: E-Mail-Kaskaden", O5). It is the deliverable, not a design reference. Copy is approved; do not rewrite or reformat any text.

- **Subject:** Danke für heute! So geht es bis zum 30.10. weiter
- **Preheader:** Deine nächsten Schritte für den ersten Family Sync auf einen Blick.
- **From:** Andrea & Rosaria
- **Send:** today, Fri 16.10.2026, afternoon, after Check-In 1 ends at 13:00. Prefilled at 15:00 CEST.

Only O5 goes out. O4 (Starttag) is **not** being sent.

**Names:** always **Rosaria Di Donna** (never "Rosaria Di Donna") and **Andrea Böckle** (never "Boeckle"). The HTML is already correct and the script refuses to push if either misspelling appears.

## The task

1. Decide on the font (below).
2. Fill `listIds` (open cohort participants, confirm with Rosaria) and `sender.email` in `replacements.json`.
3. Run `push-to-brevo.mjs`. It creates one draft and never sends.
4. Report the campaign ID back.

## Already resolved in the HTML

- "Kurzes Feedback geben" button → Microsoft Forms: `https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=0HES51fjqEG9fSFLc8snex38PNg_2j9KiOfholseWm1UOFcwTFhBNUZYREdLQkJTRlJDNU9IQzZLMC4u`
- Logo on Brevo media. No other images.
- Footer socials and privacy link (`familymind.ai/dataprivacy/de`).
- `{{contact.FIRSTNAME}}` in the greeting.

## Font

Cooper BT Light loads via `@font-face`, the only remaining token. Brevo does not host fonts; it needs a public woff2 with `Access-Control-Allow-Origin: *` and a confirmed webfont licence. Since this sends today, the fast path is to **delete the whole `@font-face { … }` block** and leave the `font` values empty. Headlines then fall back to Georgia, which Gmail and Outlook show anyway. Do not substitute another font.

## Run

```
BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs --schedule   # applies 15:00 CEST
```

Node 18+, no dependencies. Checks for unresolved tokens, inline data URIs, the feedback link, name spellings, and exactly 1 image. If 15:00 has already passed, do not schedule in the past; create the draft and send it manually.

## Before sending

- Test-send to Gmail and an iPhone. Tap the feedback button and confirm the form opens.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.
- Confirm the recipient list is the open cohort, not the Merz pilot (Merz gets M5 on 21.10.).

## Structure

600px table on beige `#EDE1D5`, white panel. Logo; pink hero with "The Mental Load Shift" label, subject as headline and preheader line; greeting and recap; "Deine Aufgaben bis zum 30. Oktober" as six numbered steps; lime card "So unterstützt dich familymind"; peer-coaching and solo-carer paragraphs; cream feedback card with button; signature "Andrea & Rosa" with the line "Rosaria Di Donna, familymind · Andrea Böckle, Work Futurists"; dark footer.

Do not restructure the tables; nested tables with explicit widths make this render in Outlook.

## Files

```
campaign-o5.html     the email
replacements.json    fill this in
push-to-brevo.mjs    creates the campaign as a draft
media/               Cooper TTF
```
