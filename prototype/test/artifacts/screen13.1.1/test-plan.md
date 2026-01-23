# Screen 13.1.1: Assured Tenancy Grounds Selection - Test Plan

## Scope
Tests for `/claims/assured-tenancy-grounds-selection` covering grounds checkboxes, other grounds radio, branching navigation, and session persistence.

## Test Categories

### 1. Page Rendering (GET)
- Page loads with correct title
- All three ground checkboxes displayed (8, 10, 11)
- Explanatory text displayed
- Other grounds radio question displayed
- Previous, Continue, Cancel buttons present

### 2. Grounds Checkboxes (AC-1, AC-2, AC-3)
- Ground 8 checkbox present and labelled
- Ground 10 checkbox present and labelled
- Ground 11 checkbox present and labelled
- Can submit with no checkboxes selected
- Can submit with single checkbox selected
- Can submit with multiple checkboxes selected
- Can submit with all checkboxes selected
- Selected grounds stored in session

### 3. Other Grounds Radio (AC-4, AC-5)
- Radio question displayed
- Yes option present
- No option present
- Validation error when neither selected
- Error summary links to radio group

### 4. Branching Navigation (AC-6, AC-7)
- Yes → redirects to `/claims/other-tenancy-grounds`
- Yes → sets `hasAdditionalGrounds = true`
- No → redirects to `/claims/reasons-for-possessions`
- No → sets `hasAdditionalGrounds = false`

### 5. Navigation (AC-8, AC-9)
- Previous returns to `/claims/grounds`
- Previous preserves selections in session
- Cancel returns to `/case-list`
- Cancel preserves claim draft

### 6. Re-visit Behaviour
- Previously selected checkboxes are pre-checked
- Previously selected radio is pre-selected

### 7. Accessibility (AC-10)
- Error summary shown on validation failure
- Focus moves to error summary
- Checkboxes properly labelled
- Radios properly labelled
- Keyboard accessible

### 8. Cross-cutting
- Authentication required
- SOLICITOR role required
- Session preserves data through journey

## Test Data

### Valid Submissions
| Scenario | ground8 | ground10 | ground11 | hasAdditionalGrounds | Expected Redirect |
|----------|---------|----------|----------|---------------------|-------------------|
| No grounds, Yes other | - | - | - | yes | /claims/other-tenancy-grounds |
| No grounds, No other | - | - | - | no | /claims/reasons-for-possessions |
| All grounds, Yes | ✓ | ✓ | ✓ | yes | /claims/other-tenancy-grounds |
| All grounds, No | ✓ | ✓ | ✓ | no | /claims/reasons-for-possessions |
| Single ground | ✓ | - | - | no | /claims/reasons-for-possessions |

### Invalid Submissions
| Scenario | Error Message |
|----------|---------------|
| No radio selected | "Select whether you have other grounds for possession" |

## Dependencies
- `navigateToAssuredTenancyGrounds` helper needed in sessionHelper.js
- Must chain through: auth → claims/start → ... → grounds (Yes) → this page
