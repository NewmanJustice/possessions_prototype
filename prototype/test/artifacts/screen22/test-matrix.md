# Test Behaviour Matrix — Screen 22: Details of Rent Arrears

## Acceptance Criteria → Test Behaviours

### AC-1: Display rent statement guidance

**Behaviour:**
- T-1.1: Page displays rent statement guidance section
- T-1.2: Guidance explains what the rent statement must show (4 requirements)
- T-1.3: Guidance explains the period the rent statement must cover

**Test IDs:** T-1.1, T-1.2, T-1.3

---

### AC-2: Upload rent statement (optional)

**Behaviour:**
- T-2.1: Page displays optional upload section with "Add new" button
- T-2.2: User can continue without uploading a document (no validation error)
- T-2.3: Upload section is clearly marked as optional

**Test IDs:** T-2.1, T-2.2, T-2.3

---

### AC-3: Successful upload stores metadata only

**Behaviour:**
- T-3.1: Document metadata structure includes id, name, uploadedAt
- T-3.2: Metadata stored in `session.claim.rentArrears.documents` array
- T-3.3: Documents array can be empty `[]` when no upload

**Note:** Actual upload mechanism not tested (out of scope per Q2)

**Test IDs:** T-3.1, T-3.2, T-3.3

---

### AC-5: Display total rent arrears input

**Behaviour:**
- T-5.1: Page displays "How much are the total rent arrears..." question
- T-5.2: Currency input labelled "Total rent arrears"
- T-5.3: Input accepts numeric values with £ format

**Test IDs:** T-5.1, T-5.2, T-5.3

---

### AC-6: Total rent arrears required and numeric

**Behaviour:**
- T-6.1: Submitting without total arrears shows error
- T-6.2: Error message: "Enter the total rent arrears as a number greater than 0"
- T-6.3: Submitting £0 shows error (not greater than 0)
- T-6.4: Submitting negative amount shows error
- T-6.5: Submitting non-numeric value shows error
- T-6.6: Submitting more than 2 decimal places shows error
- T-6.7: Submitting amount over £1,000,000 shows error
- T-6.8: GOV.UK error summary and inline error displayed
- T-6.9: Focus moves to error summary

**Test IDs:** T-6.1 to T-6.9 (9 tests)

---

### AC-7: Ask about third-party payments

**Behaviour:**
- T-7.1: Page displays question about payments by someone other than defendants
- T-7.2: Question text matches AC exactly
- T-7.3: Yes and No radio options displayed

**Test IDs:** T-7.1, T-7.2, T-7.3

---

### AC-8: Third-party selection required

**Behaviour:**
- T-8.1: Submitting without selecting Yes/No shows error
- T-8.2: Error message: "Select whether any rent payments were made by someone other than the defendants"
- T-8.3: GOV.UK error summary and inline error displayed
- T-8.4: Focus moves to error summary

**Test IDs:** T-8.1, T-8.2, T-8.3, T-8.4

---

### AC-9: Reveal payment source options when Yes selected

**Behaviour:**
- T-9.1: Selecting Yes reveals payment sources checkbox group
- T-9.2: Payment sources include: Universal Credit
- T-9.3: Payment sources include: Housing Benefit
- T-9.4: Payment sources include: Discretionary Housing Payment
- T-9.5: Payment sources include: Homeless prevention fund
- T-9.6: Payment sources include: Other
- T-9.7: All 5 payment sources displayed as checkboxes

**Test IDs:** T-9.1 to T-9.7 (7 tests)

---

### AC-10: At least one payment source required when Yes selected

**Behaviour:**
- T-10.1: Selecting Yes with no payment sources shows error
- T-10.2: Error message: "Select at least one payment source"
- T-10.3: GOV.UK error summary and inline error displayed
- T-10.4: Focus moves to error summary

**Test IDs:** T-10.1, T-10.2, T-10.3, T-10.4

---

### AC-11: "Other" reveals payment source details field

**Behaviour:**
- T-11.1: Selecting Other checkbox reveals text input
- T-11.2: Text input labelled "Payment source"
- T-11.3: Field is required when revealed

**Test IDs:** T-11.1, T-11.2, T-11.3

---

### AC-12: Validate payment source details

**Behaviour:**
- T-12.1: Selecting Other without entering details shows error
- T-12.2: Error message: "Enter the payment source"
- T-12.3: GOV.UK error summary and inline error displayed
- T-12.4: Focus moves to error summary

**Test IDs:** T-12.1, T-12.2, T-12.3, T-12.4

---

### AC-13: Persist rent arrears details

**Behaviour:**
- T-13.1: Total arrears stored as number in `session.claim.rentArrears.totalArrears`
- T-13.2: Third-party payments stored as boolean in `thirdPartyPayments`
- T-13.3: Universal Credit selection stored in `paymentSources.universalCredit`
- T-13.4: Housing Benefit selection stored in `paymentSources.housingBenefit`
- T-13.5: Discretionary Housing Payment stored in `paymentSources.discretionaryHousingPayment`
- T-13.6: Homeless prevention fund stored in `paymentSources.homelessPreventionFund`
- T-13.7: Other selection stored in `paymentSources.other`
- T-13.8: Other details stored in `paymentSources.otherDetails`
- T-13.9: All payment sources use camelCase keys
- T-13.10: Deselected payment sources set to `false` (not undefined)
- T-13.11: otherDetails set to `null` when Other not selected

**Test IDs:** T-13.1 to T-13.11 (11 tests)

---

### AC-14: Previous navigation

**Behaviour:**
- T-14.1: Clicking Previous redirects to `/claims/daily-rent-amount`
- T-14.2: Previously entered data preserved in session

**Test IDs:** T-14.1, T-14.2

---

### AC-15: Continue navigation

**Behaviour:**
- T-15.1: Clicking Continue (valid submission) redirects to `/claims/money-judgement`
- T-15.2: Data persisted before navigation

**Test IDs:** T-15.1, T-15.2

---

### AC-16: Cancel behaviour

**Behaviour:**
- T-16.1: Clicking Cancel redirects to `/case-list`
- T-16.2: Draft claim remains in session after Cancel

**Test IDs:** T-16.1, T-16.2

---

### AC-17: Accessibility compliance

**Behaviour:**
- T-17.1: GOV.UK error summary displayed on validation failure
- T-17.2: Error links target relevant inputs/checkboxes/radios
- T-17.3: Focus moves to error summary
- T-17.4: Conditional sections have proper ARIA attributes
- T-17.5: All inputs, radios, checkboxes are keyboard accessible

**Test IDs:** T-17.1 to T-17.5 (5 tests)

---

## Additional Behaviours (Cross-Cutting)

### Currency Validation (Detailed)
- T-CURR-1: Accept valid minimum amount (£0.01)
- T-CURR-2: Accept valid maximum amount (£1,000,000)
- T-CURR-3: Accept amount with 2 decimal places (£123.45)
- T-CURR-4: Accept amount with 1 decimal place (£50.5)
- T-CURR-5: Accept whole number amount (£100)
- T-CURR-6: Reject 3 decimal places (£1.234)
- T-CURR-7: Reject negative amount (-£50)
- T-CURR-8: Reject zero amount (£0)
- T-CURR-9: Reject non-numeric text

**Test IDs:** T-CURR-1 to T-CURR-9 (9 tests)

### Pre-Population on Revisit
- T-PRE-1: Total arrears pre-populated from session
- T-PRE-2: Third-party radio pre-selected from session
- T-PRE-3: Payment sources checkboxes pre-checked from session
- T-PRE-4: Other details text pre-filled from session
- T-PRE-5: Pre-population works after validation error

**Test IDs:** T-PRE-1 to T-PRE-5 (5 tests)

### Payment Sources Combinations
- T-PS-1: Select single payment source (Universal Credit only)
- T-PS-2: Select multiple payment sources (2 or more)
- T-PS-3: Select all 5 payment sources
- T-PS-4: Deselect previously selected payment source
- T-PS-5: Change from one payment source to another on revisit

**Test IDs:** T-PS-1 to T-PS-5 (5 tests)

### Conditional Reveal Behavior
- T-CR-1: No reveals payment sources hidden
- T-CR-2: Yes reveals payment sources visible
- T-CR-3: Other not selected keeps details hidden
- T-CR-4: Other selected reveals details visible
- T-CR-5: Changing from Yes to No preserves but doesn't validate payment sources

**Test IDs:** T-CR-1 to T-CR-5 (5 tests)

### Multiple Validation Errors
- T-MULTI-1: Missing total arrears + missing third-party selection (2 errors)
- T-MULTI-2: Invalid total arrears + missing payment sources (2 errors)
- T-MULTI-3: All possible errors simultaneously (4 errors)

**Test IDs:** T-MULTI-1 to T-MULTI-3 (3 tests)

---

## Open Questions

**None** - All ambiguities resolved via Q1-Q6 clarification with Steve.

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Guidance Display | 3 | AC-1 |
| Upload UI | 3 | AC-2, AC-3 (metadata only) |
| Total Arrears Display | 3 | AC-5 |
| Total Arrears Validation | 9 | AC-6 |
| Third-Party Display | 3 | AC-7 |
| Third-Party Validation | 4 | AC-8 |
| Payment Sources Display | 7 | AC-9 |
| Payment Sources Validation | 4 | AC-10 |
| Other Reveal | 3 | AC-11 |
| Other Validation | 4 | AC-12 |
| Persistence | 11 | AC-13 |
| Navigation (Prev) | 2 | AC-14 |
| Navigation (Cont) | 2 | AC-15 |
| Cancel | 2 | AC-16 |
| Accessibility | 5 | AC-17 |
| Currency Details | 9 | Cross-cutting |
| Pre-Population | 5 | Cross-cutting |
| Payment Combos | 5 | Cross-cutting |
| Conditional Reveals | 5 | Cross-cutting |
| Multi-Validation | 3 | Cross-cutting |
| **Total** | **92** | **Estimated test count** |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-27.*
