# Screen 26d Implementation Plan

## Summary
Implement statement of express terms confirmation for demotion of tenancy claims.
Routes: GET/POST `/claims/statement-of-express-terms`, 46 tests required.

---

## Files to Modify

| File | Purpose |
|------|---------|
| prototype/src/routes/claims.js | Add GET/POST routes for statement-of-express-terms |
| prototype/src/views/pages/claims/statement-of-express-terms.njk | Create template with radio group and conditional textarea |
| prototype/test/helpers/sessionHelper.js | Add navigateToStatementOfExpressTerms helper |

---

## Implementation Steps

1. Create route handlers in claims.js:
   - GET handler: retrieve demotionOrder from session, render template with pre-population
   - POST handler: validate, store to session, handle Previous/Cancel/Continue actions

2. Create template statement-of-express-terms.njk:
   - Display heading "Statement of express terms"
   - Radio group (expressTermsServed): Yes/No with legend
   - Conditional textarea (expressTermsDetails): visible when Yes selected, max 2000 chars, 5 rows
   - Error summary with tabindex -1
   - Button group with Previous, Continue, Cancel

3. Add validation function:
   - Validate expressTermsServed is required
   - Error message: "Select yes if you have served the statement of express terms"
   - expressTermsDetails optional regardless of selection

4. Add session helper:
   - Create navigateToStatementOfExpressTerms() to set up demotionOrder in session

5. Client-side conditional logic:
   - Toggle textarea visibility based on radio selection
   - Retain entered details when toggling between options

---

## Session Data

### Read (GET)
- `req.session.claim.demotionOrder.statementOfExpressTerms`
- `req.session.claim.demotionOrder.statementOfExpressTermsDetails`

### Write (POST)
```javascript
session.claim.demotionOrder = {
  housingAct: 'housing-act-1985-section-82a' | 'housing-act-1996-section-143a',
  statementOfExpressTerms: 'yes' | 'no',
  statementOfExpressTermsDetails: 'text' | null
}
```

---

## Validation Rules

- expressTermsServed: required, error href #expressTermsServed
- expressTermsDetails: optional (displayed only when expressTermsServed === 'yes')

---

## Definition of Done

- [ ] Routes created: GET and POST /claims/statement-of-express-terms
- [ ] Template created: statement-of-express-terms.njk with radio group and conditional textarea
- [ ] Validation: required radio selection, optional details field
- [ ] Session storage: demotionOrder.statementOfExpressTerms and .statementOfExpressTermsDetails
- [ ] Pre-population: values from session displayed on revisit
- [ ] Navigation: Previous → select-housing-act-demotion, Continue → claiming-costs, Cancel → case-list
- [ ] Error handling: GOV.UK error summary with field focus management
- [ ] Accessibility: error summary tabindex -1, keyboard navigation, labels linked
- [ ] Client-side conditional: textarea toggle on radio selection
- [ ] All 46 tests passing
