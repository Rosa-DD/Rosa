# Handoff: The Mental Load Shift, O9 + O10 + M9 → Brevo

## What this is

Three finished German HTML emails from the Mental Load Shift cascades (Notion: familymind Content Plan). They are the deliverable, not a design reference. Copy is final; do not rewrite or reformat any text.

| | O9, open cohort | O10, open cohort | M9, Merz pilot |
| --- | --- | --- | --- |
| Subject | Kleine Erinnerung: Startet euren Wochen-Tracker | Am Freitag ist Check-In 3: Was hat eure Woche gezeigt? | Kleine Erinnerung: Startet euren Wochen-Tracker |
| Preheader | Wer heute startet, hat zum Check-In am Freitag fast eine volle Woche beisammen. | Diesmal geht es um Muster, Rituale und sichere Experimente. | Wer heute startet, hat zum Check-In am 18. November eine volle Woche beisammen. |
| From | Rosaria (signs "Rosa", with photo) | Andrea & Rosaria | Rosaria (signs "Rosa", with photo) |
| List | 33 Open Cohort | 33 Open Cohort | 34 Merz Cohort |
| Send | **Mon 09.11. (today)**, send manually once approved | Wed 11.11., prefilled 9:00 | Wed 11.11., prefilled 9:00 |
| Check-In 3 | Fri 13.11. | Fri 13.11., 12:00 to 13:30 | Wed 18.11. |
| Images | logo, Rosaria photo | logo | familymind + Merz logos, Rosaria photo |

Reply-to for all: rdd@familymind.ai. Greeting `{{contact.VORNAME}}`. Names: always **Rosaria Di Donna** and **Andrea Böckle**.

Notion notes: O9 was moved from 04.11. to 09.11. and M9 from 10.11. to 11.11. because O8/M8 went out late (06.11.). Check-In dates are unchanged.

## The task

1. **M9 only:** upload the Merz logo (PNG, transparent or white background, at least 64px tall; displays 32px high next to the familymind logo) to Brevo media and paste its URL into `replacements.json → m9`. If an earlier Merz campaign (M6/M7) already uploaded it, reuse that URL.
2. **O10 only:** paste the Check-In 3 meeting link for Fri 13.11. into `replacements.json → o10`. Ask Rosaria or Andrea. The email calls it "Zoom-Link"; if it is a Teams link, flag it so the label can be changed.
3. Fill `sender.email`. Lists are prefilled from Notion (33, 34); confirm with Maha.
4. **Delete the whole `@font-face { … }` block** from all three HTML files, leave `font` values empty. Headings fall back to Georgia.
5. Create the drafts:
   ```
   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs --only=o9
   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs --only=o10,m9 --schedule
   ```
   O9 is due today, so create it unscheduled and send manually after approval. O10 and M9 can be scheduled for Wed 11.11., 9:00.
6. Report the campaign IDs back.

Node 18+, no dependencies. Validates every selected email before creating any: unresolved tokens, data URIs, greeting tag, name spellings, image count, and cohort content. O9/O10 must say 13. November and must not mention Merz; M9 must say 18. November, carry the Merz logo and footer, and must not contain 13. November or Freitag. O10 must say 12:00 bis 13:30. `--schedule` refuses a past date.

## Before sending

- Test-send each to yourself. In M9, check both logos sit on one line on mobile.
- O10: tap the call link and the "Hier geht's zum Call" button.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.

Do not restructure the tables; nested tables with explicit widths make these render in Outlook.

## Files

```
campaign-o9.html     open cohort, week tracker reminder
campaign-o10.html    open cohort, before Check-In 3
campaign-m9.html     Merz pilot, week tracker reminder
replacements.json    fill this in
push-to-brevo.mjs    creates the campaigns as drafts
media/               Cooper TTF
```
