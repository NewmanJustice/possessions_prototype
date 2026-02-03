# Screen 37: Statement of Truth - Test Plan

## Scope

### In Scope
- GET `/claims/statement-of-truth` - page rendering and content
- POST `/claims/statement-of-truth` - form submission and validation
- Session persistence of "completed by" selection
- Navigation flows (Previous, Continue, Cancel)
- Accessibility compliance (error summary, focus, labelling)
- Error state handling (page title prefix)

### Out of Scope
- Electronic signature capture
- Timestamp recording
- Conditional content based on selection
- Legal representative detail fields
- CPR integration

## Test Types

| Type | Coverage |
|------|----------|
| Integration | Route handlers, session management, redirects |
| Functional | Form validation, data persistence, navigation |
| Accessibility | Error summary, focus management, ARIA labels |

## Risks and Constraints

1. **Prototype Limitation**: Tests cannot verify actual legal acknowledgement flow
2. **Session Dependency**: Tests require navigation through prior screens to establish session state
3. **No Visual Testing**: Cannot verify exact layout or styling of statement text

## Test Strategy

1. Use `supertest-session` for session persistence across requests
2. Navigate through journey using `navigateToStatementOfTruth` helper
3. Test each acceptance criterion with dedicated test cases
4. Verify error handling follows GOV.UK patterns
5. Ensure session data persists correctly across page revisits

## Dependencies

- Screen 36 (`/claims/completing-your-claim`) must be functional
- Navigation helper chain must work correctly
- Session middleware must be configured
