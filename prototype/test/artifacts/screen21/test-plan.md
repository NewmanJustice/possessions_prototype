# Test Plan: Screen 21 — Daily Rent Amount

## Scope

### In Scope
- ✅ Display calculated daily rent amount
- ✅ Confirmation question (Yes/No radios)
- ✅ Required field validation (radio selection)
- ✅ Conditional reveal (manual entry on "No")
- ✅ Manual entry validation (required, numeric, positive, decimals, max amount)
- ✅ Session data persistence (dailyAmount, dailyAmountConfirmed)
- ✅ Pre-population on revisit (radio + manual field)
- ✅ Navigation (Previous, Continue, Cancel)
- ✅ GOV.UK error patterns (summary, inline, focus)
- ✅ Accessibility compliance

### Out of Scope
- ❌ Total arrears calculation
- ❌ Legal threshold validation
- ❌ Arrears date ranges
- ❌ Recalculation logic

---

## Test Types

### 1. Display Tests
- Page structure (heading, calculated amount display)
- Currency formatting (£ symbol, decimals)
- Explanation text
- Radio options (Yes/No)
- Conditional field (initially hidden)
- Navigation buttons

### 2. Validation Tests
**Radio Selection:**
- No selection → error
- Yes selected → valid
- No selected → requires manual entry

**Manual Entry (when "No" selected):**
- Empty field → error
- Non-numeric → error
- Zero/negative → error
- Valid amounts (0.01 to 1,000,000.00)
- Decimal validation (1dp, 2dp, 3+ dp)
- Maximum amount (£1,000,000.00 limit)

### 3. Conditional Behavior Tests
- "No" selected → field revealed
- "Yes" selected → field hidden
- Switch between Yes/No → field show/hide

### 4. Session Persistence Tests
**"Yes" path:**
- dailyAmount = calculatedDailyAmount
- dailyAmountConfirmed = true

**"No" path:**
- dailyAmount = manual entry value
- dailyAmountConfirmed = false

**Revisit:**
- Radio selection pre-populated
- Manual field shown if "No"
- Manual value pre-populated

### 5. Routing Tests
- Successful submission → /claims/details-of-rent-arrears
- Previous → /claims/rent-details
- Cancel → /case-list

### 6. Error Handling Tests
- GOV.UK error summary
- Error links to fields
- Focus management
- Inline errors
- Multiple errors
- Values preserved on error

### 7. Accessibility Tests
- Error summary focus
- Conditional reveal announcements
- Keyboard navigation
- Labels and ARIA

---

## Test Environment

### Technology Stack
- **Framework:** Jest
- **HTTP Testing:** Supertest + supertest-session
- **Template Engine:** Nunjucks
- **UI Components:** GOV.UK Frontend

### Prerequisites
- Session initialized via `navigateToRentDetails()`
- Screen 20 submitted with standard frequency (weekly/fortnightly/monthly)
- `calculatedDailyAmount` exists in session

### Test Data

#### Calculated Amounts (from Screen 20)
- £17.86 (125 weekly)
- £8.93 (125 fortnightly)
- £41.10 (125 monthly)
- £100.00 (700 weekly)

#### Valid Manual Entries
- 0.01, 10.00, 17.85, 125.50, 999999.99, 1000000.00

#### Invalid Manual Entries
- Empty, "abc", "£125", 0, -10, 125.567, 1000000.01

---

## Assumptions

1. **Calculated amount:** Always present from Screen 20
2. **Currency display:** Use GOV.UK Frontend formatting or custom
3. **Conditional reveal:** GOV.UK `govuk-radios__conditional` pattern
4. **Session structure:** Extends `rentDetails` from Screen 20
5. **Error messages:** Match AC text exactly
6. **Placeholder route:** `/claims/details-of-rent-arrears` exists

---

## Risks & Constraints

### Risks
| Risk | Mitigation |
|------|------------|
| Calculated amount missing | Test navigation chain |
| Conditional reveal not working | Test JavaScript dependency |
| Session overwrite on revisit | Test both paths with revisit |
| Currency format inconsistency | Test various amounts |

### Constraints
- Cannot test actual next screen (placeholder only)
- Requires Screen 20 to set calculatedDailyAmount

---

## Test Execution Strategy

### Phase 1: Display & Structure
1. Page renders with calculated amount
2. Radio options present
3. Conditional field initially hidden
4. Navigation buttons visible

### Phase 2: Validation
1. No radio selection → error
2. "No" without manual entry → error
3. Invalid manual entries → errors
4. Valid manual entries → accepted
5. Error presentation

### Phase 3: Conditional Behavior
1. "No" selected → field reveals
2. "Yes" selected → field hidden
3. Toggle between options

### Phase 4: Session & Persistence
1. "Yes" path: correct storage
2. "No" path: correct storage
3. Revisit with "Yes"
4. Revisit with "No"

### Phase 5: Routing
1. Successful submission (both paths)
2. Previous navigation
3. Cancel navigation

### Phase 6: Accessibility
1. Error focus
2. Conditional reveal announcements
3. Keyboard navigation
4. ARIA compliance

---

## Success Criteria

- ✅ All 12 acceptance criteria covered by tests
- ✅ Happy paths tested (Yes and No)
- ✅ Edge cases identified and tested
- ✅ Error scenarios validated
- ✅ Conditional logic verified
- ✅ Session persistence proven
- ✅ Accessibility standards met
- ✅ Traceability to ACs maintained

---

## Estimated Test Count

- Display: ~8 tests
- Validation (radio): ~4 tests
- Validation (manual entry): ~12 tests
- Conditional behavior: ~6 tests
- Session persistence: ~10 tests
- Routing: ~6 tests
- Error handling: ~8 tests
- Accessibility: ~6 tests
- Revisit scenarios: ~8 tests

**Total: ~68 tests**

---

**Status:** ✅ Test plan complete  
**Next:** Create test matrix and map to acceptance criteria
