# Screen 13.1: Assured Journey Confirmation - Test Plan

## Scope

### In Scope
- GET `/claims/grounds-for-possession-assured-confirmation` - Page rendering
- POST `/claims/grounds-for-possession-assured-confirmation` - Form submission and validation
- Radio selection validation (required)
- Branching logic (Yes → Screen 13.1.1, No → Screen 14.1)
- Session storage of `assuredProceed` boolean
- Navigation (Previous, Continue, Cancel)
- GOV.UK error summary and inline error display
- Focus management on validation failure
- Selection preservation on validation error

### Out of Scope
- Assured grounds selection screen (Screen 13.1.1)
- General grounds selection screen (Screen 14.1)
- Toggling between journeys after completion

## Types of Tests

| Type | Purpose |
|------|---------|
| Integration | Route behaviour, session handling, redirects |
| Validation | Radio selection required |
| State | Session data persistence (`assuredProceed`) |
| Navigation | Previous/Continue/Cancel link behaviour |
| Branching | Conditional redirects based on Yes/No |
| Accessibility | Error summary, focus management, labels |

## Risks and Constraints

| Risk | Mitigation |
|------|------------|
| Users accessing without assured tenancy | Assume route guard checks groundsModel |
| Screen 14.1 not yet implemented | Test expects redirect only, not page content |
| Selection preservation complexity | Test both error repopulation and revisit scenarios |

## Test Environment

- **Framework**: Jest + Supertest + supertest-session
- **Session setup**: Extend `sessionHelper.js` with `navigateToAssuredConfirmation()`
- **Fixtures**: Tenancy details with assured-tenancy must be completed before tests

## Assumptions for Testing

1. Previous page: `/claims/tenancy` (with groundsModel = 'ASSURED')
2. Next pages:
   - Yes → `/claims/grounds-for-possession-assured-selection`
   - No → `/claims/grounds-for-possession`
3. Session storage: `session.claim.grounds.assuredProceed` (boolean)
4. Radio values: `'yes'` and `'no'` (lowercase strings)
5. Error message: "Select whether you want to proceed with assured-tenancy grounds"
6. Page title: "Assured tenancy grounds confirmation" (or similar)
7. AC-4 note about preserving Screen 14.1 answers is out of scope for prototype
