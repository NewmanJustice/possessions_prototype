# Screen 15: Reasons for Possession - Test Plan

## Scope and Objectives

### In Scope
- GET /claims/reasons-for-possession - Page rendering with dynamic content
- POST /claims/reasons-for-possession - Form submission and loop navigation
- Loop iteration through multiple grounds
- Session persistence of reasons per ground
- Validation (500 character limit)
- Navigation (Previous, Continue, Cancel)
- Pre-population on revisit

### Out of Scope
- Legal sufficiency of reasons (not validated)
- Document upload (happens later)
- Internal claimService implementation details

## Test Types

1. **Integration tests** (supertest-session)
   - HTTP request/response testing
   - Session state verification via page content
   - Navigation flow verification
   - Form validation behaviour

## Risks and Unknowns

| Risk | Mitigation |
|------|------------|
| Complex loop state management | Test multiple entry points and ground combinations |
| Session state corruption on error | Test validation failure preserves loop state |
| Ground key mapping errors | Verify heading displays correct ground name/number |

## Test Strategy

### Happy Path Coverage
- Single ground: Submit reasons, redirect to pre-action protocol
- Multiple grounds: Complete loop iteration
- Empty submission: Accept without error

### Edge Case Coverage
- No grounds selected (redirect to pre-action protocol)
- Exactly 500 characters (accepted)
- 501 characters (validation error)
- Previous from first ground (return to grounds-for-possession)
- Previous from middle ground (return to previous ground)
- Whitespace-only input handling

### Error Coverage
- Character limit exceeded
- Error summary display
- Error linking to textarea
- Input preservation on error

### Navigation Coverage
- Continue within loop
- Continue completing loop
- Previous within loop
- Previous exiting loop
- Cancel behaviour

## Test Environment

- **Framework**: Jest with supertest-session
- **Entry point**: Via navigateToReasonsForPossession helper (to be created)
- **Test data**: Ground selections from assured and additional grounds

## Dependencies

Tests depend on:
- Session helper: `createAuthenticatedSession`
- Navigation to assured grounds: `navigateToAssuredTenancyGrounds`
- Route implementation in claims.js
- Template implementation in reasons-for-possession.njk
