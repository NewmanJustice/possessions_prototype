# Test Behaviour Matrix — Screen 24: Claimant's Circumstances

## Acceptance Criteria → Test Behaviours

### AC-1: Display claimant circumstances question

**Behaviour:**
- T-1.1: Page displays question with dynamic claimant name
- T-1.2: Yes radio option displayed
- T-1.3: No radio option displayed
- T-1.4: Radio options use correct name attribute (`provideCircumstances`)
- T-1.5: Guidance about financial/general information displayed

**Test IDs:** T-1.1, T-1.2, T-1.3, T-1.4, T-1.5

---

### AC-2: Selection is required

**Behaviour:**
- T-2.1: Submitting without selection shows error
- T-2.2: Error message: "Select whether you want to provide information about the claimant's circumstances"
- T-2.3: GOV.UK error summary displayed
- T-2.4: Inline error message displayed
- T-2.5: Focus moves to error summary

**Test IDs:** T-2.1, T-2.2, T-2.3, T-2.4, T-2.5

---

### AC-3: Reveal details field when Yes selected

**Behaviour:**
- T-3.1: Textarea included in page (conditional reveal markup)
- T-3.2: Textarea uses correct name attribute (`circumstancesDetails`)
- T-3.3: Character limit guidance displayed ("You can enter up to 950 characters")

**Test IDs:** T-3.1, T-3.2, T-3.3

---

### AC-4: Details are optional when revealed

**Behaviour:**
- T-4.1: Yes with empty details accepted
- T-4.2: Yes with whitespace-only details accepted
- T-4.3: Submission redirects to next screen with empty details

**Test IDs:** T-4.1, T-4.2, T-4.3

---

### AC-5: Character limit enforced

**Behaviour:**
- T-5.1: 951 characters shows validation error
- T-5.2: Error message: "Enter 950 characters or fewer"
- T-5.3: 950 characters exactly accepted
- T-5.4: Error summary displayed for character limit violation
- T-5.5: Inline error displayed for textarea

**Test IDs:** T-5.1, T-5.2, T-5.3, T-5.4, T-5.5

---

### AC-6: Persist claimant circumstances

**Behaviour:**
- T-6.1: Yes selection stores `provided: true`
- T-6.2: No selection stores `provided: false`
- T-6.3: Details stored when Yes selected with text
- T-6.4: Details set to null when No selected
- T-6.5: Changing from Yes to No clears details

**Test IDs:** T-6.1, T-6.2, T-6.3, T-6.4, T-6.5

---

### AC-7: Preserve input on revisit

**Behaviour:**
- T-7.1: Yes pre-selected when `provided === true`
- T-7.2: No pre-selected when `provided === false`
- T-7.3: Details textarea pre-populated with previous text
- T-7.4: First visit has no pre-selection

**Test IDs:** T-7.1, T-7.2, T-7.3, T-7.4

---

### AC-8: Previous navigation

**Behaviour:**
- T-8.1: Clicking Previous redirects to `/claims/money-judgement`
- T-8.2: Previous inputs preserved in session

**Test IDs:** T-8.1, T-8.2

---

### AC-9: Continue navigation

**Behaviour:**
- T-9.1: Clicking Continue (valid Yes) redirects to `/claims/defendants-circumstances`
- T-9.2: Clicking Continue (valid No) redirects to `/claims/defendants-circumstances`
- T-9.3: Selection persisted before navigation

**Test IDs:** T-9.1, T-9.2, T-9.3

---

### AC-10: Cancel behaviour

**Behaviour:**
- T-10.1: Clicking Cancel redirects to `/case-list`
- T-10.2: Draft claim remains in session after Cancel

**Test IDs:** T-10.1, T-10.2

---

### AC-11: Accessibility compliance

**Behaviour:**
- T-11.1: GOV.UK error summary displayed on validation failure
- T-11.2: Error link targets radio group (`#provideCircumstances`)
- T-11.3: Error link targets textarea when character limit exceeded
- T-11.4: Focus moves to error summary (tabindex="-1")
- T-11.5: Radio inputs have proper labels
- T-11.6: Textarea has proper label
- T-11.7: Inputs are keyboard accessible

**Test IDs:** T-11.1, T-11.2, T-11.3, T-11.4, T-11.5, T-11.6, T-11.7

---

## Additional Behaviours (Cross-Cutting)

### Dynamic Claimant Name
- T-DYN-1: Claimant name from session displayed in question
- T-DYN-2: Fallback "the claimant" used when name not in session

**Test IDs:** T-DYN-1, T-DYN-2

### Selection Change Behavior
- T-CHG-1: Change from Yes to No clears details
- T-CHG-2: Change from No to Yes allows new details entry
- T-CHG-3: Multiple changes preserve last state correctly

**Test IDs:** T-CHG-1, T-CHG-2, T-CHG-3

### Boolean Mapping
- T-MAP-1: Form value "yes" maps to `provided: true` in session
- T-MAP-2: Form value "no" maps to `provided: false` in session
- T-MAP-3: Session `true` pre-selects "yes" radio
- T-MAP-4: Session `false` pre-selects "no" radio

**Test IDs:** T-MAP-1, T-MAP-2, T-MAP-3, T-MAP-4

---

## Open Questions

**None** - All ambiguities resolved based on user story and existing implementation patterns.

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Question Display | 5 | AC-1 |
| Validation (Selection) | 5 | AC-2 |
| Conditional Reveal | 3 | AC-3 |
| Details Optional | 3 | AC-4 |
| Character Limit | 5 | AC-5 |
| Persistence | 5 | AC-6 |
| Pre-Population | 4 | AC-7 |
| Navigation (Prev) | 2 | AC-8 |
| Navigation (Cont) | 3 | AC-9 |
| Cancel | 2 | AC-10 |
| Accessibility | 7 | AC-11 |
| Dynamic Name | 2 | Cross-cutting |
| Selection Change | 3 | Cross-cutting |
| Boolean Mapping | 4 | Cross-cutting |
| **Total** | **53** | **Estimated test count** |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-28.*
