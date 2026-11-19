# Handoff: The Mental Load Shift, M11 (Merz pilot, after Check-In 3) → Brevo

One German HTML email for the **Merz pilot**, sent the **day after** Check-In 3 (Wed 18.11.2026). It is the deliverable, not a design reference; do not rewrite approved copy.

- **Subject:** Danke für gestern! Eure Experimente bis März
- **Preheader:** Was eure Woche gezeigt hat und welche Experimente ihr jetzt ausprobiert.
- **From:** Andrea & Rosaria. Reply-to rdd@familymind.ai. Greeting `{{contact.VORNAME}}`.
- **Recipients:** list **34 (Merz Cohort)**. Never list 33.
- **Send:** Thu 19.11. The copy says "gestern"; if it slips to Friday, ask Rosaria to adjust.
- **Names:** always **Rosaria Di Donna** and **Andrea Böckle**.

## Copy is not complete yet

Lime-highlighted placeholders must be replaced with the Modul 3 text from Rosaria or Andrea: recap, what was worked out, Aufgabe 1–3, how Even supports the experiments, optional workshop thought (or delete that row). Replace each whole highlighted `<span>` with plain text; keep the tables. The script refuses while any placeholder remains.

## Slides attachment

The recording box says the slides are attached. Brevo campaigns take attachments only by URL: upload the Check-In 3 PDF to a public location (SharePoint "anyone with link" direct download, or similar) and put the URL into `campaign.attachmentUrl`. Brevo allows pdf and common office formats, max 4 MB. If that is not possible, ask Rosaria to change the sentence to a link instead.

## Links already in the HTML

- Feedback (orange box): shared Microsoft Forms questionnaire.
- User interviews (pink box): Rosaria's Microsoft Bookings page, 30 min slots.

## The task

1. Fill Merz logo URL (reuse from M9/M10), recording link, `attachmentUrl`, `sender.email`.
2. Replace the Modul 3 placeholders.
3. Delete the whole `@font-face { … }` block; leave `font` values empty.
4. `BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs` creates a draft, never sends. Report the campaign ID.

## Before sending

Test-send; check the attachment arrives; tap recording, feedback and booking buttons; confirm `{{ unsubscribe }}` syntax.
