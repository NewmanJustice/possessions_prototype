# Understanding: Screen 20 — Rent Details

## Story Summary
Solicitors need to record the rent amount and payment frequency so the system can automatically calculate the daily rent rate for unpaid rent charges. The calculation method and next screen depend on which frequency is selected.

---

## Primary Behaviour (Happy Path)

1. User enters a valid rent amount (e.g., £125.50)
2. User selects a frequency (Weekly, Fortnightly, Monthly, or Other)
3. If standard frequency (Weekly/Fortnightly/Monthly):
   - System auto-calculates daily rent amount
   - Stores calculation in session
   - Routes to `/claims/daily-rent-amount`
4. If Other frequency:
   - No calculation performed
   - Routes to `/claims/details-of-rent-arrears`

---

## Key Behaviours

### Input Capture
- **Rent amount:** Currency input with £ prefix, accepts decimals (max 2 places)
- **Frequency:** Radio group with 4 options (weekly, fortnightly, monthly, other)

### Validation Rules
- **Rent amount:**
  - Required
  - Must be numeric
  - Must be greater than 0
  - Must not exceed £1,000,000 (clarified with Steve)
  - Max 2 decimal places (clarified with Steve)
- **Frequency:** Required (one option must be selected)

### Calculation Logic
| Frequency    | Formula                  | Example (£125.00) |
|--------------|--------------------------|-------------------|
| Weekly       | rent ÷ 7                 | £17.86           |
| Fortnightly  | rent ÷ 14                | £8.93            |
| Monthly      | rent ÷ 365 × 12          | £41.10           |
| Other        | null (no calculation)    | null             |

**Precision:** Calculated amounts rounded to 2 decimal places (clarified with Steve)

### Branching Logic
- **Standard frequencies** → `/claims/daily-rent-amount`
- **Other frequency** → `/claims/details-of-rent-arrears`

---

## Variants

### Input Variations
- Whole numbers (e.g., 125)
- Decimals with 1 place (e.g., 125.5)
- Decimals with 2 places (e.g., 125.50)
- Edge amounts (0.01, 999999.99, 1000000.00)

### Frequency Variations
- Each of 4 radio options
- Switching between options
- Revisiting page with pre-populated data

---

## Constraints

### Business Rules
1. Only positive rent amounts allowed
2. Maximum rent: £1,000,000.00
3. Maximum 2 decimal places
4. Frequency selection determines routing
5. Calculation only for standard frequencies

### Technical Constraints
- Session storage required for rent details
- Calculation precision: 2 decimal places
- GOV.UK error patterns for validation
- Currency input formatting (£ prefix)

### Security Constraints
- Input sanitization for numeric fields
- No injection vulnerabilities in currency handling

---

## Assumptions

**A1 — Decimal validation:**  
Rent amounts with more than 2 decimal places (e.g., £125.567) will trigger validation error.  
**Rationale:** Currency should match pence precision (clarified with Steve: max 2 decimal places)

**A2 — Maximum amount:**  
Rent amounts over £1,000,000.00 will trigger validation error.  
**Rationale:** Reasonable upper bound for rent validation (clarified with Steve: £1,000,000 limit)

**A3 — Calculation rounding:**  
Daily rent amounts are rounded to 2 decimal places using standard rounding (0.5 rounds up).  
**Rationale:** Currency precision for daily rate (clarified with Steve: 2 decimal places)

**A4 — Other frequency handling:**  
When "Other" is selected, `calculatedDailyAmount` is set to `null` (not omitted).  
**Rationale:** Explicit null indicates no calculation vs missing data (clarified with Steve: set to null)

**A5 — Placeholder routes:**  
Both next screen routes (`/claims/daily-rent-amount` and `/claims/details-of-rent-arrears`) will have placeholder implementations.  
**Rationale:** Testing continuity and routing verification (clarified with Steve: create both placeholders)

**A6 — Currency formatting:**  
Input field accepts numeric input without £ symbol (£ is a prefix label, not part of the value).  
**Rationale:** Standard GOV.UK currency input pattern

**A7 — Validation error messages:**  
Error messages match exact text from AC-2 and AC-4.  
**Rationale:** Explicit error messages provided in acceptance criteria

**A8 — Session structure:**  
Session path is `session.claim.rentDetails` with properties `amount`, `frequency`, `calculatedDailyAmount`.  
**Rationale:** Explicit session structure defined in user story

---

## Ambiguities & Questions

✅ **Q1 — Decimal handling:** RESOLVED — Accept decimals, max 2 decimal places  
✅ **Q2 — Maximum amount:** RESOLVED — £1,000,000.00 limit  
✅ **Q3 — Calculation precision:** RESOLVED — 2 decimal places  
✅ **Q4 — Other frequency storage:** RESOLVED — Set to null  
✅ **Q5 — Placeholder routes:** RESOLVED — Create both placeholders

---

## Session State Structure

```javascript
session.claim.rentDetails = {
  amount: 125.50,                    // Number, 2 decimal places max
  frequency: 'weekly',               // 'weekly' | 'fortnightly' | 'monthly' | 'other'
  calculatedDailyAmount: 17.93       // Number (2 decimals) or null (for 'other')
}
```

---

## Out of Scope

- ❌ Validating rent against tenancy agreements
- ❌ Calculating total arrears
- ❌ Capturing rent start/end dates
- ❌ Overriding calculated daily amounts on this screen
- ❌ Historical rent records
- ❌ Variable rent amounts

---

## Navigation Flow

```
Previous: /claims/notice-details (Screen 19)
  ↓
Current: /claims/rent-details (Screen 20)
  ↓
Next (Standard): /claims/daily-rent-amount (Screen 21)
  OR
Next (Other): /claims/details-of-rent-arrears (Screen 21 alt)
  
Cancel: /case-list (draft preserved)
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Calculation precision errors | Medium | Medium | Test edge cases, verify rounding |
| Currency input confusion (£ in value) | Low | Low | Test input sanitization |
| Routing logic errors | Low | High | Test all frequency options separately |
| Session data corruption | Low | Medium | Test data structure explicitly |
| Validation bypass | Low | High | Test all validation rules with boundary values |

---

**Status:** ✅ Ready for test plan creation  
**Next Step:** Create test plan, test matrix, and traceability table
