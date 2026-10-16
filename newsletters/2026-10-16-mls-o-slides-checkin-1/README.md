# Handoff: The Mental Load Shift, "Folien Check-In 1" → Brevo

## What this is

One finished German HTML email to the **open cohort** of The Mental Load Shift, sending Andrea's slide deck from Check-In 1 "Nordstern" (16.10.2026) **as a PDF attachment**. The email is the deliverable, not a design reference. This copy is not in Notion; it was written in the cascade's tone and needs **Andrea's approval** before sending. Do not rewrite it yourself.

- **Subject:** Die Folien von Check-In 1 zum Nachlesen
- **Preheader:** Alles aus unserem Nordstern-Workshop, damit du in Ruhe nachschauen kannst.
- **From:** Andrea Böckle (signs as "Andrea", role line "Andrea Böckle, Work Futurists")
- **Reply-to:** rdd@familymind.ai
- **Attachment:** the Check-In 1 PDF that Andrea sent to Maha

**Names:** always **Rosaria Di Donna** (never "Rosa Di Donna") and **Andrea Böckle** (never "Boeckle"). The script refuses to push if either misspelling appears.

## The task

1. Get the PDF to a **public https URL ending in .pdf** (see below) and put it in `attachmentUrl`.
2. Fill `listIds` (open cohort participants only, not the Merz pilot) and `sender.email`.
3. Decide on the font (below).
4. Run `push-to-brevo.mjs`. It creates one draft with the PDF attached and never sends.
5. Open the draft in Brevo, confirm the PDF appears under Attachments, and report the campaign ID back.

## The attachment

The email copy says the slides are attached ("im Anhang", "Die Folien hängen als PDF an dieser Mail"). There is no download link in the HTML. So the attachment must be on the campaign, or the email is wrong.

Brevo's campaign API takes the file as `attachmentUrl`: Brevo downloads it from that URL when the campaign is created. Requirements:

- absolute `https://` URL, publicly reachable with no login, ending in `.pdf`
- check the size. The script warns above 4 MB. Slide decks are often larger; if it's too big, ask Andrea for a compressed export rather than switching to a link (the copy would then need to change).

Options for hosting: a public file on familymind's own site or storage bucket, or any host that serves the raw file. Google Drive and OneDrive share links usually do not work because they return an HTML preview page, not the PDF.

**Alternative without the API:** create the campaign in the Brevo UI, paste `campaign-o-slides.html` as code, and add the PDF in the campaign's settings as an attachment. That avoids hosting the file. If you go this way, skip the script and set the subject, preheader, sender and list by hand from `replacements.json`.

## Font

Cooper BT Light loads via `@font-face`, the only token in the HTML. Brevo does not host fonts. The fast path is to **delete the whole `@font-face { … }` block** and leave the `font` values empty; headings then fall back to Georgia. Do not substitute another font.

## Run

```
BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
```

Node 18+, no dependencies. Before calling Brevo it checks that the PDF URL is reachable and reports its size, then checks the HTML for unresolved tokens, inline data URIs, name spellings, the attachment wording, and exactly 1 image (the logo).

## Before sending

- Get Andrea's OK on the copy.
- Test-send to yourself and open the attachment on a phone and in Outlook.
- Confirm the list is the open cohort only.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.

## Structure

600px table on beige `#EDE1D5`, white panel. Logo; pink hero with "The Mental Load Shift" label, subject as headline and preheader line; greeting and intro; cream card "Check-In 1, 16. Oktober / Nordstern" with the note that the PDF is attached; pointer to the tasks in Friday's email; signature Andrea; dark footer.

## Files

```
campaign-o-slides.html   the email
replacements.json        fill this in
push-to-brevo.mjs        creates the campaign as a draft with the PDF attached
media/                   Cooper TTF
```

The PDF itself is not in this folder. Get it from Maha (Andrea sent it to her).
