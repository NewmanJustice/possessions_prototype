# Test Behaviour Matrix — Screen 26: Alternatives to Possession

## Acceptance Criteria → Test Behaviours

### AC-1: Display alternatives guidance

**Behaviour:**
- T-1.1: Page displays heading "Alternatives to possession"
- T-1.2: Guidance text explains suspension of the defendants' right to buy
- T-1.3: Guidance text explains demotion of tenancy
- T-1.4: Guidance explains these are alternatives a judge may consider if possession is not reasonable
- T-1.5: Page is accessible at `/claims/alternative-to-possession`

**Test IDs:** T-1.1, T-1.2, T-1.3, T-1.4, T-1.5

---

### AC-2: Display alternative options

**Behaviour:**
- T-2.1: Question displayed: "In the alternative to possession, would you like to claim suspension of right to buy or demotion of tenancy? (Optional)"
- T-2.2: Checkbox option "Suspension of right to buy" displayed
- T-2.3: Checkbox option "Demotion of tenancy" displayed
- T-2.4: Checkboxes use correct name attributes (`suspensionOfRightToBuy` and `demotionOfTenancy`)
- T-2.5: Both checkboxes initially unchecked on first visit

**Test IDs:** T-2.1, T-2.2, T-2.3, T-2.4, T-2.5

---

### AC-3: Selection is optional

**Behaviour:**
- T-3.1: Submitting with no checkboxes selected is accepted
- T-3.2: No validation error displayed when continuing with no selection
- T-3.3: Continue button functions with no selection
- T-3.4: Page redirects correctly when no selection made

**Test IDs:** T-3.1, T-3.2, T-3.3, T-3.4

---

### AC-4: Mutually exclusive selection enforced

**Behaviour:**
- T-4.1: Selecting "Suspension of right to buy" prevents simultaneous selection of "Demotion of tenancy"
- T-4.2: Selecting "Demotion of tenancy" prevents simultaneous selection of "Suspension of right to buy"
- T-4.3: UI may disable second checkbox when first is selected
- T-4.4: Server validates that both checkboxes cannot be submitted simultaneously
- T-4.5: Attempting to submit both checkboxes via form manipulation returns validation error

**Test IDs:** T-4.1, T-4.2, T-4.3, T-4.4, T-4.5

---

### AC-5: Persist alternatives selection

**Behaviour:**
- T-5.1: No selection stores `session.claim.alternativesToPossession = { suspensionOfRightToBuy: false, demotionOfTenancy: false }`
- T-5.2: Suspension selection stores `session.claim.alternativesToPossession = { suspensionOfRightToBuy: true, demotionOfTenancy: false }`
- T-5.3: Demotion selection stores `session.claim.alternativesToPossession = { suspensionOfRightToBuy: false, demotionOfTenancy: true }`
- T-5.4: Both properties always present in session object (never undefined)
- T-5.5: Selection persisted before navigation occurs

**Test IDs:** T-5.1, T-5.2, T-5.3, T-5.4, T-5.5

---

### AC-6: Previous navigation

**Behaviour:**
- T-6.1: Clicking Previous redirects to `/claims/defendants-circumstances`
- T-6.2: Previously entered session data preserved when navigating back
- T-6.3: No validation on Previous click
- T-6.4: Claim data remains intact

**Test IDs:** T-6.1, T-6.2, T-6.3, T-6.4

---

### AC-7: Continue with no selection routes to claiming costs

**Behaviour:**
- T-7.1: Submitting with neither checkbox selected redirects to `/claims/claiming-costs`
- T-7.2: Navigation occurs after selection is persisted
- T-7.3: Session shows both properties as false

**Test IDs:** T-7.1, T-7.2, T-7.3

---

### AC-8: Continue with suspension selected routes to housing-act suspension

**Behaviour:**
- T-8.1: Selecting "Suspension of right to buy" and clicking Continue redirects to `/claims/select-housing-act-suspension`
- T-8.2: Session contains `suspensionOfRightToBuy: true`
- T-8.3: Session contains `demotionOfTenancy: false`
- T-8.4: Navigation occurs after selection is persisted

**Test IDs:** T-8.1, T-8.2, T-8.3, T-8.4

---

### AC-9: Continue with demotion selected routes to housing-act demotion

**Behaviour:**
- T-9.1: Selecting "Demotion of tenancy" and clicking Continue redirects to `/claims/select-housing-act-demotion`
- T-9.2: Session contains `demotionOfTenancy: true`
- T-9.3: Session contains `suspensionOfRightToBuy: false`
- T-9.4: Navigation occurs after selection is persisted

**Test IDs:** T-9.1, T-9.2, T-9.3, T-9.4

---

### AC-10: Accessibility compliance

**Behaviour:**
- T-10.1: All checkboxes are keyboard accessible (Tab key navigates)
- T-10.2: Checkboxes are properly labelled (associated via for/id attributes)
- T-10.3: Mutually exclusive behaviour conveyed to assistive technologies
- T-10.4: Validation errors (if any) announced via GOV.UK error summary
- T-10.5: Focus management on error: focus moves to error summary
- T-10.6: Error summary has correct tabindex="-1"
- T-10.7: Page meets GOV.UK accessibility standards
- T-10.8: ARIA attributes present and correct

**Test IDs:** T-10.1, T-10.2, T-10.3, T-10.4, T-10.5, T-10.6, T-10.7, T-10.8

---

## Additional Behaviours (Cross-Cutting)

### Selection Change Behavior
- T-CHG-1: Changing from no selection to suspension updates session
- T-CHG-2: Changing from no selection to demotion updates session
- T-CHG-3: Changing from suspension to demotion updates session
- T-CHG-4: Changing from demotion to suspension updates session
- T-CHG-5: Deselecting all checkboxes after selection returns to no-selection state

**Test IDs:** T-CHG-1, T-CHG-2, T-CHG-3, T-CHG-4, T-CHG-5

### Pre-Population on Revisit
- T-PRE-1: "Suspension of right to buy" pre-checked when `suspensionOfRightToBuy === true`
- T-PRE-2: "Demotion of tenancy" pre-checked when `demotionOfTenancy === true`
- T-PRE-3: Both unchecked when both session properties false
- T-PRE-4: Pre-selection survives navigation away and back

**Test IDs:** T-PRE-1, T-PRE-2, T-PRE-3, T-PRE-4

### Mutual Exclusivity Enforcement
- T-MEX-1: Client-side: selecting suspension disables demotion checkbox
- T-MEX-2: Client-side: selecting demotion disables suspension checkbox
- T-MEX-3: Client-side: deselecting enables other checkbox
- T-MEX-4: Server-side: validates both cannot be true in request payload
- T-MEX-5: Form submission with both true rejected with validation error

**Test IDs:** T-MEX-1, T-MEX-2, T-MEX-3, T-MEX-4, T-MEX-5

### Entry Condition
- T-ENTRY-1: Page accessible only when arriving from Screen 25 (defendants-circumstances)
- T-ENTRY-2: Session initialized with `alternativesToPossession` on first visit
- T-ENTRY-3: Claim data from Screen 25 remains intact

**Test IDs:** T-ENTRY-1, T-ENTRY-2, T-ENTRY-3

### Cancel Behavior
- T-CANCEL-1: Clicking Cancel redirects to case list
- T-CANCEL-2: Draft claim remains in session after Cancel

**Test IDs:** T-CANCEL-1, T-CANCEL-2

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Page Display & Guidance | 5 | AC-1 |
| Checkbox Options Display | 5 | AC-2 |
| Optional Selection | 4 | AC-3 |
| Mutual Exclusivity | 5 | AC-4 |
| Session Persistence | 5 | AC-5 |
| Previous Navigation | 4 | AC-6 |
| No Selection Routing | 3 | AC-7 |
| Suspension Routing | 4 | AC-8 |
| Demotion Routing | 4 | AC-9 |
| Accessibility | 8 | AC-10 |
| Selection Change | 5 | Cross-cutting |
| Pre-Population | 4 | Cross-cutting |
| Mutual Exclusivity Enforcement | 5 | Cross-cutting |
| Entry Condition | 3 | Cross-cutting |
| Cancel Behavior | 2 | Cross-cutting |
| **Total** | **66** | **Estimated test count** |

---

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2, T-1.3, T-1.4, T-1.5 | Page heading and guidance |
| AC-2 | T-2.1, T-2.2, T-2.3, T-2.4, T-2.5 | Checkbox options display |
| AC-3 | T-3.1, T-3.2, T-3.3, T-3.4 | Optional selection |
| AC-4 | T-4.1, T-4.2, T-4.3, T-4.4, T-4.5 | Mutual exclusivity |
| AC-5 | T-5.1, T-5.2, T-5.3, T-5.4, T-5.5 | Session persistence |
| AC-6 | T-6.1, T-6.2, T-6.3, T-6.4 | Previous navigation |
| AC-7 | T-7.1, T-7.2, T-7.3 | No selection routing |
| AC-8 | T-8.1, T-8.2, T-8.3, T-8.4 | Suspension routing |
| AC-9 | T-9.1, T-9.2, T-9.3, T-9.4 | Demotion routing |
| AC-10 | T-10.1, T-10.2, T-10.3, T-10.4, T-10.5, T-10.6, T-10.7, T-10.8 | Accessibility |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-29.*
