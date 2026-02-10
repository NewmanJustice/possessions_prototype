# Test Behaviour Matrix — Screen 26a: Housing Act (Suspension of right to buy)

## Acceptance Criteria to Test Behaviours

### AC-1: Display page heading and guidance

**Behaviour:**
- T-1.1: Page displays heading "Housing Act"
- T-1.2: Guidance text explains selecting relevant Housing Act and providing section reference
- T-1.3: Page is accessible at `/claims/select-housing-act-suspension`

**Test IDs:** T-1.1, T-1.2, T-1.3

---

### AC-2: Display Housing Act selection

**Behaviour:**
- T-2.1: Question "Which Housing Act does the suspension order relate to?" displayed
- T-2.2: Radio option "Housing Act 1985" displayed
- T-2.3: Radio option "Housing Act 1996" displayed
- T-2.4: Radio option "Other" displayed
- T-2.5: Radio options use correct name attribute (`suspensionHousingAct`)

**Test IDs:** T-2.1, T-2.2, T-2.3, T-2.4, T-2.5

---

### AC-3: Housing Act selection is required

**Behaviour:**
- T-3.1: Submitting without selection shows error
- T-3.2: Error message: "Select the Housing Act"
- T-3.3: GOV.UK error summary displayed
- T-3.4: Inline error message displayed
- T-3.5: Focus moves to error summary

**Test IDs:** T-3.1, T-3.2, T-3.3, T-3.4, T-3.5

---

### AC-4: "Other" reveals Act name field

**Behaviour:**
- T-4.1: Selecting "Other" reveals text input labelled "Name of Housing Act"
- T-4.2: Text input is hidden when 1985 selected
- T-4.3: Text input is hidden when 1996 selected
- T-4.4: Conditional reveal uses GOV.UK pattern (data-aria-controls)
- T-4.5: Field name is `housingActOtherName`

**Test IDs:** T-4.1, T-4.2, T-4.3, T-4.4, T-4.5

---

### AC-5: "Other" Act name is required

**Behaviour:**
- T-5.1: Submitting with Other selected and empty name shows error
- T-5.2: Error message: "Enter the name of the Housing Act"
- T-5.3: Error not shown when 1985 or 1996 selected with empty other name
- T-5.4: Error summary includes other name error
- T-5.5: Error link targets other name field

**Test IDs:** T-5.1, T-5.2, T-5.3, T-5.4, T-5.5

---

### AC-6: Display Housing Act section input

**Behaviour:**
- T-6.1: Text input labelled "Section" displayed
- T-6.2: Hint text "For example, section 121A" displayed
- T-6.3: Field name is `section`
- T-6.4: Section field is always visible (not conditional)

**Test IDs:** T-6.1, T-6.2, T-6.3, T-6.4

---

### AC-7: Section is required

**Behaviour:**
- T-7.1: Submitting with empty section shows error
- T-7.2: Error message: "Enter the Housing Act section"
- T-7.3: Error summary includes section error
- T-7.4: Error link targets section field

**Test IDs:** T-7.1, T-7.2, T-7.3, T-7.4

---

### AC-8: Section format validation (max length)

**Behaviour:**
- T-8.1: Submitting with section > 50 chars shows error
- T-8.2: Error message: "Enter 50 characters or fewer"
- T-8.3: Section at exactly 50 chars accepted
- T-8.4: Section at 51 chars rejected
- T-8.5: Error summary includes length error
- T-8.6: Error link targets section field

**Test IDs:** T-8.1, T-8.2, T-8.3, T-8.4, T-8.5, T-8.6

---

### AC-9: Persist Housing Act and section

**Behaviour:**
- T-9.1: 1985 selection stores `housingAct: 'housing-act-1985'`
- T-9.2: 1996 selection stores `housingAct: 'housing-act-1996'`
- T-9.3: Other selection stores `housingAct: 'other'` and `housingActOtherName: <value>`
- T-9.4: Section stored in `section` field
- T-9.5: Value stored in `session.claim.suspensionOrder` object
- T-9.6: `housingActOtherName` is null when 1985 or 1996 selected
- T-9.7: Changing selection updates stored value

**Test IDs:** T-9.1, T-9.2, T-9.3, T-9.4, T-9.5, T-9.6, T-9.7

---

### AC-10: Previous navigation

**Behaviour:**
- T-10.1: Clicking Previous redirects to `/claims/alternative-to-possession`
- T-10.2: Previously entered data preserved in session
- T-10.3: No validation on Previous click

**Test IDs:** T-10.1, T-10.2, T-10.3

---

### AC-11: Continue navigation

**Behaviour:**
- T-11.1: Continue with 1985 + section redirects to `/claims/reasons-for-suspension`
- T-11.2: Continue with 1996 + section redirects to `/claims/reasons-for-suspension`
- T-11.3: Continue with Other + other name + section redirects to `/claims/reasons-for-suspension`
- T-11.4: Selection persisted before navigation

**Test IDs:** T-11.1, T-11.2, T-11.3, T-11.4

---

### AC-12: Cancel behaviour

**Behaviour:**
- T-12.1: Clicking Cancel redirects to `/case-list`
- T-12.2: Draft claim remains in session after Cancel

**Test IDs:** T-12.1, T-12.2

---

### AC-13: Accessibility compliance

**Behaviour:**
- T-13.1: GOV.UK error summary displayed on validation failure
- T-13.2: Error links target relevant radio group or input field
- T-13.3: Focus moves to error summary (tabindex="-1")
- T-13.4: Radio inputs have proper labels
- T-13.5: Text inputs have proper labels
- T-13.6: Radios and inputs are keyboard accessible
- T-13.7: Conditional reveal is accessible

**Test IDs:** T-13.1, T-13.2, T-13.3, T-13.4, T-13.5, T-13.6, T-13.7

---

## Additional Behaviours (Cross-Cutting)

### Pre-population Behaviour
- T-PRE-1: First visit has no pre-selection
- T-PRE-2: 1985 pre-selected when `housingAct === 'housing-act-1985'`
- T-PRE-3: 1996 pre-selected when `housingAct === 'housing-act-1996'`
- T-PRE-4: Other pre-selected when `housingAct === 'other'`
- T-PRE-5: Other name field pre-populated when Other selected
- T-PRE-6: Section field pre-populated from session
- T-PRE-7: Pre-selection survives navigation back and forth

**Test IDs:** T-PRE-1, T-PRE-2, T-PRE-3, T-PRE-4, T-PRE-5, T-PRE-6, T-PRE-7

### Selection Change Behaviour
- T-CHG-1: Change from 1985 to 1996 updates session
- T-CHG-2: Change from 1985 to Other updates session and requires other name
- T-CHG-3: Change from Other to 1985 clears `housingActOtherName`
- T-CHG-4: Multiple changes preserve last state correctly

**Test IDs:** T-CHG-1, T-CHG-2, T-CHG-3, T-CHG-4

### Multiple Error Handling
- T-ERR-1: Multiple errors displayed in error summary
- T-ERR-2: All relevant inline errors displayed
- T-ERR-3: Error for missing radio + missing section displayed together
- T-ERR-4: Error for Other selected + missing other name + missing section displayed together

**Test IDs:** T-ERR-1, T-ERR-2, T-ERR-3, T-ERR-4

### Value Mapping
- T-MAP-1: Form value `housing-act-1985` maps correctly to session
- T-MAP-2: Form value `housing-act-1996` maps correctly to session
- T-MAP-3: Form value `other` maps correctly to session
- T-MAP-4: Session value correctly pre-selects 1985 radio
- T-MAP-5: Session value correctly pre-selects 1996 radio
- T-MAP-6: Session value correctly pre-selects Other radio

**Test IDs:** T-MAP-1, T-MAP-2, T-MAP-3, T-MAP-4, T-MAP-5, T-MAP-6

---

## Open Questions

**Q1 - Form field names:** Awaiting confirmation on `suspensionHousingAct`, `housingActOtherName`, `section`
**Q2 - Other name max length:** No limit specified - assume no validation
**Q3 - Previous data preservation:** Confirm partial data saved on Previous
**Q4 - Screen 26b placeholder:** Confirm if placeholder needed
**Q5 - Clear other name:** Confirm other name should be cleared when switching from Other

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Page Display | 3 | AC-1 |
| Radio Options | 5 | AC-2 |
| Radio Validation | 5 | AC-3 |
| Conditional Reveal | 5 | AC-4 |
| Other Name Validation | 5 | AC-5 |
| Section Display | 4 | AC-6 |
| Section Required | 4 | AC-7 |
| Section Length | 6 | AC-8 |
| Persistence | 7 | AC-9 |
| Navigation (Prev) | 3 | AC-10 |
| Navigation (Cont) | 4 | AC-11 |
| Cancel | 2 | AC-12 |
| Accessibility | 7 | AC-13 |
| Pre-population | 7 | Cross-cutting |
| Selection Change | 4 | Cross-cutting |
| Multiple Errors | 4 | Cross-cutting |
| Value Mapping | 6 | Cross-cutting |
| **Total** | **81** | **Estimated test count** |

**Note:** Some tests will be combined for efficiency in the executable test file, resulting in approximately 50-60 actual test cases.

---

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2, T-1.3 | Page heading and guidance |
| AC-2 | T-2.1, T-2.2, T-2.3, T-2.4, T-2.5 | Radio options display |
| AC-3 | T-3.1, T-3.2, T-3.3, T-3.4, T-3.5 | Radio validation |
| AC-4 | T-4.1, T-4.2, T-4.3, T-4.4, T-4.5 | Conditional reveal |
| AC-5 | T-5.1, T-5.2, T-5.3, T-5.4, T-5.5 | Other name validation |
| AC-6 | T-6.1, T-6.2, T-6.3, T-6.4 | Section display |
| AC-7 | T-7.1, T-7.2, T-7.3, T-7.4 | Section required |
| AC-8 | T-8.1, T-8.2, T-8.3, T-8.4, T-8.5, T-8.6 | Section length |
| AC-9 | T-9.1, T-9.2, T-9.3, T-9.4, T-9.5, T-9.6, T-9.7 | Session persistence |
| AC-10 | T-10.1, T-10.2, T-10.3 | Previous navigation |
| AC-11 | T-11.1, T-11.2, T-11.3, T-11.4 | Continue navigation |
| AC-12 | T-12.1, T-12.2 | Cancel behaviour |
| AC-13 | T-13.1, T-13.2, T-13.3, T-13.4, T-13.5, T-13.6, T-13.7 | Accessibility |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-28.*
