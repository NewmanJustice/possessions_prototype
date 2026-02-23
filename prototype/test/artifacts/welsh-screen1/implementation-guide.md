# welsh-screen1: Claimant Ineligible (Welsh) — Implementation Guide

## What the developer needs to build

### Route: `/claims/claimant-ineligible-welsh`

**File to change:** `prototype/src/routes/claims.js`

#### GET handler

- Render the template `pages/claims/claimant-ineligible-welsh.njk`.
- No session writes.
- Protected by existing `requireAuth` middleware.

#### POST handler (new — this replaces the terminal Screen 40 design)

- On POST, do **not** validate or read form body.
- Redirect (302) to `/claims/start`.
- No session writes.

---

### Template: `prototype/src/views/pages/claims/claimant-ineligible-welsh.njk`

**Replace** the existing Screen 40 template entirely. The new template must include:

| Element                    | Content / Implementation detail                                                              |
|----------------------------|----------------------------------------------------------------------------------------------|
| Caption                    | `"Make a claim"` — rendered as a caption above the h1                                        |
| h1 heading                 | `"You're not eligible for this online service"`                                               |
| Section break              | GOV.UK `govukInsetText` or a `<hr class="govuk-section-break govuk-section-break--visible">` |
| Body paragraph             | `"This service is currently only available for registered community landlords."`              |
| Bold subheading            | `"What to do next"` — `<p class="govuk-body"><strong>What to do next</strong></p>` or similar|
| Body paragraph             | `"Use form N5 Wales and the correct particulars of claim form."`                              |
| External link              | Text: `"View the full list of property possessions forms (opens in new tab)"`, `target="_blank"`, appropriate `rel` attribute |
| Warning text               | `govukWarningText` macro with text `"To exit back to the case list, select 'Cancel'"`         |
| Previous button            | Secondary button/link pointing to `/claims/claimant-type`                                    |
| Continue button            | Primary button inside `<form method="post" action="/claims/claimant-ineligible-welsh">`       |
| Cancel link                | Plain link to `/case-list` with text `"Cancel"`                                              |

---

### Session helper: `prototype/test/helpers/sessionHelper.js`

**No changes required.** The existing `navigateToClaimantIneligibleWelsh` function already:
- Authenticates the session
- Posts `borderNation: 'wales'` at `/claims/border-postcode` (sets `isWales = true`)
- Posts an ineligible `claimantType` at `/claims/claimant-type`

This puts the session in the correct state to reach `/claims/claimant-ineligible-welsh`.

---

## Key constraints for this screen

1. **No validation** — the POST handler must accept any POST and always redirect to `/claims/start`.
2. **No session writes** — neither GET nor POST writes to `req.session.claimDraft`.
3. **The Cancel link** is a plain `<a href="/case-list">` — not a button and not in the POST form.
4. **The Previous button** is a link to `/claims/claimant-type` — not a POST form submission.
5. **Old Screen 40 content must be removed** — the strings "not eligible to use the England possession claim service" and the body text about "property is in Wales" must not appear in the new template.

---

## Traceability

The executable tests in `prototype/test/routes/claimantIneligibleWelsh.test.js` map directly to the acceptance criteria in `businessArtifacts/userstories/welsh-screen1.txt`. See `test-behaviour-matrix.md` for the full mapping.
