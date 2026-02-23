# welsh-screen1: Claimant Ineligible (Welsh) — Understanding

## Summary

This screen is a replacement for the terminal Screen 40 design. It informs the solicitor that their client cannot use this online service because the property is in Wales and the claimant is not a registered community landlord. Unlike Screen 40, this is now a **navigable page** with Previous, Continue, and Cancel navigation. The Continue button POSTs and redirects to `/claims/start`; Previous is a link back to `/claims/claimant-type`; Cancel is a link to `/case-list`. No session data is written by this page.

---

## Q1–Q6 Clarification Pattern

### Q1: What is the primary purpose of this screen?
To inform the solicitor that the claim cannot proceed via this service (Welsh property, non-registered-community-landlord claimant) and direct them to what to do next (form N5 Wales), while providing a clean exit path.

### Q2: What data is captured on this screen?
None. This is an information-only page. The POST handler simply redirects without reading form body values.

### Q3: What is the entry point?
`session.claimDraft.isWales === true` AND `session.claimDraft.claimantType` is not `registered-provider`. Reached naturally by posting a Wales property at `/claims/border-postcode` and then selecting an ineligible claimant type at `/claims/claimant-type`.

### Q4: What are the exit points?
- **Previous** (link): `GET /claims/claimant-type`
- **Continue** (POST form → redirect): `GET /claims/start`
- **Cancel** (link): `/case-list`

### Q5: What validation is required?
None. No form fields exist on this page. The POST handler performs no validation and always redirects to `/claims/start`.

### Q6: What session data is read/written?
- Read: `session.claimDraft.isWales` (expected `true`), `session.claimDraft.claimantType` (expected: not `registered-provider`)
- Written: None

---

## Key Behaviours

- GET `/claims/claimant-ineligible-welsh` returns HTTP 200.
- Page displays Welsh-specific ineligibility content (not the old England-ineligible content).
- Caption "Make a claim" is present.
- h1 heading "You're not eligible for this online service" is present.
- Body text "This service is currently only available for registered community landlords." is present.
- Bold subheading "What to do next" is present.
- Body text "Use form N5 Wales and the correct particulars of claim form." is present.
- External link "View the full list of property possessions forms (opens in new tab)" is present and opens in a new tab.
- GOV.UK warning text component with "To exit back to the case list, select 'Cancel'" is present.
- Previous button (styled as secondary link/button) points to `/claims/claimant-type`.
- Continue button (in a POST form) causes a 302 redirect to `/claims/start`.
- Cancel link points to `/case-list`.
- **Old Screen 40 content is NOT present** (e.g., "not eligible to use the England possession claim service", "property is in Wales" as a standalone statement).
- Page requires authentication; unauthenticated users are redirected.

---

## Initial Assumptions

- "Registered community landlords" is the Welsh-law term; the England journey uses "registered providers of social housing".
- The external forms link URL is not under test here (only the link text and `target="_blank"` are relevant).
- The `rel` attribute on the external link (`noopener noreferrer` or similar) is considered good practice but is a secondary concern; tests check `target="_blank"` and link text.
- The Previous button may be rendered as a link with secondary button styling, consistent with other screens.
- The Continue button is inside a `<form method="post">` element.
- No changes to `navigateToClaimantIneligibleWelsh` helper are needed; it already sets up the correct session state.

---

## Ambiguities / Notes

- AC-13 defers direct-navigation guard to existing middleware; we test that unauthenticated access is rejected (consistent with all protected routes) but do not test any additional Wales-guard.
- AC-14 (accessibility keyboard navigation) cannot be automated with supertest; tests cover structural assertions (h1, GOV.UK component classes, link `href` attributes).
