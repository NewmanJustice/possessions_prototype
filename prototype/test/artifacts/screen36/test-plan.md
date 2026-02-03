# Screen 36: Completing Your Claim - Test Plan

## Scope

### In Scope
- GET `/claims/completing-your-claim` - page rendering and content
- POST `/claims/completing-your-claim` - form submission and validation
- Session persistence of completion preference
- Navigation flows (Previous, Continue, Cancel)
- Accessibility compliance (error summary, focus, labelling)
- Error state handling (page title prefix)

### Out of Scope
- Different routing based on selection (prototype limitation)
- Payment integration
- Email notifications
- Persistent draft storage beyond session

## Test Types

| Type | Coverage |
|------|----------|
| Integration | Route handlers, session management, redirects |
| Functional | Form validation, data persistence, navigation |
| Accessibility | Error summary, focus management, ARIA labels |

## Risks and Constraints

1. **Prototype Limitation**: Both options route to same destination, cannot verify branching logic
2. **Session Dependency**: Tests require navigation through prior screens to establish session state
3. **No Visual Testing**: Cannot verify exact layout or styling

## Test Strategy

1. Use `supertest-session` for session persistence across requests
2. Navigate through journey using `navigateToCompletingYourClaim` helper
3. Test each acceptance criterion with dedicated test cases
4. Verify error handling follows GOV.UK patterns
5. Ensure session data persists correctly across page revisits

## Dependencies

- Screen 35 (`/claims/language-used`) must be functional
- Navigation helper chain must work correctly
- Session middleware must be configured
