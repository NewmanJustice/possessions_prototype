# Test Behaviour Matrix — Screen 29: Additional Reasons for Possession

## Acceptance Criteria → Test Behaviours

### AC-1: Display page heading and question

**Behaviour:**
- T-1.1: Page displays heading "Additional reasons for possession"
- T-1.2: Caption displays "Make a claim"
- T-1.3: Question displays "Is there any other information you'd like to provide about your reasons for possession?"
- T-1.4: Page is accessible at `/claims/additional-reasons-for-possession`
- T-1.5: Two radio options displayed: Yes and No

**Test IDs:** T-1.1, T-1.2, T-1.3, T-1.4, T-1.5

---

### AC-2: Reveal textarea on Yes selection

**Behaviour:**
- T-2.1: Selecting Yes reveals textarea
- T-2.2: Textarea label displays "Additional reasons for possession"
- T-2.3: Hint text displays "You can enter up to 6400 characters"
- T-2.4: Textarea is optional (no asterisk or required indicator)
- T-2.5: Textarea appears below radio options
- T-2.6: Textarea is empty on initial Yes selection

**Test IDs:** T-2.1, T-2.2, T-2.3, T-2.4, T-2.5, T-2.6

---

### AC-3: Hide textarea on No selection

**Behaviour:**
- T-3.1: Selecting No hides textarea
- T-3.2: Textarea is hidden even if text was previously entered
- T-3.3: Text previously entered is retained in session (for revisit)
- T-3.4: No error displayed when switching to No

**Test IDs:** T-3.1, T-3.2, T-3.3, T-3.4

---

### AC-4: Yes/No selection is required

**Behaviour:**
- T-4.1: Submitting without selection shows validation error
- T-4.2: Error message displays: "Select yes if you would like to provide additional reasons for possession"
- T-4.3: GOV.UK error summary displayed at top of page
- T-4.4: Inline error message displayed at radio group
- T-4.5: Focus moves to error summary

**Test IDs:** T-4.1, T-4.2, T-4.3, T-4.4, T-4.5

---

### AC-5: Textarea validation when Yes is selected

**Behaviour:**
- T-5.1: Submitting with Yes selected and empty textarea succeeds
- T-5.2: No validation error for empty textarea
- T-5.3: Form submits successfully to next screen
- T-5.4: Session updated with hasAdditionalReasons: 'yes'

**Test IDs:** T-5.1, T-5.2, T-5.3, T-5.4

---

### AC-6: Character limit enforcement

**Behaviour:**
- T-6.1: Textarea maxlength attribute set to 6400
- T-6.2: Textarea prevents input beyond 6400 characters
- T-6.3: Character counter displayed showing remaining characters
- T-6.4: Entering exactly 6400 characters accepted
- T-6.5: Attempting to enter 6401st character prevented
- T-6.6: Backend validates character limit on submission

**Test IDs:** T-6.1, T-6.2, T-6.3, T-6.4, T-6.5, T-6.6

---

### AC-7: Persist selection and additional reasons

**Behaviour:**
- T-7.1: Yes selection stores `hasAdditionalReasons: 'yes'`
- T-7.2: No selection stores `hasAdditionalReasons: 'no'`
- T-7.3: Text entry stores in `additionalReasonsText`
- T-7.4: Values stored in `session.claim.additionalReasons`
- T-7.5: Empty textarea with Yes stores `additionalReasonsText: null`
- T-7.6: Null state on first visit stored correctly

**Test IDs:** T-7.1, T-7.2, T-7.3, T-7.4, T-7.5, T-7.6

---

### AC-8: Preserve selection and text on revisit

**Behaviour:**
- T-8.1: Yes pre-selected when `hasAdditionalReasons === 'yes'`
- T-8.2: No pre-selected when `hasAdditionalReasons === 'no'`
- T-8.3: Textarea pre-filled with previously entered text
- T-8.4: Textarea visibility matches previous selection
- T-8.5: First visit has no pre-selection
- T-8.6: Pre-selection and text survive navigation back and forth

**Test IDs:** T-8.1, T-8.2, T-8.3, T-8.4, T-8.5, T-8.6

---

### AC-9: Previous navigation

**Behaviour:**
- T-9.1: Clicking Previous redirects to `/claims/claiming-costs` (Screen 28)
- T-9.2: Previously entered data preserved in session
- T-9.3: No validation on Previous click

**Test IDs:** T-9.1, T-9.2, T-9.3

---

### AC-10: Continue navigation

**Behaviour:**
- T-10.1: Continue with Yes selection and empty textarea redirects to next screen (Screen 30 TBD)
- T-10.2: Continue with Yes selection and text redirects to next screen
- T-10.3: Continue with No selection redirects to next screen
- T-10.4: Selection persisted before navigation
- T-10.5: Text persisted before navigation

**Test IDs:** T-10.1, T-10.2, T-10.3, T-10.4, T-10.5

---

### AC-11: Cancel behaviour

**Behaviour:**
- T-11.1: Clicking Cancel redirects to `/case-list`
- T-11.2: Draft claim remains in session after Cancel
- T-11.3: Cancel does not save current screen data

**Test IDs:** T-11.1, T-11.2, T-11.3

---

### AC-12: Accessibility compliance

**Behaviour:**
- T-12.1: GOV.UK error summary displayed on validation failure
- T-12.2: Error link targets radio group
- T-12.3: Focus moves to error summary (tabindex="-1")
- T-12.4: Radio inputs have proper labels
- T-12.5: Radios are keyboard accessible (arrow keys, Tab)
- T-12.6: Textarea is keyboard accessible
- T-12.7: Page uses semantic HTML and ARIA attributes

**Test IDs:** T-12.1, T-12.2, T-12.3, T-12.4, T-12.5, T-12.6, T-12.7

---

## Additional Behaviours (Cross-Cutting)

### Selection Change Behavior
- T-CHG-1: Change from Yes to No hides textarea but retains text in session
- T-CHG-2: Change from No to Yes reveals textarea with retained text
- T-CHG-3: Multiple changes preserve last state and text correctly

**Test IDs:** T-CHG-1, T-CHG-2, T-CHG-3

### Value Mapping
- T-MAP-1: Form value "yes" maps correctly to session
- T-MAP-2: Form value "no" maps correctly to session
- T-MAP-3: Session value 'yes' correctly pre-selects Yes radio
- T-MAP-4: Session value 'no' correctly pre-selects No radio

**Test IDs:** T-MAP-1, T-MAP-2, T-MAP-3, T-MAP-4

### Entry Condition
- T-ENTRY-1: Page accessible when arriving from `/claims/claiming-costs`

**Test IDs:** T-ENTRY-1

### Textarea Content
- T-TEXTAREA-1: Textarea accepts alphanumeric text
- T-TEXTAREA-2: Textarea accepts special characters and punctuation
- T-TEXTAREA-3: Textarea accepts multiline input (newlines)
- T-TEXTAREA-4: Textarea preserves formatting and whitespace

**Test IDs:** T-TEXTAREA-1, T-TEXTAREA-2, T-TEXTAREA-3, T-TEXTAREA-4

---

## Open Questions

**Q1 - Next screen route:** Continue navigation routes to Screen 30 TBD; confirm route before go-live
**Q2 - Character counter display:** Confirm if character counter is required or optional (currently assumed present)
**Q3 - Backend validation:** Confirm character limit validated on backend
**Q4 - Content validation:** Confirm no content relevance validation required

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Page Display | 5 | AC-1 |
| Conditional Reveal (Yes) | 6 | AC-2 |
| Conditional Hide (No) | 4 | AC-3 |
| Validation | 5 | AC-4 |
| Textarea Optional | 4 | AC-5 |
| Character Limit | 6 | AC-6 |
| Persistence | 6 | AC-7 |
| Pre-Population | 6 | AC-8 |
| Navigation (Prev) | 3 | AC-9 |
| Navigation (Cont) | 5 | AC-10 |
| Cancel | 3 | AC-11 |
| Accessibility | 7 | AC-12 |
| Selection Change | 3 | Cross-cutting |
| Value Mapping | 4 | Cross-cutting |
| Entry Condition | 1 | Cross-cutting |
| Textarea Content | 4 | Cross-cutting |
| **Total** | **72** | **Estimated test count** |

---

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2, T-1.3, T-1.4, T-1.5 | Page heading, caption, question, URL, radio options |
| AC-2 | T-2.1, T-2.2, T-2.3, T-2.4, T-2.5, T-2.6 | Textarea reveal on Yes, label, hint, optional status |
| AC-3 | T-3.1, T-3.2, T-3.3, T-3.4 | Textarea hide on No, text retention |
| AC-4 | T-4.1, T-4.2, T-4.3, T-4.4, T-4.5 | Selection required validation |
| AC-5 | T-5.1, T-5.2, T-5.3, T-5.4 | Textarea optional when Yes selected |
| AC-6 | T-6.1, T-6.2, T-6.3, T-6.4, T-6.5, T-6.6 | Character limit enforcement |
| AC-7 | T-7.1, T-7.2, T-7.3, T-7.4, T-7.5, T-7.6 | Session persistence |
| AC-8 | T-8.1, T-8.2, T-8.3, T-8.4, T-8.5, T-8.6 | Pre-population on revisit |
| AC-9 | T-9.1, T-9.2, T-9.3 | Previous navigation |
| AC-10 | T-10.1, T-10.2, T-10.3, T-10.4, T-10.5 | Continue navigation |
| AC-11 | T-11.1, T-11.2, T-11.3 | Cancel behaviour |
| AC-12 | T-12.1, T-12.2, T-12.3, T-12.4, T-12.5, T-12.6, T-12.7 | Accessibility compliance |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-29.*
