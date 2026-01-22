# Screen 10: Contact Preferences - Test Plan

## Scope

### In Scope
- GET `/claims/contact-preferences` - Page rendering and content
- POST `/claims/contact-preferences` - Form submission and validation
- Session data persistence for all contact preferences
- Navigation (Previous, Continue, Cancel)
- GOV.UK error summary and inline error display
- Focus management on validation failure

### Out of Scope
- Postcode lookup "no results" UI (not tested per Steve)
- Actual API integration for address lookup
- Non-UK address scenarios
- Accessibility testing beyond focus management (manual testing)

## Types of Tests

| Type | Purpose |
|------|---------|
| Integration | Route behaviour, session handling, redirects |
| Validation | Input validation for email, phone, address fields |
| State | Session data persistence and clearing |
| Navigation | Previous/Continue/Cancel link behaviour |

## Risks and Constraints

| Risk | Mitigation |
|------|------------|
| Session fixture setup complexity | Create helper function to set up registered user data |
| Postcode lookup is simulated | Test against known dummy postcodes only |
| Single page with multiple sections | Test each section independently and combined |
| Conditional reveal behaviour | Test that fields appear/hide based on radio selection |

## Test Environment

- **Framework**: Jest + Supertest + supertest-session
- **Session setup**: Extend `sessionHelper.js` with `navigateToContactPreferences()`
- **Fixtures**: Registered email and address must be in session before tests

## Assumptions for Testing

1. Registered email available at `session.user.email_registered` or fallback `session.user.email`
2. Registered address available at `session.user.registeredAddress` with structure:
   ```js
   {
     buildingAndStreet: '123 Registered Street',
     addressLine2: '',
     townOrCity: 'London',
     county: 'Greater London',
     postcode: 'SW1A 1AA'
   }
   ```
3. Postcode lookup returns results for `LU5 6TB` (as per developer notes)
4. Phone validation: digits only after stripping, length 7-15
