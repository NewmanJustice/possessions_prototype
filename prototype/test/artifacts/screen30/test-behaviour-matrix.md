# Test Behaviour Matrix — Screen 30: Underlessee or Mortgagee Entitled to Claim Relief Against Forfeiture

## Acceptance Criteria -> Test Behaviours

### AC-1: Display page heading and explanatory text

**Behaviour:**
- T-1.1: Page displays heading "Underlessee or mortgagee entitled to claim relief against forfeiture"
- T-1.2: Caption displays "Make a claim"
- T-1.3: Current case number displayed above heading
- T-1.4: Explanatory text displays: "You must tell us if there is an underlessee (a subtenant) or a mortgagee (a mortgage lender) who has a legal right to ask the court to let a lease continue, even though the landlord has tried to end it."
- T-1.5: Page is accessible at `/claims/underlessee-or-mortgagee`

**Test IDs:** T-1.1, T-1.2, T-1.3, T-1.4, T-1.5

---

### AC-2: Display question and radio options

**Behaviour:**
- T-2.1: Question "Is there an underlessee or mortgagee entitled to claim relief against forfeiture?" displayed (bold)
- T-2.2: Radio option "Yes" displayed
- T-2.3: Radio option "No" displayed
- T-2.4: Radio options use correct name attribute (`hasUnderlesseeOrMortgagee`)
- T-2.5: Only two options available (no "Other" or "Unsure" option)

**Test IDs:** T-2.1, T-2.2, T-2.3, T-2.4, T-2.5

---

### AC-3: Yes/No selection is required

**Behaviour:**
- T-3.1: Submitting without selection shows error
- T-3.2: Error message: "Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture"
- T-3.3: GOV.UK error summary displayed at top of page
- T-3.4: Inline error message displayed at radio group
- T-3.5: Focus moves to error summary

**Test IDs:** T-3.1, T-3.2, T-3.3, T-3.4, T-3.5

---

### AC-4: Persist selection

**Behaviour:**
- T-4.1: Yes selection stores `hasUnderlesseeOrMortgagee: 'yes'`
- T-4.2: No selection stores `hasUnderlesseeOrMortgagee: 'no'`
- T-4.3: Value stored in `session.claim.underlesseeOrMortgagee`
- T-4.4: Changing selection updates stored value
- T-4.5: Null state preserved when no selection made

**Test IDs:** T-4.1, T-4.2, T-4.3, T-4.4, T-4.5

---

### AC-5: Preserve selection on revisit

**Behaviour:**
- T-5.1: Yes pre-selected when `hasUnderlesseeOrMortgagee === 'yes'`
- T-5.2: No pre-selected when `hasUnderlesseeOrMortgagee === 'no'`
- T-5.3: First visit has no pre-selection
- T-5.4: Pre-selection survives navigation back and forth

**Test IDs:** T-5.1, T-5.2, T-5.3, T-5.4

---

### AC-6: Previous navigation

**Behaviour:**
- T-6.1: Clicking Previous redirects to `/claims/additional-reasons-for-possession` (Screen 29)
- T-6.2: Previously entered data preserved in session
- T-6.3: No validation on Previous click

**Test IDs:** T-6.1, T-6.2, T-6.3

---

### AC-7: Continue navigation

**Behaviour:**
- T-7.1: Continue with Yes selection redirects to next screen (Screen 31 TBD)
- T-7.2: Continue with No selection redirects to next screen (Screen 31 TBD)
- T-7.3: Selection persisted before navigation

**Test IDs:** T-7.1, T-7.2, T-7.3

---

### AC-8: Cancel behaviour

**Behaviour:**
- T-8.1: Clicking Cancel redirects to `/case-list`
- T-8.2: Draft claim remains in session after Cancel

**Test IDs:** T-8.1, T-8.2

---

### AC-9: Accessibility compliance

**Behaviour:**
- T-9.1: GOV.UK error summary displayed on validation failure
- T-9.2: Error link targets radio group (`#hasUnderlesseeOrMortgagee`)
- T-9.3: Focus moves to error summary (tabindex="-1")
- T-9.4: Radio inputs have proper labels
- T-9.5: Radios are keyboard accessible (arrow keys, Tab)
- T-9.6: Page uses semantic HTML and ARIA attributes

**Test IDs:** T-9.1, T-9.2, T-9.3, T-9.4, T-9.5, T-9.6

---

## Additional Behaviours (Cross-Cutting)

### Selection Change Behavior
- T-CHG-1: Change from Yes to No updates session
- T-CHG-2: Change from No to Yes updates session
- T-CHG-3: Multiple changes preserve last state correctly

**Test IDs:** T-CHG-1, T-CHG-2, T-CHG-3

### Value Mapping
- T-MAP-1: Form value "yes" maps correctly to session
- T-MAP-2: Form value "no" maps correctly to session
- T-MAP-3: Session value 'yes' correctly pre-selects Yes radio
- T-MAP-4: Session value 'no' correctly pre-selects No radio

**Test IDs:** T-MAP-1, T-MAP-2, T-MAP-3, T-MAP-4

### Entry Condition
- T-ENTRY-1: Page accessible when arriving from `/claims/additional-reasons-for-possession`

**Test IDs:** T-ENTRY-1

---

## Open Questions

**Q1 - Next screen route:** Continue navigation currently routes to Screen 31 TBD; confirm route before go-live
**Q2 - Form field name:** Confirm field name is `hasUnderlesseeOrMortgagee`
**Q3 - Value format:** Confirm lowercase 'yes' and 'no' string values
**Q4 - Session structure:** Confirm nested object structure under `session.claim.underlesseeOrMortgagee`

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Page Display | 5 | AC-1 |
| Radio Options | 5 | AC-2 |
| Validation | 5 | AC-3 |
| Persistence | 5 | AC-4 |
| Pre-Population | 4 | AC-5 |
| Navigation (Prev) | 3 | AC-6 |
| Navigation (Cont) | 3 | AC-7 |
| Cancel | 2 | AC-8 |
| Accessibility | 6 | AC-9 |
| Selection Change | 3 | Cross-cutting |
| Value Mapping | 4 | Cross-cutting |
| Entry Condition | 1 | Cross-cutting |
| **Total** | **46** | **Estimated test count** |

---

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2, T-1.3, T-1.4, T-1.5 | Page heading, caption, case number, explanatory text, URL |
| AC-2 | T-2.1, T-2.2, T-2.3, T-2.4, T-2.5 | Question, radio options |
| AC-3 | T-3.1, T-3.2, T-3.3, T-3.4, T-3.5 | Validation and error handling |
| AC-4 | T-4.1, T-4.2, T-4.3, T-4.4, T-4.5 | Session persistence |
| AC-5 | T-5.1, T-5.2, T-5.3, T-5.4 | Pre-population on revisit |
| AC-6 | T-6.1, T-6.2, T-6.3 | Previous navigation |
| AC-7 | T-7.1, T-7.2, T-7.3 | Continue navigation |
| AC-8 | T-8.1, T-8.2 | Cancel behaviour |
| AC-9 | T-9.1, T-9.2, T-9.3, T-9.4, T-9.5, T-9.6 | Accessibility compliance |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-30.*
