# Test Plan - Screen 35: Language Used

## Scope

### In Scope
- Page content display (heading, caption, case number, question, hint text)
- Radio button options (English, Welsh, English and Welsh)
- Validation (required selection)
- Session persistence
- Previous navigation to Screen 34
- Continue navigation to Screen 36
- Cancel behaviour
- Accessibility (error summary, focus management, page title)

### Out of Scope
- Screen 36 implementation
- Welsh Language Unit notification functionality (mocked)
- Actual translation services
- Dynamic content changes based on selection

## Test Categories

1. **GET Route Tests** - Page content, pre-population
2. **POST Route Tests** - Validation, navigation, persistence, accessibility

## Risks and Constraints

| Risk | Mitigation |
|------|------------|
| Screen 34 not implemented | Tests may fail until Screen 34 exists; use navigation helper |
| Session structure differs from assumption | Verify session path in implementation guide |

## Test Data

- Valid language values: `english`, `welsh`, `english-and-welsh`
- Invalid submission: empty/missing `language` field
- Field name: `language`

## Dependencies

- Screen 34 (`/claims/applications`) must be navigable
- Session helper `navigateToLanguageUsed` required
