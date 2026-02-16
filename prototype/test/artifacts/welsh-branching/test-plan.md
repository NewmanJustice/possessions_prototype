# Test Plan: Welsh Branching (Border Postcode)

## Test Objectives
- Verify Wales/England selection is captured and stored in session
- Validate navigation (continue, previous, cancel)
- Confirm error handling and accessibility

## Test Types
- Integration tests (Supertest + session)
- Accessibility checks (GOV.UK error summary, focus)

## Test Data
- Wales selection
- England selection
- No selection (error)

## Pre-conditions
- Authenticated professional user
- Access code passed

## Post-conditions
- Session updated with isWales
- Navigation to correct next screen

## Risks
- Session not updated
- Branching logic not triggered
- Accessibility issues

## References
- User story: businessArtifacts/userstories/welsh-branching.txt
- Session helper: prototype/test/helpers/sessionHelper.js
