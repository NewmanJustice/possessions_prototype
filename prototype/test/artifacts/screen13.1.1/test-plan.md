# Screen 13.1.1: Assured Tenancy Grounds Selection - Test Plan

## Scope

### In Scope
- GET `/claims/grounds-for-possession-assured-selection` - Page rendering
- POST `/claims/grounds-for-possession-assured-selection` - Form submission and validation
- Checkbox selection (grounds 8, 10, 11) - all optional
- Radio selection validation (required UNLESS button pressed)
- **"Add additional grounds" button** - immediate redirect behavior
- Branching logic (Yes/button → additional grounds, No → preaction protocol)
- Session storage of grounds and hasAdditionalGrounds
- Navigation (Previous, Continue, Cancel, Button)
- GOV.UK error summary and inline error display
- Focus management on validation failure
- Selection preservation on validation error and revisit

### Out of Scope
- Additional grounds page (Screen 14.x - separate)
- Preaction protocol page (Screen 16 - separate)
- Legal validation of selected grounds

## Types of Tests

| Type | Purpose |
|------|---------|
| Integration | Route behaviour, session handling, redirects |
| Validation | Radio selection required (unless button pressed) |
| State | Session data persistence (grounds + hasAdditionalGrounds) |
| Navigation | Previous/Continue/Cancel/Button behaviour |
| Branching | Conditional redirects based on Yes/No/Button |
| Button | "Add additional grounds" immediate redirect logic |
| Accessibility | Error summary, focus management, labels, button accessibility |

## Risks and Constraints

| Risk | Mitigation |
|------|------------|
| Button vs Continue confusion | Test both paths independently |
| Validation bypass via button | Ensure no error when button pressed |
| Button accessibility | Test keyboard focus and accessible name |
| Screen 16 not yet implemented | Test expects redirect only, not page content |
| Multiple interaction paths | Test all combinations (button only, radio only, both) |

## Test Environment

- **Framework**: Jest + Supertest + supertest-session
- **Session setup**: Use `navigateToAssuredTenancyGrounds()` from sessionHelper
- **Fixtures**: Assured confirmation (Screen 13.1) must be completed before tests

## Assumptions for Testing

1. Previous page: `/claims/grounds-for-possession-assured-confirmation` (Screen 13.1)
2. Next pages:
   - Yes radio OR button → `/claims/grounds-for-possession`
   - No radio → `/claims/preaction-protocol`
3. Session storage: 
   - `session.claim.grounds.assuredTenancy` (object with ground8/10/11)
   - `session.claim.grounds.hasAdditionalGrounds` (boolean)
4. Checkbox values: `ground8`, `ground10`, `ground11`
5. Radio values: `'yes'` and `'no'` (lowercase strings)
6. Button name: `'addAdditionalGrounds'` or similar
7. Error message: "Select whether you have additional grounds for possession"
8. Page title: "Grounds for possession"
9. Button is primary (green) style, positioned underneath radios
10. Button behavior: Immediate POST redirect, bypasses Continue button

## Button Test Strategy

The "Add additional grounds" button requires special attention:

- **Button rendering:** Visible, labelled, styled as primary
- **Button accessibility:** Keyboard focusable, accessible name
- **Button behavior:** 
  - Immediate redirect (no Continue click needed)
  - Stores `hasAdditionalGrounds = true`
  - Redirects to `/claims/grounds-for-possession`
- **Validation bypass:** No error when button pressed (even without radio selection)
- **Independence:** Button works regardless of checkbox/radio state
