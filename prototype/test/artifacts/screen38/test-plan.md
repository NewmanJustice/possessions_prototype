# Screen 38: Check Your Answers - Test Plan

## Scope

### In Scope
- GET `/claims/check-your-answers` - page rendering and content
- POST `/claims/check-your-answers` - navigation handling (no form validation)
- Display of page heading and case number
- Display of summary list with GOV.UK pattern
- Presence of Change links (not functionality)
- Presence of all required question sections
- Navigation flows (Previous, Submit and pay, Cancel)
- Accessibility compliance (semantic HTML, accessible Change links)

### Out of Scope
- Functional Change link navigation
- Dynamic data population from session
- Form validation (none required - read-only page)
- Inline editing
- PDF generation
- Print functionality

## Test Types

| Type | Coverage |
|------|----------|
| Integration | Route handlers, redirects |
| Functional | Page content display, navigation |
| Accessibility | Summary list semantics, Change link accessibility |

## Risks and Constraints

1. **Prototype Limitation**: Change links are illustrative only, not functional
2. **Hardcoded Data**: Summary data is hardcoded, not dynamically populated
3. **Session Dependency**: Tests require navigation through prior screens to establish session state
4. **No Visual Testing**: Cannot verify exact layout or styling

## Test Strategy

1. Use `supertest-session` for session persistence across requests
2. Navigate through journey using `navigateToCheckYourAnswers` helper
3. Test page content presence (headings, sections, Change links)
4. Test navigation flows (Previous, Submit and pay, Cancel)
5. Verify accessibility patterns (summary list semantics)
6. Focus on content display rather than data accuracy (hardcoded)

## Dependencies

- Screen 37 (`/claims/statement-of-truth`) must be functional
- Navigation helper chain must work correctly
- Session middleware must be configured

## Key Test Focus Areas

Since this is a read-only summary page, tests focus on:
1. **Content presence**: All required sections and questions are displayed
2. **Navigation**: Correct routing for Previous, Submit and pay, Cancel
3. **Accessibility**: Proper semantic HTML for summary lists and Change links
4. **GOV.UK patterns**: Summary list component is correctly structured
