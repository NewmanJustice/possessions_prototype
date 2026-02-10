# Traceability Table — Screen 14: Grounds for Possession

## Acceptance Criteria → Test Mapping

| AC ID | Acceptance Criterion | Test IDs | Status | Notes |
|-------|---------------------|----------|--------|-------|
| AC-1 | Title is "Additional grounds for possession" when entered from assured path | T-1.1, T-1.2 | ✅ Ready | Tests titleMode='additional' |
| AC-2 | Display grounds list as checkboxes | T-2.1, T-2.2, T-2.3, T-2.4 | ✅ Ready | 14 grounds in 2 groups |
| AC-3 | Multiple selection allowed | T-3.1, T-3.2, T-3.3, T-3.4 | ✅ Ready | 0, 1, many, all grounds |
| AC-4 | At least one ground must be selected | T-4.1, T-4.2, T-4.3, T-4.4, T-4.5 | ✅ Ready | Full error pattern tested |
| AC-5 | Preserve selections on validation failure | T-5.1, T-5.2 | ✅ Ready | Re-render preserves checkboxes |
| AC-6 | Persist selected additional grounds | T-6.1, T-6.2, T-6.3, T-6.4, T-6.5, T-6.6 | ✅ Ready | Prefixed keys, true/false values |
| AC-7 | Preserve selections on revisit | T-7.1, T-7.2, T-7.3, T-7.4, T-7.5 | ✅ Ready | Pre-population + changes |
| AC-8 | Previous uses dynamic navigation contract | T-8.1, T-8.2, T-8.3 | ✅ Ready | Dynamic routing tested |
| AC-9 | Continue uses dynamic navigation contract | T-9.1, T-9.2, T-9.3 | ✅ Ready | Dynamic routing tested |
| AC-10 | Cancel behaviour | T-10.1, T-10.2, T-10.3 | ✅ Ready | Fixed route, session preserved |
| AC-11 | Bypass Screen 14 when "No" on Screen 13.1.1 | N/A | ⚠️ Out of Scope | Tested in Screen 13.1.1 |
| AC-12 | Accessibility compliance | T-12.1, T-12.2, T-12.3, T-12.4, T-12.5 | ✅ Ready | GOV.UK error pattern |

---

## Test Category Breakdown

### Display and Rendering (AC-1, AC-2)
- **T-1.1:** Title displays "Additional grounds for possession"
- **T-1.2:** Page title and h1 match titleMode
- **T-2.1:** 6 mandatory ground checkboxes rendered
- **T-2.2:** 8 discretionary ground checkboxes rendered
- **T-2.3:** All 14 checkboxes have correct labels
- **T-2.4:** Checkboxes grouped by category

**Coverage:** 6 tests

---

### Selection Behaviour (AC-3)
- **T-3.1:** Zero grounds selected (triggers validation)
- **T-3.2:** One ground selected
- **T-3.3:** Multiple grounds selected (e.g., 3)
- **T-3.4:** All 14 grounds selected

**Coverage:** 4 tests

---

### Validation (AC-4, AC-5)
- **T-4.1:** Zero grounds error message
- **T-4.2:** GOV.UK error summary displayed
- **T-4.3:** Inline error message displayed
- **T-4.4:** Error link targets checkbox group
- **T-4.5:** Focus moves to error summary
- **T-5.1:** Single selection preserved on error
- **T-5.2:** Multiple selections preserved on error

**Coverage:** 7 tests

---

### Session Persistence (AC-6)
- **T-6.1:** Mandatory ground stored as `mandatoryGround1: true`
- **T-6.2:** Discretionary ground stored as `discretionaryGround9: true`
- **T-6.3:** Multiple grounds stored with correct keys
- **T-6.4:** All 14 grounds use prefixed keys
- **T-6.5:** Unselected grounds stored as `false`
- **T-6.6:** Data persisted in `session.claim.grounds.additional`

**Coverage:** 6 tests

---

### Revisit and Modification (AC-7)
- **T-7.1:** Single ground pre-checked on revisit
- **T-7.2:** Multiple grounds pre-checked on revisit
- **T-7.3:** Add more grounds on revisit
- **T-7.4:** Deselect grounds on revisit
- **T-7.5:** Deselected ground set to `false` in session

**Coverage:** 5 tests

---

### Navigation - Previous (AC-8)
- **T-8.1:** Previous uses `session.claim.navigation.screen14.previous`
- **T-8.2:** For assured path, goes to assured selection screen
- **T-8.3:** Selections preserved when clicking Previous

**Coverage:** 3 tests

---

### Navigation - Continue (AC-9)
- **T-9.1:** Continue uses `session.claim.navigation.screen14.continue`
- **T-9.2:** For assured path, goes to `/claims/reasons-for-possession`
- **T-9.3:** Selections persisted before navigation

**Coverage:** 3 tests

---

### Navigation - Cancel (AC-10)
- **T-10.1:** Cancel redirects to `/case-list`
- **T-10.2:** Draft claim remains in session
- **T-10.3:** Selections remain in session

**Coverage:** 3 tests

---

### Accessibility (AC-12)
- **T-12.1:** Error summary rendered
- **T-12.2:** Error link navigates to checkboxes
- **T-12.3:** Focus moves to error summary
- **T-12.4:** Checkboxes have accessible labels
- **T-12.5:** Buttons are keyboard accessible

**Coverage:** 5 tests

---

### Navigation Contract Setup (Cross-Cutting)
- **T-NAV-1:** Navigation contract set conditionally (only if not present)
- **T-NAV-2:** Default values set for assured path
- **T-NAV-3:** Existing contract preserved
- **T-NAV-4:** Contract not corrupted on validation errors

**Coverage:** 4 tests

---

### Session Structure (Cross-Cutting)
- **T-SESS-1:** Mandatory grounds use `mandatoryGround{N}` prefix
- **T-SESS-2:** Discretionary grounds use `discretionaryGround{N}` prefix
- **T-SESS-3:** Session structure matches expected shape

**Coverage:** 3 tests

---

## Test Summary

| Category | Test Count | AC Coverage |
|----------|------------|-------------|
| Display | 6 | AC-1, AC-2 |
| Selection | 4 | AC-3 |
| Validation | 7 | AC-4, AC-5 |
| Persistence | 6 | AC-6 |
| Revisit | 5 | AC-7 |
| Navigation (Prev) | 3 | AC-8 |
| Navigation (Cont) | 3 | AC-9 |
| Cancel | 3 | AC-10 |
| Accessibility | 5 | AC-12 |
| Navigation Setup | 4 | Cross-cutting |
| Session Structure | 3 | Cross-cutting |
| **Total** | **49** | **11 of 12 ACs** |

**Note:** AC-11 (bypass logic) is tested in Screen 13.1.1 tests, not here.

---

## Coverage Analysis

### Acceptance Criteria Coverage
- **Fully Covered:** 11 ACs (AC-1 through AC-10, AC-12)
- **Out of Scope:** 1 AC (AC-11 - tested elsewhere)
- **Coverage Rate:** 11/11 in-scope ACs = **100%**

### Behaviour Coverage
- ✅ Happy path (select grounds, navigate successfully)
- ✅ Edge cases (0 grounds, all grounds, deselection)
- ✅ Error cases (validation failure, error display)
- ✅ Navigation (dynamic Previous/Continue, fixed Cancel)
- ✅ Session management (persistence, pre-population, deselection)
- ✅ Accessibility (error summary, focus, labels)
- ✅ Dynamic routing (navigation contract setup and usage)

### Risk Coverage
- ✅ 14 checkboxes tested with representative samples (not all 16,384 combinations)
- ✅ Navigation contract setup tested for conditional logic
- ✅ Deselection behavior tested explicitly
- ✅ Title mode tested for 'additional' (future: test 'standard')

---

## Open Questions

**None** - All clarifications resolved via Q1-Q6 with Steve.

---

## Notes

1. **AC-11 exclusion rationale:** Screen 14 is not responsible for the bypass logic. Screen 13.1.1 handles the conditional redirect (No → Screen 16, Yes → Screen 14). Testing this in Screen 13.1.1 is correct separation of concerns.

2. **Checkbox combination testing:** Testing all 2^14 = 16,384 combinations is impractical. Tests cover representative samples: zero (error), one, few, many, all. This provides sufficient coverage for checkbox selection logic.

3. **Title mode scope:** Only testing `titleMode='additional'` for the assured journey. Future work: add tests for `titleMode='standard'` when other journey paths are implemented.

4. **Navigation contract flexibility:** Tests verify that the navigation contract is used correctly, supporting future entry points with different previous/continue routes.

5. **Prefixed keys validation:** Tests explicitly verify that all 14 grounds use the correct prefixed keys (mandatory/discretionaryGround{N}), preventing session structure bugs.

---

*Traceability table created by Nigel (Tester Agent) on 2026-01-27.*
