# Handoff: The Mental Load Shift, O11 (open cohort, after Check-In 3) → Brevo

## What this is

One German HTML email for the **open cohort**, sent the afternoon after Check-In 3 (Fri 13.11.2026, 12:00 to 13:30). It is the deliverable, not a design reference. Layout and the approved parts of the copy are final; do not rewrite them.

- **Subject:** Danke für heute! Euer Experiment bis zum 11.12.
- **Preheader:** Was eure Woche gezeigt hat und welches Experiment ihr jetzt ausprobiert.
- **From:** Andrea & Rosaria. Reply-to rdd@familymind.ai.
- **Greeting:** `{{contact.VORNAME}}`.
- **Recipients:** list **33 (Open Cohort)**, prefilled from Notion. Never the Merz list (their Check-In 3 is 18.11.; M10 is a separate email).
- **Send:** today, Fri 13.11., afternoon. Create an unscheduled draft and send manually once Rosaria approves.

**Names:** always **Rosaria Di Donna** and **Andrea Böckle**.

## ⚠ Copy is not complete yet

Notion (MLS Mail O11) notes: *"Text hat Platzhalter, bis Modul 3 fertig ist."* The email contains **8 lime-highlighted placeholders** that must be replaced with the Modul 3 text from Rosaria or Andrea:

1. Recap of Check-In 3: what the week with the Wochen-Tracker showed
2. What was worked out today on patterns, rituals and safe experiments
3. Aufgabe 1, 2, 3 under "Euer Experiment bis zum 11. Dezember"
4. How Even supports the experiment (lime card)
5. Optional thought from the workshop, or delete that paragraph row

Replace each whole `<span style="background-color:#DFFD6E; …">[…]</span>` with plain text (no highlight). Keep the table structure intact. If there are only two tasks, delete the third step's `<tr>…</tr>` row; if there are four, duplicate a step row and change the number. The script refuses to push while any placeholder remains.

## Recording and feedback

- **Recording** (outlined box, purple button "Zur Aufzeichnung →"): paste the Check-In 3 recording link into `replacements.json → o11`. The sentence above the button was written by design; confirm it with Rosaria.
- **Feedback** (orange box, "Kurzes Feedback geben →"): already links to the shared Microsoft Forms questionnaire, same as O5/O8/M5/M8.

## The task

1. Get the Modul 3 text, replace the placeholders in `campaign-o11.html`.
2. Fill the recording link and `sender.email`; confirm list 33 with Maha.
3. **Delete the whole `@font-face { … }` block** from `campaign-o11.html`, leave `font` values empty. Headings fall back to Georgia.
4. Run `BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs`. Creates a draft, never sends.
5. Report the campaign ID.

Node 18+, no dependencies. Validates: unresolved tokens, remaining placeholders, data URIs, greeting tag, name spellings, no Merz reference, feedback link, 11. Dezember deadline, image count.

## Before sending

- Test-send to yourself. Tap the recording and feedback buttons.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.

## Structure

600px table on beige `#EDE1D5`, white panel. Logo; blue hero with "The Mental Load Shift" label, subject as headline, preheader line; greeting and recap; "Euer Experiment bis zum 11. Dezember" with three numbered steps (teal numerals); lime card "So unterstützt dich familymind"; optional workshop thought; outlined recording box with purple button; orange feedback box with dark button; signature "Andrea & Rosa" with full names; dark footer. Do not restructure the tables.

## Files

```
campaign-o11.html    the email (placeholders to fill)
replacements.json    fill this in
push-to-brevo.mjs    creates the campaign as a draft
media/               Cooper TTF
```
