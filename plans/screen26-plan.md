# Screen 26 Implementation Plan — Alternatives to Possession

## Summary
Route: `GET/POST /claims/alternative-to-possession`. Implement radio selection for mutually exclusive alternatives (suspension/demotion/neither) with conditional routing to Screens 26a, 26c, or 28. 36 tests required.

## Files to Modify

| File | Purpose |
|------|---------|
| `prototype/src/routes/claims.js` | Add GET/POST handlers for `/alternative-to-possession` |
| `prototype/src/views/claims/alternative-to-possession.njk` | Create template with radio group, guidance, navigation buttons |
| `prototype/test/routes/alternativeToPossession.test.js` | Create test suite (36 tests) |
| `prototype/test/helpers/sessionHelper.js` | Add session initialization helper |

## Implementation Steps

1. Add GET handler: render template with pre-populated selection from session, default to 'neither'
2. Add POST handler: validate mutual exclusivity, update session object with boolean flags, redirect based on selection
3. Create template: govukRadios with 3 options (suspensionOfRightToBuy, demotionOfTenancy, neither), guidance paragraphs, button group (Previous, Continue, Cancel)
4. Implement routing logic: suspend → Screen 26a, demotion → Screen 26c, neither/no selection → Screen 28
5. Add test suite covering: page load, form submission, pre-population, mutual exclusivity validation, navigation routing, error handling

## Session Data

**Write:**
```javascript
session.claim.alternativesToPossession = {
  suspensionOfRightToBuy: boolean,
  demotionOfTenancy: boolean
}
```

**Read:** Check existing selection during GET; preserve on re-render after validation errors.

## Validation Rules

- No selection validation errors (optional field)
- Server-side mutual exclusivity: reject if both `suspensionOfRightToBuy` and `demotionOfTenancy` are true
- Error message: "You cannot select both suspension of right to buy and demotion of tenancy"

## Definition of Done

- [ ] GET/POST routes added to claims.js
- [ ] Template renders with govukRadios, guidance, error summary, button group
- [ ] Session object stored with correct boolean flags
- [ ] Conditional routing works: 26a (suspend), 26c (demotion), 28 (neither)
- [ ] Pre-population loads saved selection on re-entry
- [ ] Previous button returns to Screen 25 with data preserved
- [ ] Cancel button redirects to /case-list
- [ ] All 36 tests pass
- [ ] Accessibility: ARIA attributes, focus management, keyboard navigation
