# welsh-screen1: Claimant Ineligible (Welsh) — Test Plan

## Scope

### In Scope

- `GET /claims/claimant-ineligible-welsh` — page rendering and content
- `POST /claims/claimant-ineligible-welsh` — Continue navigation (redirect to `/claims/start`)
- Caption, h1 heading, body text, subheading, link, warning text content
- Previous navigation link pointing to `/claims/claimant-type`
- Cancel link pointing to `/case-list`
- External link with correct text and `target="_blank"` attribute
- GOV.UK warning text component presence
- Absence of old Screen 40 content
- Route protection (authentication guard)

### Out of Scope

- Visual/CSS styling and pixel-perfect layout
- Wales-specific claim submission or integration with a Welsh court service
- Eligibility override or appeal mechanisms
- Editing claim data from this page
- Any additional entry-condition guard beyond existing middleware (AC-13 defers to existing middleware)
- Full WCAG automated audit (keyboard navigation is a structural check only)
- External link destination URL validity

---

## Test Types

| Type          | Coverage                                                         |
|---------------|------------------------------------------------------------------|
| Integration   | Route handler GET/POST, session state, redirect location         |
| Functional    | All Figma content elements, navigation links/buttons             |
| Regression    | Old Screen 40 content is absent after replacement                |
| Negative      | Unauthenticated access is rejected                               |
| Accessibility | h1 present, GOV.UK component classes, link attributes            |

---

## Test Strategy

1. Use `supertest-session` for session persistence across requests.
2. Use the existing `navigateToClaimantIneligibleWelsh` helper to reach `/claims/claimant-ineligible-welsh` with correct session state (isWales=true, ineligible claimant type).
3. For each acceptance criterion, assert the observable HTTP behaviour or rendered HTML content.
4. Test POST separately to confirm redirect behaviour (302 → `/claims/start`).
5. Test that Previous link href is `/claims/claimant-type` and Cancel link href is `/case-list`.
6. Test that the external forms link has `target="_blank"` and the correct text.
7. Test that the GOV.UK warning text component is present.
8. Regression test: assert that old Screen 40 text strings are absent.
9. Test route protection by attempting access from an unauthenticated session.
10. Each `testSession` is created fresh in `beforeEach` and destroyed in `afterEach`.

---

## Risks and Constraints

| Risk                                                             | Mitigation                                               |
|------------------------------------------------------------------|----------------------------------------------------------|
| Template content changes (Figma update)                          | Tests assert exact strings from user story; update if story changes |
| Old Screen 40 content removed in template but test still checks  | Tests explicitly assert absence of old strings           |
| Helper session state not matching entry conditions               | Helper is verified against existing passing tests        |
| External link URL not accessible from test environment           | Only link text and attribute are tested, not URL validity|
| GOV.UK warning component rendered differently across versions    | Use class `govuk-warning-text` as indicator of component use |

---

## Dependencies

- `navigateToClaimantIneligibleWelsh` helper in `test/helpers/sessionHelper.js` must work (confirmed existing).
- `/claims/border-postcode` and `/claims/claimant-type` routes must be functional (upstream of this screen).
- GOV.UK Frontend is installed and templates compiled (pre-existing in prototype).
- Authentication middleware must be active (pre-existing).
