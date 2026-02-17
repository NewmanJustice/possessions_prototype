# Screen 40: Claimant Ineligible (Welsh) - Test Plan

## Scope

### In Scope
- GET `/claims/claimant-ineligible-welsh` - page rendering and content
- Display of ineligibility message and guidance
- Navigation to case list or exit
- Accessibility compliance (heading, structure, keyboard navigation)

### Out of Scope
- POST handler (no form submission)
- Wales-specific claim submission
- Session data modification
- Editing claim data

## Test Types

| Type           | Coverage                                 |
|----------------|------------------------------------------|
| Integration    | Route handler, page rendering            |
| Functional     | Content display, navigation links        |
| Accessibility  | Heading structure, keyboard navigation   |
| Negative       | Absence of claim progression options     |

## Risks and Constraints
- Prototype: navigation simulates return to case list
- Content may change if Figma design is updated
- Session state must be set up to reach this screen
- No visual regression testing (styling not pixel-perfect)

## Test Strategy
1. Use `supertest-session` for session persistence
2. Use navigation helper to reach `/claims/claimant-ineligible-welsh` with correct session state
3. Test content presence (heading, guidance, links)
4. Test navigation destinations (all go to `/case-list` or exit)
5. Verify absence of claim progression options
6. Verify accessibility patterns (heading, structure, keyboard navigation)
7. Focus on GET request only

## Dependencies
- `/claims/claimant-type` and `/claims/border-postcode` must be functional
- Navigation helper must set up session state
- Session middleware must be configured

## Key Test Focus Areas
- Content presence: ineligibility message, guidance, navigation
- Navigation destinations: all links/buttons go to correct destination
- Absent elements: no continue/submit/claim progression
- Accessibility: heading structure, semantic HTML
