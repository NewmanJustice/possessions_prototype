# Screen 28 Implementation Plan — Claiming Costs

## Summary
Route: `GET/POST /claims/claiming-costs` | Next screen: TBD | 9 acceptance criteria | Estimated tests: 15–20

---

## Files to Modify

| File | Change | Purpose |
|------|--------|---------|
| `prototype/src/routes/claims.js` | Add GET/POST routes | Handle page load and form submission |
| `prototype/src/views/claims/claiming-costs.njk` | Create template | Render page with radio buttons and error summary |
| `prototype/test/routes/claimingCosts.test.js` | Create test file | Validate all acceptance criteria |

---

## Implementation Steps

1. Add validation function `validateClaimingCosts()` to `prototype/src/middleware/validation.js`
2. Implement GET `/claims/claiming-costs` handler with pre-population from `session.claim.claimingCosts`
3. Implement POST `/claims/claiming-costs` handler with Previous/Cancel/Continue logic
4. Create view template `claiming-costs.njk` with error summary, radio group, and button group
5. Add placeholder route `GET /claims/claiming-costs-next` for navigation
6. Create test suite covering all 9 ACs (page content, validation, persistence, navigation, accessibility)

---

## Session Data

| Field | Type | Read | Write | Scope |
|-------|------|------|-------|-------|
| `session.claim.claimingCosts` | String | GET (pre-fill) | POST (save) | Single screen |

**Values:** `'yes'` \| `'no'` \| `null`

---

## Validation Rules

| Field | Rule | Error Message | Href |
|-------|------|---------------|------|
| `claimingCosts` | Required | "Select yes if you want to ask for your costs back" | `#claimingCosts` |

---

## Definition of Done

- [ ] Routes added to `prototype/src/routes/claims.js`
- [ ] Validation middleware integrated and tested
- [ ] View template renders without errors (GET)
- [ ] Form submission saves to session (POST)
- [ ] Previous button returns to Screen 26d (`/claims/statement-of-express-terms`)
- [ ] Cancel button returns to `/case-list` without saving
- [ ] Continue button redirects to placeholder next screen
- [ ] Error summary and inline errors display on validation failure
- [ ] Selection pre-populated on revisit
- [ ] All 9 acceptance criteria pass
- [ ] Accessibility compliance verified (keyboard nav, focus management)
- [ ] Test file passes (15–20 tests)
