# Screen 11: Defendant Details - Test Plan

## Scope

### In Scope
- GET `/claims/defendant-details` - Page rendering and content
- POST `/claims/defendant-details` - Form submission and validation
- Conditional field display (name fields, address fields)
- Session data persistence for defendant details
- Navigation (Previous, Continue, Cancel)
- GOV.UK error summary and inline error display
- Focus management on validation failure
- Clearing of data when toggling between options

### Out of Scope
- Actual postcode lookup API (UI only)
- Multiple defendants (placeholder message only)
- Defendant title/salutation
- Company defendants

## Types of Tests

| Type | Purpose |
|------|---------|
| Integration | Route behaviour, session handling, redirects |
| Validation | Input validation for name and address fields |
| State | Session data persistence, clearing when toggling options |
| Navigation | Previous/Continue/Cancel link behaviour |
| Conditional | Field show/hide based on radio selections |

## Risks and Constraints

| Risk | Mitigation |
|------|------------|
| Session fixture setup complexity | Extend helper to include property address |
| Multiple conditional reveals | Test each path independently |
| Data clearing on toggle | Explicit tests for clear behaviour |
| Additional defendants placeholder | Test JS reveal message appears |

## Test Environment

- **Framework**: Jest + Supertest + supertest-session
- **Session setup**: Extend `sessionHelper.js` with `navigateToDefendantDetails()`
- **Fixtures**: Property address must be in session before tests

## Assumptions for Testing

1. Property address available at `session.claim.propertyAddress` with structure:
   ```js
   {
     buildingAndStreet: '123 Property Street',
     addressLine2: '',
     townOrCity: 'Manchester',
     county: 'Greater Manchester',
     postcode: 'M1 1AA'
   }
   ```
2. Defendant stored as array: `session.claim.defendants[0]`
3. Name validation: max 255 chars, special characters allowed (O'Brien, etc.)
4. Postcode lookup: UI element only, not functional for tests
5. Previous page: `/claims/contact-preferences`
6. Next page: `/claims/grounds`
