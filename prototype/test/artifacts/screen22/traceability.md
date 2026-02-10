# Traceability Table — Screen 22: Details of Rent Arrears

## Acceptance Criteria → Test Mapping

| AC ID | Acceptance Criterion | Test IDs | Status | Notes |
|-------|---------------------|----------|--------|-------|
| AC-1 | Display rent statement guidance | T-1.1, T-1.2, T-1.3 | ✅ Ready | Guidance text from design |
| AC-2 | Upload rent statement (optional) | T-2.1, T-2.2, T-2.3 | ✅ Ready | UI only, upload not tested |
| AC-3 | Upload stores metadata only | T-3.1, T-3.2, T-3.3 | ✅ Ready | Session structure tested |
| AC-5 | Display total rent arrears input | T-5.1, T-5.2, T-5.3 | ✅ Ready | Currency input |
| AC-6 | Total arrears required and numeric | T-6.1 to T-6.9 | ✅ Ready | 9 validation tests |
| AC-7 | Ask about third-party payments | T-7.1, T-7.2, T-7.3 | ✅ Ready | Yes/No radio |
| AC-8 | Third-party selection required | T-8.1 to T-8.4 | ✅ Ready | Validation + error pattern |
| AC-9 | Reveal payment sources when Yes | T-9.1 to T-9.7 | ✅ Ready | 5 checkboxes revealed |
| AC-10 | At least one source required | T-10.1 to T-10.4 | ✅ Ready | Conditional validation |
| AC-11 | Other reveals details field | T-11.1 to T-11.3 | ✅ Ready | 2nd level conditional |
| AC-12 | Validate other details | T-12.1 to T-12.4 | ✅ Ready | Text input validation |
| AC-13 | Persist rent arrears details | T-13.1 to T-13.11 | ✅ Ready | Complete session structure |
| AC-14 | Previous navigation | T-14.1, T-14.2 | ✅ Ready | Back to Screen 21 |
| AC-15 | Continue navigation | T-15.1, T-15.2 | ✅ Ready | Forward to Screen 23 |
| AC-16 | Cancel behaviour | T-16.1, T-16.2 | ✅ Ready | To case list |
| AC-17 | Accessibility compliance | T-17.1 to T-17.5 | ✅ Ready | GOV.UK patterns |

---

## Test Category Breakdown

### Display and Guidance (AC-1, AC-2, AC-3, AC-5, AC-7)
- **Total:** 15 tests covering UI rendering

### Validation (AC-6, AC-8, AC-10, AC-12)
- **Total:** 21 tests covering 4 validation rules

### Conditional Reveals (AC-9, AC-11)
- **Total:** 10 tests covering 2-level conditionals

### Session Persistence (AC-13)
- **Total:** 11 tests covering complete data structure

### Navigation (AC-14, AC-15, AC-16)
- **Total:** 6 tests covering 3 routes

### Accessibility (AC-17)
- **Total:** 5 tests covering GOV.UK patterns

### Cross-Cutting Concerns
- **Currency validation details:** 9 tests
- **Pre-population:** 5 tests
- **Payment source combinations:** 5 tests
- **Conditional reveal behavior:** 5 tests
- **Multiple validation errors:** 3 tests

**Grand Total:** ~92 tests

---

## Coverage Analysis

### Acceptance Criteria Coverage
- **Fully Covered:** 16 ACs (AC-1, AC-2, AC-3, AC-5 through AC-17)
- **Note:** AC-4 not in original AC list (numbering skip in story)
- **Coverage Rate:** 16/16 ACs = **100%**

### Behaviour Coverage
- ✅ Happy path (all fields filled correctly)
- ✅ Minimal path (no upload, No to third-party)
- ✅ Edge cases (min/max currency, all payment sources)
- ✅ Error cases (4 validation rules, multiple errors)
- ✅ Conditional logic (2 levels: third-party → sources, other → details)
- ✅ Navigation (Previous, Continue, Cancel)
- ✅ Session management (persistence, pre-population)
- ✅ Accessibility (error summary, focus, reveals)

### Risk Coverage
- ✅ Complex conditional logic tested explicitly
- ✅ Currency validation matches Screen 20 patterns
- ✅ All 5 payment sources tested individually and combined
- ✅ Deselection behavior tested (set to false)
- ✅ Other details conditional tested separately
- ✅ Multiple validation errors tested simultaneously

---

## Notes

1. **AC-4 missing:** The user story skips from AC-3 to AC-5. This appears to be a numbering issue in the source document. All actual acceptance criteria are tested.

2. **File upload scope:** Tests verify upload UI is present and metadata structure, but do not test actual file upload mechanism (multipart form handling, storage). This is explicitly out of scope per Q2.

3. **Currency validation:** Reuses patterns from Screen 20. Same validation rules: £0.01 to £1,000,000, max 2 decimals.

4. **Payment sources keys:** All use camelCase as specified: `universalCredit`, `housingBenefit`, `discretionaryHousingPayment`, `homelessPreventionFund`, `other`.

5. **Deselection handling:** Like Screen 14, deselected payment sources are set to `false` (not undefined or removed). This ensures proper pre-population.

6. **Conditional reveals:** Two levels tested:
   - Level 1: Third-party Yes → Payment sources checkboxes
   - Level 2: Other selected → Payment source details text input

7. **Test count rationale:** Higher test count (~92) due to:
   - 4 validation rules each with multiple scenarios
   - 5 payment sources with combination testing
   - 2 levels of conditional reveals
   - Currency validation edge cases
   - Pre-population for multiple field types

---

*Traceability table created by Nigel (Tester Agent) on 2026-01-27.*
