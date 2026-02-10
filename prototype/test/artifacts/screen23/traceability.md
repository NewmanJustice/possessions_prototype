# Traceability Table — Screen 23: Money Judgement

## Acceptance Criteria → Test Mapping

| AC ID | Acceptance Criterion | Test IDs | Status | Notes |
|-------|---------------------|----------|--------|-------|
| AC-1 | Display money judgment question | T-1.1, T-1.2, T-1.3, T-1.4 | ✅ Ready | Yes/No radios |
| AC-2 | Selection is required | T-2.1, T-2.2, T-2.3, T-2.4, T-2.5 | ✅ Ready | GOV.UK error pattern |
| AC-3 | Persist money judgment intention | T-3.1, T-3.2, T-3.3, T-3.4 | ✅ Ready | Boolean storage |
| AC-4 | Previous navigation | T-4.1, T-4.2 | ✅ Ready | Back to Screen 22 |
| AC-5 | Continue navigation | T-5.1, T-5.2 | ✅ Ready | Forward to Screen 24 |
| AC-6 | Cancel behaviour | T-6.1, T-6.2 | ✅ Ready | To case list |
| AC-7 | Accessibility compliance | T-7.1 to T-7.5 | ✅ Ready | GOV.UK patterns |

---

## Test Category Breakdown

### Display (AC-1)
- **T-1.1:** Question text displayed
- **T-1.2:** Yes radio option present
- **T-1.3:** No radio option present
- **T-1.4:** Correct name attribute

**Coverage:** 4 tests

---

### Validation (AC-2)
- **T-2.1:** Error shown when no selection
- **T-2.2:** Correct error message
- **T-2.3:** Error summary present
- **T-2.4:** Inline error present
- **T-2.5:** Focus moves to summary

**Coverage:** 5 tests

---

### Persistence (AC-3)
- **T-3.1:** Yes → `requested: true`
- **T-3.2:** No → `requested: false`
- **T-3.3:** Stored in correct session location
- **T-3.4:** Persists across requests

**Coverage:** 4 tests

---

### Navigation - Previous (AC-4)
- **T-4.1:** Redirects to details-of-rent-arrears
- **T-4.2:** Preserves session data

**Coverage:** 2 tests

---

### Navigation - Continue (AC-5)
- **T-5.1:** Redirects to claimants-circumstances
- **T-5.2:** Persists selection before redirect

**Coverage:** 2 tests

---

### Cancel (AC-6)
- **T-6.1:** Redirects to case-list
- **T-6.2:** Session preserved

**Coverage:** 2 tests

---

### Accessibility (AC-7)
- **T-7.1:** Error summary rendered
- **T-7.2:** Error link targets radios
- **T-7.3:** Focus management
- **T-7.4:** Radio labels
- **T-7.5:** Keyboard accessible

**Coverage:** 5 tests

---

### Pre-Population (Cross-Cutting)
- **T-PRE-1:** First visit (no pre-selection)
- **T-PRE-2:** Yes pre-selected (true in session)
- **T-PRE-3:** No pre-selected (false in session)
- **T-PRE-4:** After validation error

**Coverage:** 4 tests

---

### Selection Change (Cross-Cutting)
- **T-CHG-1:** Yes → No (true → false)
- **T-CHG-2:** No → Yes (false → true)
- **T-CHG-3:** Multiple changes

**Coverage:** 3 tests

---

### Boolean Mapping (Cross-Cutting)
- **T-MAP-1:** "yes" → true
- **T-MAP-2:** "no" → false
- **T-MAP-3:** true → "yes" checked
- **T-MAP-4:** false → "no" checked

**Coverage:** 4 tests

---

## Coverage Analysis

### Acceptance Criteria Coverage
- **Fully Covered:** 7 ACs (AC-1 through AC-7)
- **Coverage Rate:** 7/7 ACs = **100%**

### Behaviour Coverage
- ✅ Happy path (select Yes or No, navigate successfully)
- ✅ Error case (no selection)
- ✅ Pre-population (first visit, revisit with Yes, revisit with No)
- ✅ Selection change (Yes↔No transitions)
- ✅ Navigation (Previous, Continue, Cancel)
- ✅ Session management (persistence, boolean mapping)
- ✅ Accessibility (error summary, focus, labels)

### Risk Coverage
- ✅ British spelling (`moneyJudgement`) tested throughout
- ✅ Boolean mapping verified in both directions
- ✅ Pre-population tested for undefined (first visit) scenario
- ✅ Selection changes tested explicitly

---

## Notes

1. **Simplicity:** This is one of the simpler screens with just a single Yes/No choice. Test count (~35) reflects comprehensive coverage of a simple pattern rather than complex behavior.

2. **British spelling:** Using `moneyJudgement` with 'e' consistently to match:
   - Route: `/claims/money-judgement`
   - Session key: `session.claim.moneyJudgement`
   - AC text

3. **Boolean mapping:** Tests explicitly verify the conversion between form values ("yes"/"no" strings) and session storage (true/false booleans) in both directions.

4. **Pre-population logic:** 
   - First visit: `requested` is undefined → no radio pre-selected
   - Revisit with Yes: `requested === true` → "yes" radio checked
   - Revisit with No: `requested === false` → "no" radio checked

5. **No conditional logic:** Unlike screens with conditional reveals, this screen has no additional complexity. Both Yes and No lead to the same next screen (Screen 24).

6. **Test reuse patterns:** This screen follows standard patterns established in earlier screens (e.g., Screen 13.1 for radio validation, Screen 12 for Yes/No choices).

---

*Traceability table created by Nigel (Tester Agent) on 2026-01-27.*
