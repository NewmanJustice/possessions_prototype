# Test Plan: Screen 20 — Rent Details

## Scope

### In Scope
- ✅ Rent amount input (currency field with £ prefix)
- ✅ Rent frequency selection (4 radio options)
- ✅ Required field validation (amount + frequency)
- ✅ Numeric validation (amount must be number > 0)
- ✅ Decimal precision validation (max 2 decimal places)
- ✅ Maximum amount validation (£1,000,000.00 limit)
- ✅ Daily rent auto-calculation (weekly, fortnightly, monthly)
- ✅ Calculation precision (2 decimal places)
- ✅ Conditional routing (standard vs other frequency)
- ✅ Session data persistence
- ✅ Input preservation on validation errors
- ✅ Navigation (Previous, Continue, Cancel)
- ✅ GOV.UK error patterns (summary, inline, focus)
- ✅ Accessibility compliance

### Out of Scope
- ❌ Validating rent against external systems
- ❌ Arrears calculations (different screen)
- ❌ Rent period dates
- ❌ Manual daily amount override (different screen)
- ❌ Currency conversion
- ❌ Multi-currency support

---

## Test Types

### 1. Display Tests
- Page structure (heading, questions, inputs, buttons)
- Currency input with £ prefix
- Radio group with 4 options
- Navigation buttons (Previous, Continue, Cancel)
- GOV.UK component rendering

### 2. Validation Tests
**Rent Amount:**
- Required field
- Non-numeric input
- Zero and negative values
- Decimal precision (1 dp OK, 2 dp OK, 3+ dp ERROR)
- Maximum amount (£1,000,000.00 limit)
- Boundary values (0.01, 1000000.00, 1000000.01)

**Frequency:**
- Required field (none selected)
- Each option validates correctly

### 3. Calculation Tests
**Weekly:** amount ÷ 7, rounded to 2 dp
**Fortnightly:** amount ÷ 14, rounded to 2 dp
**Monthly:** amount ÷ 365 × 12, rounded to 2 dp
**Other:** null (no calculation)

Edge cases:
- Amounts that result in repeating decimals
- Rounding scenarios (0.5 rounds up)

### 4. Routing Tests
- Standard frequencies → `/claims/daily-rent-amount`
- Other frequency → `/claims/details-of-rent-arrears`
- Previous → `/claims/notice-details`
- Cancel → `/case-list`

### 5. Session Persistence Tests
- Data stored in `session.claim.rentDetails`
- Structure: `{amount, frequency, calculatedDailyAmount}`
- Values persist on page revisit
- Calculation updates when frequency changes

### 6. Error Handling Tests
- GOV.UK error summary displayed
- Error summary links to fields
- Focus moves to error summary
- Inline errors on fields
- Multiple simultaneous errors
- Input values preserved on error

### 7. Accessibility Tests
- Error summary has focus (tabindex="-1")
- Error links navigate to inputs
- Labels properly associated
- Keyboard navigation
- ARIA attributes

---

## Test Environment

### Technology Stack
- **Framework:** Jest
- **HTTP Testing:** Supertest + supertest-session
- **Template Engine:** Nunjucks
- **UI Components:** GOV.UK Frontend

### Prerequisites
- Session initialized via `sessionHelper.navigateToRentDetails()`
- Journey path: tenancy → assured confirmation → assured grounds → pre-action → mediation → notice intention → notice details → **rent details**

### Test Data

#### Valid Rent Amounts
- Whole numbers: 100, 125, 500, 1000
- 1 decimal: 125.5, 999.9
- 2 decimals: 125.50, 0.01, 999999.99, 1000000.00

#### Invalid Rent Amounts
- Non-numeric: "abc", "£125", "one hundred"
- Zero/Negative: 0, -125, -0.01
- Too many decimals: 125.567, 100.999
- Over maximum: 1000000.01, 9999999.99

#### Frequencies
- weekly
- fortnightly
- monthly
- other

#### Calculation Examples
| Amount | Frequency | Formula | Expected Daily |
|--------|-----------|---------|----------------|
| 700.00 | weekly | 700 ÷ 7 | 100.00 |
| 750.00 | fortnightly | 750 ÷ 14 | 53.57 |
| 1500.00 | monthly | 1500 ÷ 365 × 12 | 493.15 |
| 125.00 | weekly | 125 ÷ 7 | 17.86 |
| 125.00 | other | null | null |

---

## Assumptions

1. **Calculation precision:** JavaScript `toFixed(2)` or equivalent for rounding
2. **Input sanitization:** Server-side validation strips non-numeric characters
3. **£ symbol handling:** Prefix is visual only, not part of submitted value
4. **Session availability:** Previous screens have initialized session structure
5. **Placeholder routes:** `/claims/daily-rent-amount` and `/claims/details-of-rent-arrears` exist
6. **Error message text:** Matches AC-2 and AC-4 exactly

---

## Risks & Constraints

### Risks
| Risk | Mitigation |
|------|------------|
| Floating point precision errors | Test with known decimal results |
| Rounding inconsistencies | Verify 0.5 rounds up (banker's rounding?) |
| Currency input format variations | Test with various numeric formats |
| Session data loss | Test persistence across requests |
| Routing logic errors | Test all 4 frequency paths separately |

### Constraints
- Cannot test actual `/claims/daily-rent-amount` implementation (placeholder only)
- Cannot test actual `/claims/details-of-rent-arrears` implementation (placeholder only)
- Calculation is indicative (may be overridden later per user story)

---

## Test Execution Strategy

### Phase 1: Display & Structure
1. Page renders correctly
2. All inputs and labels present
3. Navigation buttons visible

### Phase 2: Validation
1. Required field errors
2. Numeric validation errors
3. Decimal precision errors
4. Maximum amount errors
5. Error presentation (summary + inline)

### Phase 3: Calculation
1. Weekly calculation correctness
2. Fortnightly calculation correctness
3. Monthly calculation correctness
4. Other (no calculation)
5. Rounding edge cases

### Phase 4: Routing
1. Standard frequencies → daily-rent-amount
2. Other frequency → details-of-rent-arrears
3. Previous navigation
4. Cancel navigation

### Phase 5: Session & Persistence
1. Data stored correctly
2. Data structure validated
3. Pre-population on revisit
4. Data preserved on error

### Phase 6: Accessibility
1. Error focus management
2. Error summary links
3. Keyboard navigation
4. ARIA compliance

---

## Success Criteria

- ✅ All 12 acceptance criteria covered by tests
- ✅ Happy path tests pass
- ✅ Edge cases identified and tested
- ✅ Error scenarios validated
- ✅ Routing logic verified
- ✅ Calculation accuracy confirmed
- ✅ Session persistence proven
- ✅ Accessibility standards met
- ✅ Traceability to ACs maintained

---

## Estimated Test Count

- Display: ~10 tests
- Validation (amount): ~15 tests
- Validation (frequency): ~5 tests
- Calculation: ~10 tests
- Routing: ~8 tests
- Session: ~8 tests
- Error handling: ~10 tests
- Accessibility: ~8 tests
- Navigation: ~6 tests

**Total: ~80 tests**

---

**Status:** ✅ Test plan complete  
**Next:** Create test matrix and map to acceptance criteria
