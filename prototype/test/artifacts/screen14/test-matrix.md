# Test Behaviour Matrix — Screen 14: Grounds for Possession

## Acceptance Criteria → Test Behaviours

### AC-1: Title is "Additional grounds for possession" when entered from assured path

**Behaviour:**
- T-1.1: Page displays "Additional grounds for possession" title when `titleMode === 'additional'`
- T-1.2: Page title/h1 match the titleMode value

**Test IDs:** T-1.1, T-1.2

---

### AC-2: Display grounds list as checkboxes

**Behaviour:**
- T-2.1: Page displays 6 mandatory ground checkboxes (1, 3, 4, 5, 7, 8)
- T-2.2: Page displays 8 discretionary ground checkboxes (9, 10, 11, 12, 13, 14, 15, 16)
- T-2.3: All 14 checkboxes rendered with correct labels from design
- T-2.4: Checkboxes grouped by "Mandatory grounds" and "Discretionary grounds"

**Test IDs:** T-2.1, T-2.2, T-2.3, T-2.4

---

### AC-3: Multiple selection allowed

**Behaviour:**
- T-3.1: User can select zero checkboxes (triggers validation error)
- T-3.2: User can select one checkbox
- T-3.3: User can select multiple checkboxes (e.g., 3 grounds)
- T-3.4: User can select all 14 checkboxes

**Test IDs:** T-3.1, T-3.2, T-3.3, T-3.4

---

### AC-4: At least one ground must be selected

**Behaviour:**
- T-4.1: Submitting with zero grounds shows error: "Select at least one ground for possession"
- T-4.2: GOV.UK error summary displayed at top of page
- T-4.3: Inline error message displayed near checkboxes
- T-4.4: Error summary link targets the checkbox group
- T-4.5: Focus moves to error summary on validation failure

**Test IDs:** T-4.1, T-4.2, T-4.3, T-4.4, T-4.5

---

### AC-5: Preserve selections on validation failure

**Behaviour:**
- T-5.1: Selected ground remains checked after validation error (zero grounds submitted)
- T-5.2: Multiple selected grounds remain checked after validation error

**Note:** This tests the re-render scenario when validation fails, ensuring checkboxes stay checked.

**Test IDs:** T-5.1, T-5.2

---

### AC-6: Persist selected additional grounds

**Behaviour:**
- T-6.1: Selecting mandatory Ground 1 stores `mandatoryGround1: true` in session
- T-6.2: Selecting discretionary Ground 9 stores `discretionaryGround9: true` in session
- T-6.3: Selecting multiple grounds stores all as `true` with correct prefixed keys
- T-6.4: All 14 grounds use correct prefixed keys (mandatory/discretionaryGround{N})
- T-6.5: Unselected grounds stored as `false` in session
- T-6.6: Session data persisted in `session.claim.grounds.additional`

**Test IDs:** T-6.1, T-6.2, T-6.3, T-6.4, T-6.5, T-6.6

---

### AC-7: Preserve selections on revisit

**Behaviour:**
- T-7.1: Previously selected single ground is pre-checked when revisiting
- T-7.2: Previously selected multiple grounds are all pre-checked when revisiting
- T-7.3: User can change selections on revisit (add more grounds)
- T-7.4: User can change selections on revisit (deselect grounds)
- T-7.5: Deselecting a ground sets its value to `false` in session (not undefined)

**Test IDs:** T-7.1, T-7.2, T-7.3, T-7.4, T-7.5

---

### AC-8: Previous uses dynamic navigation contract

**Behaviour:**
- T-8.1: Clicking Previous redirects to `session.claim.navigation.screen14.previous` route
- T-8.2: For assured path, Previous goes to `/claims/grounds-for-possession-assured-selection`
- T-8.3: Selections are preserved in session when clicking Previous

**Test IDs:** T-8.1, T-8.2, T-8.3

---

### AC-9: Continue uses dynamic navigation contract

**Behaviour:**
- T-9.1: Clicking Continue (after valid selection) redirects to `session.claim.navigation.screen14.continue`
- T-9.2: For assured path, Continue goes to `/claims/reasons-for-possession` (Screen 15)
- T-9.3: Selected grounds are persisted before navigation

**Test IDs:** T-9.1, T-9.2, T-9.3

---

### AC-10: Cancel behaviour

**Behaviour:**
- T-10.1: Clicking Cancel redirects to `/case-list`
- T-10.2: Draft claim remains in session after Cancel
- T-10.3: Selected grounds remain in session after Cancel (not cleared)

**Test IDs:** T-10.1, T-10.2, T-10.3

---

### AC-11: Bypass Screen 14 when "No additional grounds" selected on Screen 13.1.1

**Behaviour:**
- T-11.1: **Out of scope for Screen 14 tests** - this behaviour tested in Screen 13.1.1 tests

**Test IDs:** None (tested in Screen 13.1.1)

**Note:** This AC validates Screen 13.1.1 routing logic, not Screen 14 logic. Screen 14 is not responsible for the bypass - Screen 13.1.1 handles the conditional redirect.

---

### AC-12: Accessibility compliance

**Behaviour:**
- T-12.1: GOV.UK error summary displayed on validation failure
- T-12.2: Error summary link navigates to checkbox group
- T-12.3: Focus moves to error summary on validation failure
- T-12.4: All checkboxes have accessible labels
- T-12.5: Continue, Previous, Cancel buttons are keyboard accessible

**Test IDs:** T-12.1, T-12.2, T-12.3, T-12.4, T-12.5

---

## Additional Behaviours (Cross-Cutting)

### Navigation Contract Setup
- T-NAV-1: Navigation contract set conditionally on GET (only if not present)
- T-NAV-2: Default navigation contract values for assured path
  - previous: `/claims/grounds-for-possession-assured-selection`
  - continue: `/claims/reasons-for-possession`
  - titleMode: `additional`
- T-NAV-3: Existing navigation contract preserved when already set
- T-NAV-4: Navigation contract not corrupted on validation errors

**Test IDs:** T-NAV-1, T-NAV-2, T-NAV-3, T-NAV-4

### Session Structure Integrity
- T-SESS-1: All mandatory grounds use `mandatoryGround{N}` prefix
- T-SESS-2: All discretionary grounds use `discretionaryGround{N}` prefix
- T-SESS-3: Session structure matches expected shape:
  ```js
  session.claim.navigation.screen14 = { previous, continue, titleMode }
  session.claim.grounds.additional = { mandatoryGround1: bool, ... }
  ```

**Test IDs:** T-SESS-1, T-SESS-2, T-SESS-3

---

## Open Questions

**None** - All ambiguities resolved via Q1-Q6 clarification with Steve.

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Title/Display | 6 | AC-1, AC-2 |
| Selection Behaviour | 4 | AC-3 |
| Validation | 5 | AC-4 |
| Preservation | 2 | AC-5 |
| Persistence | 6 | AC-6 |
| Revisit/Change | 5 | AC-7 |
| Navigation (Prev) | 3 | AC-8 |
| Navigation (Cont) | 3 | AC-9 |
| Cancel | 3 | AC-10 |
| Accessibility | 5 | AC-12 |
| Navigation Setup | 4 | Cross-cutting |
| Session Structure | 3 | Cross-cutting |
| **Total** | **49** | **Estimated test count** |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-27.*
