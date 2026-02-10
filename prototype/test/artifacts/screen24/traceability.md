# Traceability Table — Screen 24: Claimant's Circumstances

## Acceptance Criteria → Test Mapping

| AC ID | Acceptance Criterion | Test IDs | Status | Notes |
|-------|---------------------|----------|--------|-------|
| AC-1 | Display claimant circumstances question | T-1.1 to T-1.5 | ✅ Ready | Dynamic name, Yes/No radios, guidance |
| AC-2 | Selection is required | T-2.1 to T-2.5 | ✅ Ready | GOV.UK error pattern |
| AC-3 | Reveal details field when Yes selected | T-3.1 to T-3.3 | ✅ Ready | Conditional reveal |
| AC-4 | Details are optional when revealed | T-4.1 to T-4.3 | ✅ Ready | Empty/whitespace accepted |
| AC-5 | Character limit enforced | T-5.1 to T-5.5 | ✅ Ready | 950 character limit |
| AC-6 | Persist claimant circumstances | T-6.1 to T-6.5 | ✅ Ready | Boolean + string storage |
| AC-7 | Preserve input on revisit | T-7.1 to T-7.4 | ✅ Ready | Pre-population |
| AC-8 | Previous navigation | T-8.1, T-8.2 | ✅ Ready | Back to Screen 23 |
| AC-9 | Continue navigation | T-9.1 to T-9.3 | ✅ Ready | Forward to Screen 25 |
| AC-10 | Cancel behaviour | T-10.1, T-10.2 | ✅ Ready | To case list |
| AC-11 | Accessibility compliance | T-11.1 to T-11.7 | ✅ Ready | GOV.UK patterns |

---

## Test Category Breakdown

### Display (AC-1)
- **T-1.1:** Question text with dynamic claimant name
- **T-1.2:** Yes radio option present
- **T-1.3:** No radio option present
- **T-1.4:** Correct name attribute (`provideCircumstances`)
- **T-1.5:** Guidance text about financial/general information

**Coverage:** 5 tests

---

### Validation - Selection Required (AC-2)
- **T-2.1:** Error shown when no selection
- **T-2.2:** Correct error message text
- **T-2.3:** Error summary present
- **T-2.4:** Inline error present
- **T-2.5:** Focus moves to summary

**Coverage:** 5 tests

---

### Conditional Reveal (AC-3)
- **T-3.1:** Textarea included in page markup
- **T-3.2:** Textarea has correct name attribute
- **T-3.3:** Character limit guidance displayed

**Coverage:** 3 tests

---

### Details Optional (AC-4)
- **T-4.1:** Yes with empty details accepted
- **T-4.2:** Yes with whitespace-only accepted
- **T-4.3:** Redirects successfully with empty details

**Coverage:** 3 tests

---

### Character Limit (AC-5)
- **T-5.1:** 951 characters rejected
- **T-5.2:** Correct error message
- **T-5.3:** 950 characters accepted
- **T-5.4:** Error summary displayed
- **T-5.5:** Inline error on textarea

**Coverage:** 5 tests

---

### Persistence (AC-6)
- **T-6.1:** Yes → `provided: true`
- **T-6.2:** No → `provided: false`
- **T-6.3:** Details stored with Yes
- **T-6.4:** Details null with No
- **T-6.5:** Details cleared on Yes→No change

**Coverage:** 5 tests

---

### Pre-Population (AC-7)
- **T-7.1:** Yes pre-selected (provided true)
- **T-7.2:** No pre-selected (provided false)
- **T-7.3:** Details textarea pre-filled
- **T-7.4:** First visit (no pre-selection)

**Coverage:** 4 tests

---

### Navigation - Previous (AC-8)
- **T-8.1:** Redirects to money-judgement
- **T-8.2:** Preserves session data

**Coverage:** 2 tests

---

### Navigation - Continue (AC-9)
- **T-9.1:** Yes redirects to defendants-circumstances
- **T-9.2:** No redirects to defendants-circumstances
- **T-9.3:** Data persisted before redirect

**Coverage:** 3 tests

---

### Cancel (AC-10)
- **T-10.1:** Redirects to case-list
- **T-10.2:** Session preserved

**Coverage:** 2 tests

---

### Accessibility (AC-11)
- **T-11.1:** Error summary rendered
- **T-11.2:** Error link targets radios
- **T-11.3:** Error link targets textarea (character limit)
- **T-11.4:** Focus management (tabindex)
- **T-11.5:** Radio labels
- **T-11.6:** Textarea label
- **T-11.7:** Keyboard accessible

**Coverage:** 7 tests

---

### Dynamic Claimant Name (Cross-Cutting)
- **T-DYN-1:** Name from session displayed
- **T-DYN-2:** Fallback "the claimant" used

**Coverage:** 2 tests

---

### Selection Change (Cross-Cutting)
- **T-CHG-1:** Yes → No clears details
- **T-CHG-2:** No → Yes allows new details
- **T-CHG-3:** Multiple changes handled

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
- **Fully Covered:** 11 ACs (AC-1 through AC-11)
- **Coverage Rate:** 11/11 ACs = **100%**

### Behaviour Coverage
- ✅ Happy path (select Yes/No, navigate successfully)
- ✅ Error cases (no selection, character limit exceeded)
- ✅ Pre-population (first visit, revisit with Yes, revisit with No)
- ✅ Selection change (Yes↔No transitions, details clearing)
- ✅ Conditional reveal (textarea shown/hidden)
- ✅ Character limit boundary (950 valid, 951 invalid)
- ✅ Optional details (empty, whitespace accepted)
- ✅ Navigation (Previous, Continue, Cancel)
- ✅ Session management (persistence, boolean mapping)
- ✅ Accessibility (error summary, focus, labels, keyboard)
- ✅ Dynamic content (claimant name)

### Risk Coverage
- ✅ Dynamic claimant name tested with fallback
- ✅ Conditional reveal tested for both states
- ✅ Character limit boundary explicitly tested
- ✅ Details clearing on selection change tested
- ✅ Whitespace handling tested

---

## Comparison with Existing Tests

The existing test file (`claimantsCircumstances.test.js`) has **28 tests** covering:

| Category | Existing Tests | Matrix Tests | Notes |
|----------|---------------|--------------|-------|
| Question Display | 5 | 5 | Aligned |
| Validation (Selection) | 3 | 5 | Matrix more comprehensive |
| Conditional Reveal | 2 | 3 | Matrix adds character guidance |
| Details Optional | 2 | 3 | Matrix adds whitespace test |
| Character Limit | 2 | 5 | Matrix more comprehensive |
| Persistence | 4 | 5 | Matrix adds details clearing |
| Pre-Population | 3 | 4 | Matrix adds first visit |
| Navigation | 4 | 7 | Aligned |
| Accessibility | 3 | 7 | Matrix more comprehensive |

**Gap Analysis:** The existing tests provide good coverage but the matrix identifies additional edge cases and accessibility tests that could be added.

---

## Notes

1. **Conditional reveal pattern:** Uses standard GOV.UK `govuk-radios__conditional` pattern where the textarea is always in the DOM but shown/hidden via CSS based on radio selection.

2. **Session structure:** Matches user story specification:
   ```javascript
   session.claim.claimantCircumstances = {
     provided: true | false,
     details: string | null
   }
   ```

3. **Dynamic claimant name:** Uses `session.claim.claimantName` with fallback "the claimant" for display. This is consistent with other screens using dynamic names.

4. **Character limit:** Server-side validation at 950 characters. Client-side guidance ("You can enter up to 950 characters") is display only.

5. **Details optional:** Unlike some conditional reveals that require input when shown, this textarea is explicitly optional per AC-4.

6. **Details clearing:** When user changes from Yes to No, details are set to null. This prevents stale data from being submitted if user toggles back to Yes later.

---

*Traceability table created by Nigel (Tester Agent) on 2026-01-28.*
