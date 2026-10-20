# Brevo conventions for familymind campaigns

- First name attribute is **VORNAME**, not FIRSTNAME. Every contact in lists 29, 30, 31, 32
  carries `VORNAME` (plus `NACHNAME` on some). No contact has a `FIRSTNAME` attribute, so
  `{{contact.FIRSTNAME}}` renders empty. Use `{{ contact.VORNAME }}` in all campaigns.
- Safer greeting with fallback (some VORNAME values are junk like "Member" or "Joan2121"):
  `{% if contact.VORNAME %}Hallo {{ contact.VORNAME }},{% else %}Hallo,{% endif %}`
- Brevo's editor preview does not fill contact attributes for pasted-HTML campaigns.
  Verify personalization with "Send a test" to an address that exists as a contact
  (rdd@familymind.ai has VORNAME "Rosa Test"), or "Preview as contact".
- Campaigns created via the connector cannot be edited or deleted by it; every change is a new draft.
- Lists 31 (All App Users New) and 32 (Mobile Application Users) are not language-split.
  Lists 29 (DE) and 30 (EN) are subsets of them.
