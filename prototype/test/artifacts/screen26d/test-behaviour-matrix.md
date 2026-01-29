# Test Behaviour Matrix — Screen 26d: Statement of express terms

## Acceptance Criteria → Test Behaviours

### AC-1: Display page heading and question

**Behaviour:**
- T-1.1: Page displays heading "Statement of express terms"
- T-1.2: Question displayed: "Have you served the defendants with a statement of the express terms which will apply to the demoted tenancy?"
- T-1.3: Page is accessible at `/claims/statement-of-express-terms`

**Test IDs:** T-1.1, T-1.2, T-1.3

---

### AC-2: Display radio options

**Behaviour:**
- T-2.1: Two radio button options displayed
- T-2.2: Radio option "Yes" available
- T-2.3: Radio option "No" available
- T-2.4: Radio options use correct name attribute (`expressTermsServed`)
- T-2.5: Only two options available (no "Other" option)

**Test IDs:** T-2.1, T-2.2, T-2.3, T-2.4, T-2.5

---

### AC-3: Reveal details field on Yes selection

**Behaviour:**
- T-3.1: Details text area not visible on page load
- T-3.2: Selecting Yes reveals text area below options
- T-3.3: Text area label reads "Provide details of how you served the statement" (or similar)
- T-3.4: Text area is multi-line input (textarea, not single-line)
- T-3.5: Text area has no required indicator (optional field)

**Test IDs:** T-3.1, T-3.2, T-3.3, T-3.4, T-3.5

---

### AC-4: Hide details field on No selection

**Behaviour:**
- T-4.1: Selecting No hides the text area
- T-4.2: Any previously entered details text retained in session
- T-4.3: Selecting Yes again shows text area with retained text
- T-4.4: Text area hidden when No selected, shown when Yes selected

**Test IDs:** T-4.1, T-4.2, T-4.3, T-4.4

---

### AC-5: Yes/No selection is required

**Behaviour:**
- T-5.1: Submitting without selecting Yes or No shows error
- T-5.2: Error message: "Select yes if you have served the statement of express terms"
- T-5.3: GOV.UK error summary displayed at top of page
- T-5.4: Inline error message displayed on radio group
- T-5.5: Focus moves to error summary

**Test IDs:** T-5.1, T-5.2, T-5.3, T-5.4, T-5.5

---

### AC-6: Details field validation when Yes is selected

**Behaviour:**
- T-6.1: Selecting Yes and clicking Continue without entering details submits successfully
- T-6.2: Details text area does not block form submission when empty
- T-6.3: No error message appears when details are empty
- T-6.4: Form validates Yes/No selection but not details content

**Test IDs:** T-6.1, T-6.2, T-6.3, T-6.4

---

### AC-7: Persist service confirmation and details

**Behaviour:**
- T-7.1: Yes selection stores `statementOfExpressTerms: 'yes'` in session
- T-7.2: No selection stores `statementOfExpressTerms: 'no'` in session
- T-7.3: Details text stored in `statementOfExpressTermsDetails` when entered
- T-7.4: Both values stored in `session.claim.demotionOrder` object
- T-7.5: Null stored for `statementOfExpressTermsDetails` when no details entered

**Test IDs:** T-7.1, T-7.2, T-7.3, T-7.4, T-7.5

---

### AC-8: Preserve selection and details on revisit

**Behaviour:**
- T-8.1: Yes selection pre-selected when `statementOfExpressTerms === 'yes'`
- T-8.2: No selection pre-selected when `statementOfExpressTerms === 'no'`
- T-8.3: Details text area visible when Yes was previously selected
- T-8.4: Details text area hidden when No was previously selected
- T-8.5: Previously entered details text is pre-filled in text area
- T-8.6: Pre-selection survives navigation back and forth

**Test IDs:** T-8.1, T-8.2, T-8.3, T-8.4, T-8.5, T-8.6

---

### AC-9: Previous navigation

**Behaviour:**
- T-9.1: Clicking Previous redirects to `/claims/select-housing-act-demotion`
- T-9.2: Previously entered selection and details preserved in session
- T-9.3: No validation triggered on Previous click

**Test IDs:** T-9.1, T-9.2, T-9.3

---

### AC-10: Continue navigation

**Behaviour:**
- T-10.1: Clicking Continue with Yes selected redirects to `/claims/claiming-costs`
- T-10.2: Clicking Continue with No selected redirects to `/claims/claiming-costs`
- T-10.3: Clicking Continue with Yes and optional details redirects to `/claims/claiming-costs`
- T-10.4: Selection and details persisted before navigation

**Test IDs:** T-10.1, T-10.2, T-10.3, T-10.4

---

### AC-11: Cancel behaviour

**Behaviour:**
- T-11.1: Clicking Cancel redirects to `/case-list`
- T-11.2: Draft claim remains stored in session after Cancel
- T-11.3: No validation triggered on Cancel click

**Test IDs:** T-11.1, T-11.2, T-11.3

---

### AC-12: Accessibility compliance

**Behaviour:**
- T-12.1: GOV.UK error summary displayed on validation failure
- T-12.2: Error link targets radio group (`#expressTermsServed`)
- T-12.3: Focus moves to error summary (tabindex="-1")
- T-12.4: Radio inputs have proper labels
- T-12.5: Radios are keyboard accessible (Tab, Arrow keys)
- T-12.6: Text area is keyboard accessible
- T-12.7: Page uses semantic HTML and ARIA attributes

**Test IDs:** T-12.1, T-12.2, T-12.3, T-12.4, T-12.5, T-12.6, T-12.7

---

## Additional Behaviours (Cross-Cutting)

### Selection Toggle Behavior
- T-CHG-1: Change from Yes to No hides text area and preserves details
- T-CHG-2: Change from No to Yes shows text area with retained details
- T-CHG-3: Multiple toggles preserve last state and entered text correctly

**Test IDs:** T-CHG-1, T-CHG-2, T-CHG-3

### Value Mapping
- T-MAP-1: Form value 'yes' maps correctly to session `statementOfExpressTerms`
- T-MAP-2: Form value 'no' maps correctly to session `statementOfExpressTerms`
- T-MAP-3: Session value correctly pre-selects Yes radio
- T-MAP-4: Session value correctly pre-selects No radio
- T-MAP-5: Textarea content maps to `statementOfExpressTermsDetails` in session

**Test IDs:** T-MAP-1, T-MAP-2, T-MAP-3, T-MAP-4, T-MAP-5

### Entry Condition
- T-ENTRY-1: Page accessible when demotion path with Housing Act selected on Screen 26c

**Test IDs:** T-ENTRY-1

### Details Field Limits
- T-LIMITS-1: Details field accepts reasonable text entry (up to 2000 chars)
- T-LIMITS-2: No character limit validation error on form submission

**Test IDs:** T-LIMITS-1, T-LIMITS-2

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Page Display | 3 | AC-1 |
| Radio Options | 5 | AC-2 |
| Yes Reveal | 5 | AC-3 |
| No Hide | 4 | AC-4 |
| Selection Required | 5 | AC-5 |
| Details Validation | 4 | AC-6 |
| Session Persistence | 5 | AC-7 |
| Pre-Population | 6 | AC-8 |
| Navigation (Prev) | 3 | AC-9 |
| Navigation (Cont) | 4 | AC-10 |
| Cancel | 3 | AC-11 |
| Accessibility | 7 | AC-12 |
| Selection Toggle | 3 | Cross-cutting |
| Value Mapping | 5 | Cross-cutting |
| Entry Condition | 1 | Cross-cutting |
| Details Field Limits | 2 | Cross-cutting |
| **Total** | **65** | **Estimated test count** |

---

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2, T-1.3 | Page heading and question display |
| AC-2 | T-2.1, T-2.2, T-2.3, T-2.4, T-2.5 | Radio options display |
| AC-3 | T-3.1, T-3.2, T-3.3, T-3.4, T-3.5 | Yes reveal text area |
| AC-4 | T-4.1, T-4.2, T-4.3, T-4.4 | No hide text area |
| AC-5 | T-5.1, T-5.2, T-5.3, T-5.4, T-5.5 | Selection validation |
| AC-6 | T-6.1, T-6.2, T-6.3, T-6.4 | Details optional validation |
| AC-7 | T-7.1, T-7.2, T-7.3, T-7.4, T-7.5 | Session persistence |
| AC-8 | T-8.1, T-8.2, T-8.3, T-8.4, T-8.5, T-8.6 | Pre-population |
| AC-9 | T-9.1, T-9.2, T-9.3 | Previous navigation |
| AC-10 | T-10.1, T-10.2, T-10.3, T-10.4 | Continue navigation |
| AC-11 | T-11.1, T-11.2, T-11.3 | Cancel behaviour |
| AC-12 | T-12.1, T-12.2, T-12.3, T-12.4, T-12.5, T-12.6, T-12.7 | Accessibility |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-29.*
