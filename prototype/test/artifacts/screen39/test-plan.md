# Screen 39: Pay Claim Fee - Test Plan

## Scope

### In Scope
- GET `/claims/pay-claim-fee` - page rendering and content
- Display of page heading "Pay claim fee"
- Display of case number
- Display of primary payment button with correct text and styling
- Display of "Make a payment" section heading
- Display of instructional text with embedded payment link
- Display of close and return button
- All navigation links redirecting to `/case-list`
- Absence of Previous button
- Absence of Cancel link
- Accessibility compliance (heading levels, button semantics, link accessibility)

### Out of Scope
- POST handler (no form submission on this page)
- Actual payment integration
- Payment status tracking
- Dynamic fee calculation
- Session data modification

## Test Types

| Type | Coverage |
|------|----------|
| Integration | Route handler, page rendering |
| Functional | Content display, navigation links |
| Accessibility | Heading structure, button semantics, keyboard navigation |
| Negative | Absence of Previous/Cancel elements |

## Risks and Constraints

1. **Prototype Limitation**: Payment links simulate payment by redirecting to case-list
2. **Hardcoded Data**: Case number is illustrative, not dynamically generated
3. **Session Dependency**: Tests require navigation through entire journey to establish session state
4. **No Visual Testing**: Cannot verify exact button styling (start button appearance)
5. **Final Screen**: No subsequent screen to test forward navigation to

## Test Strategy

1. Use `supertest-session` for session persistence across requests
2. Navigate through journey using `navigateToPayClaimFee` helper
3. Test page content presence (heading, case number, buttons, links, text)
4. Test navigation link destinations (all should go to /case-list)
5. Verify absence of Previous button and Cancel link
6. Verify accessibility patterns (heading levels, button types)
7. Focus on GET request only (no POST handler exists)

## Dependencies

- Screen 38 (`/claims/check-your-answers`) must be functional
- Navigation helper chain must work correctly
- Session middleware must be configured

## Key Test Focus Areas

Since this is the FINAL read-only page in the journey, tests focus on:
1. **Content presence**: All required elements are displayed
2. **Navigation destinations**: All links/buttons go to correct destination
3. **Absent elements**: No Previous button, no Cancel link
4. **Accessibility**: Proper heading structure and semantic HTML
5. **Button styling classes**: Start button and secondary button patterns
