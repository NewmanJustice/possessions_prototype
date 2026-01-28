# Test Behaviour Matrix — Screen 26c: Housing Act (Demotion of tenancy)

## Acceptance Criteria → Test Behaviours

### AC-1: Display page heading and guidance

**Behaviour:**
- T-1.1: Page displays heading "Housing Act"
- T-1.2: Guidance text explains selecting relevant Housing Act for demotion order
- T-1.3: Page is accessible at `/claims/select-housing-act-demotion`

**Test IDs:** T-1.1, T-1.2, T-1.3

---

### AC-2: Display Housing Act selection

**Behaviour:**
- T-2.1: Question "Which Housing Act does the demotion order relate to?" displayed
- T-2.2: Radio option "Housing Act 1985 (section 82A)" displayed
- T-2.3: Radio option "Housing Act 1996 (section 143A)" displayed
- T-2.4: Radio options use correct name attribute (`demotionHousingAct`)
- T-2.5: Only two options available (no "Other" option)

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

### AC-4: Persist Housing Act selection

**Behaviour:**
- T-4.1: 1985 selection stores `housingAct: 'housing-act-1985-section-82a'`
- T-4.2: 1996 selection stores `housingAct: 'housing-act-1996-section-143a'`
- T-4.3: Value stored in `session.claim.demotionOrder` object
- T-4.4: Changing selection updates stored value

**Test IDs:** T-4.1, T-4.2, T-4.3, T-4.4

---

### AC-5: Preserve selection on revisit

**Behaviour:**
- T-5.1: 1985 pre-selected when `housingAct === 'housing-act-1985-section-82a'`
- T-5.2: 1996 pre-selected when `housingAct === 'housing-act-1996-section-143a'`
- T-5.3: First visit has no pre-selection
- T-5.4: Pre-selection survives navigation back and forth

**Test IDs:** T-5.1, T-5.2, T-5.3, T-5.4

---

### AC-6: Previous navigation

**Behaviour:**
- T-6.1: Clicking Previous redirects to `/claims/alternative-to-possession`
- T-6.2: Previously entered data preserved in session
- T-6.3: No validation on Previous click

**Test IDs:** T-6.1, T-6.2, T-6.3

---

### AC-7: Continue navigation

**Behaviour:**
- T-7.1: Continue with 1985 redirects to `/claims/statement-of-express-terms`
- T-7.2: Continue with 1996 redirects to `/claims/statement-of-express-terms`
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
- T-9.2: Error link targets radio group (`#demotionHousingAct`)
- T-9.3: Focus moves to error summary (tabindex="-1")
- T-9.4: Radio inputs have proper labels
- T-9.5: Radios are keyboard accessible
- T-9.6: Page uses semantic HTML and ARIA attributes

**Test IDs:** T-9.1, T-9.2, T-9.3, T-9.4, T-9.5, T-9.6

---

## Additional Behaviours (Cross-Cutting)

### Selection Change Behavior
- T-CHG-1: Change from 1985 to 1996 updates session
- T-CHG-2: Change from 1996 to 1985 updates session
- T-CHG-3: Multiple changes preserve last state correctly

**Test IDs:** T-CHG-1, T-CHG-2, T-CHG-3

### Value Mapping
- T-MAP-1: Form value `housing-act-1985-section-82a` maps correctly to session
- T-MAP-2: Form value `housing-act-1996-section-143a` maps correctly to session
- T-MAP-3: Session value correctly pre-selects 1985 radio
- T-MAP-4: Session value correctly pre-selects 1996 radio

**Test IDs:** T-MAP-1, T-MAP-2, T-MAP-3, T-MAP-4

### Entry Condition
- T-ENTRY-1: Page accessible when demotion path selected on Screen 26

**Test IDs:** T-ENTRY-1

---

## Open Questions

**Q1 - Form field name:** Awaiting confirmation on `demotionHousingAct`
**Q2 - Guidance text:** Exact wording for guidance paragraph
**Q3 - Previous data preservation:** Confirm partial data saved on Previous
**Q4 - Screen 26d placeholder:** Confirm if placeholder needed
**Q5 - Design file:** Confirm if design exists or use AC text

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Page Display | 3 | AC-1 |
| Radio Options | 5 | AC-2 |
| Validation | 5 | AC-3 |
| Persistence | 4 | AC-4 |
| Pre-Population | 4 | AC-5 |
| Navigation (Prev) | 3 | AC-6 |
| Navigation (Cont) | 3 | AC-7 |
| Cancel | 2 | AC-8 |
| Accessibility | 6 | AC-9 |
| Selection Change | 3 | Cross-cutting |
| Value Mapping | 4 | Cross-cutting |
| Entry Condition | 1 | Cross-cutting |
| **Total** | **43** | **Estimated test count** |

---

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2, T-1.3 | Page heading and guidance |
| AC-2 | T-2.1, T-2.2, T-2.3, T-2.4, T-2.5 | Radio options display |
| AC-3 | T-3.1, T-3.2, T-3.3, T-3.4, T-3.5 | Validation |
| AC-4 | T-4.1, T-4.2, T-4.3, T-4.4 | Session persistence |
| AC-5 | T-5.1, T-5.2, T-5.3, T-5.4 | Pre-population |
| AC-6 | T-6.1, T-6.2, T-6.3 | Previous navigation |
| AC-7 | T-7.1, T-7.2, T-7.3 | Continue navigation |
| AC-8 | T-8.1, T-8.2 | Cancel behaviour |
| AC-9 | T-9.1, T-9.2, T-9.3, T-9.4, T-9.5, T-9.6 | Accessibility |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-28.*
