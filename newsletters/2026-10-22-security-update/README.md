# Handoff: Security update "familymind is back this weekend" (DE + EN) → Brevo

## What this is

Two finished HTML emails from Rosa and Mousa explaining the outage since Monday evening: a Metabase vulnerability let attackers disrupt the database, police and the data protection authority were informed, there is no evidence data was copied, payment data was never involved, familymind returns this weekend on new servers. They are the deliverable, not a design reference. **Copy is approved and legally sensitive; do not change a single word**, including punctuation.

- **DE subject:** familymind ist am Wochenende zurück: ein Update von Rosa und Mousa
- **EN subject:** familymind is back this weekend: an update from Rosa and Mousa
- **Preheaders** (written by design, confirm with Rosa): "Was passiert ist, was es für dich bedeutet und was du jetzt tun kannst." / "What happened, what it means for you, and what you can do now."
- **Greeting:** "Liebe familymind Familie," / "Dear familymind family," with no personalisation tag.
- **Signed:** Rosa und Mousa / Rosa and Mousa, familymind. Reply-to rdd@familymind.ai (the copy promises personal replies).
- **Send:** as soon as Rosa and Mousa approve. Time-critical.

## Recipients: confirm before running

The brief says **all non-paid users**. Prefilled from earlier campaigns:

- DE: include **All App Users DE (29)**, exclude 36 (DE Paid Users), 14 (Paid Users).
- EN: include **All App Users EN (30)**, exclude 35 (EN Paid Users), 14 (Paid Users).

`listIds` is left empty on purpose; fill it only after Rosa confirms. **Flag this to Rosa:** paid users are affected by the same incident, and a data incident notice that reaches only some affected users can be a GDPR problem. If paid users should get it too (here or separately), clear `exclusionListIds`.

**Transactional vs marketing:** as a campaign, this will not reach contacts who unsubscribed from marketing. If the notice must reach every affected user, it has to go through Brevo transactional email instead. That is Rosa's decision; flag it, do not switch on your own.

## The task

1. Fill `listIds` (after confirmation) and `sender.email`.
2. Font: **delete the whole `@font-face { … }` block** from both HTML files and leave the `font` values empty. Headings fall back to Georgia. Do not substitute another font.
3. Run the script. It creates drafts and never sends.
4. Report both campaign IDs back.

## Run

```
BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
```

Node 18+, no dependencies. Validates both before creating either: unresolved tokens, inline data URIs, exactly 1 image (logo), key sentences present.

## Before sending

- Test-send to Gmail, Outlook and an iPhone.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.
- Footer privacy links: `familymind.ai/dataprivacy/de` (DE), `familymind.ai/dataprivacy` (EN).

## Structure

600px table on beige `#EDE1D5`, white panel. Logo; teal hero with "Ein Update von Rosa und Mousa" label and headline; greeting and two paragraphs; cream card with the data and payment statements (first sentences bold); lime card "Was du tun kannst:" with three bullets; return and apology paragraphs; signature; dark footer. No buttons, no images besides the logo.

Do not restructure the tables.

## Files

```
campaign-de.html     German email
campaign-en.html     English email
replacements.json    fill this in
push-to-brevo.mjs    creates both campaigns as drafts
media/               Cooper TTF
```
