# Handoff: Security update for PAID users (DE + EN) → Brevo

## What this is

Two finished HTML emails from Rosa and Mousa to **paying subscribers** about the outage since Monday evening. Same incident text as the non-paid version (`handoff-brevo-notice-security`), plus a personal opening, a compensation line, an office hour (Teams) and a Calendly booking link. They are the deliverable, not a design reference. **Copy is approved and legally sensitive; do not change a single word.**

- **DE subject:** familymind ist am Wochenende zurück | Ein persönliches Update von uns
- **EN subject:** familymind is back on the weekend | A personal word from us
- **Preheaders** (written by design, confirm with Rosa): "Was passiert ist, was es für dich bedeutet und wie wir dich jetzt unterstützen." / "What happened, what it means for you, and how we are supporting you now."
- **Greeting:** `{{ contact.VORNAME }}`. Confirm the attribute exists and is filled for paid contacts; otherwise it renders "Hallo ,".
- **Signed:** Rosa und Mousa / Rosa and Mousa. Reply-to rdd@familymind.ai.
- **Send:** together with the non-paid version, as soon as approved.

## Recipients

Prefilled: DE **36 (DE Paid Users)**, EN **35 (EN Paid Users)**. Confirm with Maha. List 14 (Paid Users) is not language-split; check whether it holds paid contacts missing from 35/36 and, if so, decide their language before sending. Make sure nobody receives both this and the non-paid version (the non-paid campaigns exclude 35, 36 and 14).

## Links in the HTML

- DE office hour, Tue 27.10., 9:00 to 9:30: `https://teams.microsoft.com/meet/3934577337414769?p=nHHpnqYfHovIL6W8Er` (orange button "Zur Office Hour in Teams")
- EN office hour, Tue 27 Oct, 10:00 to 10:30 German time: `https://teams.microsoft.com/meet/3425654951722817?p=QiBvwuKDS0euuuzjlH` (orange button "Join the office hour in Teams")
- Both: `https://calendly.com/rddfm` (outlined button "Termin bei Rosa buchen" / "Book a time with Rosa")

Button labels were added by design; the full sentences from the copy stay above each button.

## The task

1. Confirm lists, fill `sender.email`.
2. **Delete the whole `@font-face { … }` block** from both HTML files, leave `font` values empty. Headings fall back to Georgia.
3. Run `BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs`. Creates drafts, never sends.
4. Report both campaign IDs.

## Before sending

- Test-send to Gmail, Outlook and an iPhone. Click both Teams links and Calendly.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.
- Flag to Rosa, left as written:
  - The DE and EN office hours are at different times (9:00 vs 10:00) with different Teams links. Confirm that is intended.
  - The EN subject says "back on the weekend", while the body says "back this weekend".
  - The compensation is promised in writing; confirm what it is before sending, since paid users will ask.

## Structure

As the non-paid version, plus: pink card with the compensation line (bold), cream card with office hour sentence + orange Teams button and Calendly sentence + outlined button, then the apology. No images besides the logo.

## Files

```
campaign-de.html / campaign-en.html
replacements.json    fill this in
push-to-brevo.mjs    creates both campaigns as drafts
media/               Cooper TTF
```
