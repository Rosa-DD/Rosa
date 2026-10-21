# Handoff: The Mental Load Shift, O6 + M5 → Brevo

## What this is

Two finished German HTML emails from the Mental Load Shift cascades (Notion: "Mental Load Shift: E-Mail-Kaskaden"). They are the deliverable, not a design reference. Copy is approved; do not rewrite or reformat any text.

| | O6, open cohort | M5, Merz pilot |
| --- | --- | --- |
| Subject | Habt ihr euren ersten Family Sync schon geplant? | Danke für heute! So geht es bis zum 04.11. weiter |
| Preheader | Drei Tipps für ein gutes Gespräch und zwei Minuten Vorbereitung für Check-In 2. | Deine nächsten Schritte für den ersten Family Sync auf einen Blick. |
| From | Rosaria (signs "Rosa", with photo) | Andrea & Rosaria |
| Planned send | Wed 21.10.2026 (today), morning | Wed 21.10.2026 (today), afternoon, after Check-In 1 ends at 14:00. Prefilled 16:00 CEST |
| Recipients | open cohort participants only | Merz pilot participants only |

Reply-to for both: rdd@familymind.ai. Both are due **today**; O6 is already past its morning slot, so create the draft and send it manually as soon as it is approved.

**Names:** always **Rosaria Di Donna** (never "Rosa Di Donna") and **Andrea Böckle** (never "Boeckle").
**Greeting tag:** `{{contact.VORNAME}}`. Confirm the attribute is called VORNAME in this Brevo account, otherwise the greeting renders as "Hallo ,". The script blocks FIRSTNAME.

## The task

1. Fill `listIds` per campaign: open cohort list for O6, Merz pilot list for M5. Do not swap or merge them; the dates in the copy differ (30. Oktober vs 4. November).
2. Fill `sender.email`.
3. Font: since both send today, **delete the whole `@font-face { … }` block** from both HTML files and leave the `font` values empty. Headings fall back to Georgia. Do not substitute another font.
4. Run the script. It creates drafts and never sends.
5. Report both campaign IDs back.

## Already resolved in the HTML

- **O6:** "Zum Mental Load Quiz" button → `https://familymind.ai/mental-load-score/de`. Logo and Rosaria's photo on Brevo media (2 images).
- **M5:** "Kurzes Feedback geben" → the same Microsoft Forms link as the open cohort's O5: `https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=0HES51fjqEG9fSFLc8snex38PNg_2j9KiOfholseWm1UOFcwTFhBNUZYREdLQkJTRlJDNU9IQzZLMC4u`. All feedback lands in one form; flag to Rosaria if she wants the cohorts separated. Logo only (1 image).
- Footers: O6 "weil du dich für The Mental Load Shift angemeldet hast", M5 "weil du über Merz Lifecare an The Mental Load Shift teilnimmst". Privacy `familymind.ai/dataprivacy/de`.

## Run

```
BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs --only=m5 --schedule
```

Node 18+, no dependencies. Validates both before creating either: unresolved tokens, inline data URIs, greeting tag, name spellings, key content (quiz link, feedback link, dates), image count. `--schedule` refuses a scheduledAt in the past.

## Before sending

- Test-send each to yourself. Tap the quiz button (O6) and the feedback button (M5).
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.

## Structure

600px table on beige `#EDE1D5`, white panel. Logo; pink hero with "The Mental Load Shift" label, subject as headline, preheader line; then:
- **O6:** greeting; "Drei Tipps, damit euer Sync gut klappt" as bullets; lime card "Zwei Minuten für Check-In 2"; orange quiz button; closing; Rosaria's signature with photo.
- **M5:** greeting and recap; "Deine Aufgaben bis zum 4. November" as six numbered steps; lime card "So unterstützt dich familymind"; peer-coaching and solo-carer paragraphs; cream feedback card with button; signature "Andrea & Rosa".

Dark footer on both. Do not restructure the tables.

## Files

```
campaign-o6.html     open cohort
campaign-m5.html     Merz pilot
replacements.json    fill this in
push-to-brevo.mjs    creates the campaigns as drafts
media/               Cooper TTF
```
