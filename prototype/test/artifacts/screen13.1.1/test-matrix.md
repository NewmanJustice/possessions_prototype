# Screen 13.1.1: Assured Tenancy Grounds Selection - Test Behaviour Matrix

## Grounds Checkboxes

| Test ID | Scenario | Input | Expected | AC |
|---------|----------|-------|----------|-----|
| T-1.1 | Ground 8 checkbox displayed | GET | Checkbox with label "Serious rent arrears (ground 8)" | AC-1 |
| T-1.2 | Ground 10 checkbox displayed | GET | Checkbox with label "Rent arrears (ground 10)" | AC-1 |
| T-1.3 | Ground 11 checkbox displayed | GET | Checkbox with label "Persistent delay in paying rent (ground 11)" | AC-1 |
| T-2.1 | No grounds selected - valid | POST no checkboxes, radio=no | 302 redirect, no error | AC-2 |
| T-3.1 | Ground 8 only stored | POST ground8=true, radio=no | session.grounds.assuredTenancy.ground8=true | AC-3 |
| T-3.2 | Ground 10 only stored | POST ground10=true, radio=no | session.grounds.assuredTenancy.ground10=true | AC-3 |
| T-3.3 | Ground 11 only stored | POST ground11=true, radio=no | session.grounds.assuredTenancy.ground11=true | AC-3 |
| T-3.4 | Multiple grounds stored | POST ground8=true, ground10=true, radio=no | Both true in session | AC-3 |
| T-3.5 | All grounds stored | POST all grounds=true, radio=no | All three true in session | AC-3 |
| T-3.6 | Unselected grounds false | POST ground8=true only, radio=no | ground10=false, ground11=false | AC-3 |

## Other Grounds Radio

| Test ID | Scenario | Input | Expected | AC |
|---------|----------|-------|----------|-----|
| T-4.1 | Radio question displayed | GET | "Do you have any other grounds for possession?" | AC-4 |
| T-4.2 | Yes option displayed | GET | Radio option "Yes" | AC-4 |
| T-4.3 | No option displayed | GET | Radio option "No" | AC-4 |
| T-5.1 | No selection - error | POST no radio | Validation error | AC-5 |
| T-5.2 | Error message text | POST no radio | "Select whether you have other grounds for possession" | AC-5 |
| T-5.3 | Error summary shown | POST no radio | GOV.UK error summary visible | AC-5 |
| T-5.4 | Error links to radio | POST no radio | Error summary links to radio group | AC-5 |

## Branching Navigation

| Test ID | Scenario | Input | Expected | AC |
|---------|----------|-------|----------|-----|
| T-6.1 | Yes redirects correctly | POST hasAdditionalGrounds=yes | 302 /claims/other-tenancy-grounds | AC-6 |
| T-6.2 | Yes stores true | POST hasAdditionalGrounds=yes | session.grounds.hasAdditionalGrounds=true | AC-6 |
| T-7.1 | No redirects correctly | POST hasAdditionalGrounds=no | 302 /claims/reasons-for-possessions | AC-7 |
| T-7.2 | No stores false | POST hasAdditionalGrounds=no | session.grounds.hasAdditionalGrounds=false | AC-7 |

## Navigation

| Test ID | Scenario | Input | Expected | AC |
|---------|----------|-------|----------|-----|
| T-8.1 | Previous link present | GET | Link to /claims/grounds | AC-8 |
| T-8.2 | Previous navigates | Click Previous | 302 /claims/grounds | AC-8 |
| T-8.3 | Previous preserves checkboxes | Select grounds, click Previous | Grounds in session | AC-8 |
| T-8.4 | Previous preserves radio | Select radio, click Previous | Radio value in session | AC-8 |
| T-9.1 | Cancel link present | GET | Link to /case-list | AC-9 |
| T-9.2 | Cancel navigates | Click Cancel | 302 /case-list | AC-9 |
| T-9.3 | Cancel preserves draft | Click Cancel | Claim draft in session | AC-9 |

## Re-visit Behaviour

| Test ID | Scenario | Input | Expected | AC |
|---------|----------|-------|----------|-----|
| T-R.1 | Checkboxes pre-populated | GET with session data | Previously selected checked | AC-3 |
| T-R.2 | Radio pre-populated | GET with session data | Previously selected radio checked | AC-6/7 |
| T-R.3 | Mixed state preserved | GET after partial selection | Correct combination shown | AC-3 |

## Accessibility

| Test ID | Scenario | Input | Expected | AC |
|---------|----------|-------|----------|-----|
| T-10.1 | Error summary on failure | POST invalid | Error summary at top | AC-10 |
| T-10.2 | Focus on error summary | POST invalid | Focus moves to summary | AC-10 |
| T-10.3 | Checkboxes labelled | GET | Each checkbox has label | AC-10 |
| T-10.4 | Radios labelled | GET | Each radio has label | AC-10 |
| T-10.5 | Keyboard accessible | Tab navigation | All controls reachable | AC-10 |

## Cross-cutting

| Test ID | Scenario | Input | Expected | AC |
|---------|----------|-------|----------|-----|
| T-X.1 | Auth required | GET unauthenticated | 302 to sign-in | - |
| T-X.2 | SOLICITOR required | GET as CLAIMANT | 403 or redirect | - |
| T-X.3 | Page title | GET | "Grounds for possession - Possessions - GOV.UK" | - |
| T-X.4 | Error page title | POST invalid | "Error: Grounds for possession - Possessions - GOV.UK" | - |

## Coverage Summary

| Category | Tests | ACs Covered |
|----------|-------|-------------|
| Grounds Checkboxes | 10 | AC-1, AC-2, AC-3 |
| Other Grounds Radio | 7 | AC-4, AC-5 |
| Branching Navigation | 4 | AC-6, AC-7 |
| Navigation | 7 | AC-8, AC-9 |
| Re-visit | 3 | AC-3, AC-6, AC-7 |
| Accessibility | 5 | AC-10 |
| Cross-cutting | 4 | - |
| **TOTAL** | **40** | **AC-1 to AC-10** |
