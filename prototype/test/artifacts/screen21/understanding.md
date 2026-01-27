# Understanding: Screen 21 — Daily Rent Amount

## Story Summary
Solicitors need to review the system-calculated daily rent amount from Screen 20 and either confirm it or provide a corrected amount. This ensures accurate unpaid rent charge calculations in the possession claim.

---

## Primary Behaviour (Happy Path)

1. User views calculated daily rent amount (from Screen 20)
2. User asked: "Is the amount per day that unpaid rent should be charged at correct?"
3. **Path A (Confirm):**
   - Select "Yes"
   - Click Continue
   - dailyAmountConfirmed = true, dailyAmount = calculatedDailyAmount
   - Redirect to next screen
4. **Path B (Override):**
   - Select "No"
   - Enter corrected daily rent amount
   - Click Continue
   - dailyAmountConfirmed = false, dailyAmount = manually entered value
   - Redirect to next screen

---

## Key Behaviours

### Input Display
- **Calculated amount:** Read from `session.claim.rentDetails.calculatedDailyAmount`
- **Display format:** Currency format with £ symbol (Q1)
- **Explanation text:** Context about the calculation source

### Confirmation Question
- **Radio options:** Yes / No (required)
- **Conditional reveal:** "No" reveals manual entry field
- **Default state:** No selection (must choose one)

### Manual Entry (Conditional)
- **Trigger:** "No" radio selected
- **Field:** Currency input for corrected daily amount
- **Validation:** Same as Screen 20 amount (Q2)
  - Required when "No" selected
  - Numeric
  - Greater than 0
  - Max 2 decimal places
  - Max £1,000,000.00

---

## Variants

### Confirmation Variations
- Yes selected → confirm calculated amount
- No selected → manual entry revealed
- No selection → validation error

### Manual Entry Variations
- Valid amounts (0.01 to 1,000,000.00)
- Invalid amounts (non-numeric, zero, negative, >2 decimals, >£1M)

### Revisit Scenarios
- Return with "Yes" previously selected
- Return with "No" previously selected (manual field revealed with value)

---

## Constraints

### Business Rules
1. Calculated amount comes from Screen 20
2. User must confirm or override (cannot skip)
3. Manual entry only when "No" selected
4. Manual entry validation matches Screen 20 rules

### Technical Constraints
- Session path: `session.claim.rentDetails`
- Conditional reveal using GOV.UK pattern
- dailyAmount stores final confirmed value (Q3)
- dailyAmountConfirmed flag indicates if calculated or manual (Q3)

### Security Constraints
- Input sanitization for numeric fields
- No injection vulnerabilities in currency handling

---

## Assumptions

**A1 — Display format:**  
Calculated daily rent displayed in currency format with £ symbol (e.g., "£17.86").  
**Rationale:** Q1 clarification from Steve ("currency format")

**A2 — Manual entry validation:**  
Manual daily rent uses same validation as Screen 20 rent amount: numeric, positive, max 2 decimals, max £1,000,000.00.  
**Rationale:** Q2 clarification from Steve ("Yes")

**A3 — Session storage (Yes path):**  
When "Yes" selected: `dailyAmount = calculatedDailyAmount` and `dailyAmountConfirmed = true`.  
**Rationale:** Q3 clarification from Steve ("yes")

**A4 — Session storage (No path):**  
When "No" selected: `dailyAmount = manually entered value` and `dailyAmountConfirmed = false`.  
**Rationale:** Q3 clarification from Steve ("yes")

**A5 — Revisit pre-population:**  
Radio selection and manual entry value (if applicable) pre-populated when revisiting page.  
**Rationale:** Q4 clarification from Steve ("Yes should be prepopulated and yes")

**A6 — Conditional reveal on revisit:**  
If "No" was previously selected, manual entry field shown with previous value on page load.  
**Rationale:** Q4 clarification from Steve

**A7 — Next screen route:**  
After successful submission, redirect to `/claims/details-of-rent-arrears`.  
**Rationale:** Q5 clarification from Steve

**A8 — Placeholder route:**  
Create placeholder route for `/claims/details-of-rent-arrears`.  
**Rationale:** Q6 clarification from Steve ("Yes, create placeholder")

**A9 — Error message text:**  
- No selection: "Select whether the daily rent amount is correct"  
- Invalid manual entry: "Enter the daily rent amount as a number greater than 0"  
**Rationale:** AC-3 and AC-6 provide explicit error text

**A10 — Previous navigation:**  
Previous button returns to `/claims/rent-details` (Screen 20).  
**Rationale:** AC-10 specifies return to rent-details

---

## Ambiguities & Questions

✅ **Q1 — Display format:** RESOLVED — Currency format (£17.86)  
✅ **Q2 — Manual validation:** RESOLVED — Same as Screen 20  
✅ **Q3 — Session storage:** RESOLVED — Yes path and No path clarified  
✅ **Q4 — Revisit behavior:** RESOLVED — Pre-populate radio + manual field  
✅ **Q5 — Next route:** RESOLVED — /claims/details-of-rent-arrears  
✅ **Q6 — Placeholder needed:** RESOLVED — Yes, create placeholder

---

## Session State Structure

```javascript
session.claim.rentDetails = {
  amount: 125.00,                    // From Screen 20
  frequency: 'weekly',               // From Screen 20
  calculatedDailyAmount: 17.86,      // From Screen 20 calculation
  dailyAmount: 17.86,                // Confirmed value (calculated or manual)
  dailyAmountConfirmed: true         // true = confirmed, false = manually overridden
}
```

### Storage Logic
**"Yes" path:**
```javascript
dailyAmount = calculatedDailyAmount
dailyAmountConfirmed = true
```

**"No" path:**
```javascript
dailyAmount = parseFloat(manualEntry)
dailyAmountConfirmed = false
```

---

## Out of Scope

- ❌ Calculating total arrears
- ❌ Validating daily amount against legal thresholds
- ❌ Capturing arrears date ranges
- ❌ Recalculating based on frequency changes
- ❌ Explanations of how the calculation was derived

---

## Navigation Flow

```
Previous: /claims/rent-details (Screen 20)
  ↓
Current: /claims/daily-rent-amount (Screen 21)
  ↓
Next: /claims/details-of-rent-arrears (Screen 22 - placeholder)

Cancel: /case-list (draft preserved)
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Calculated amount not in session | Low | High | Test navigation chain, verify Screen 20 sets value |
| Conditional reveal not working | Low | Medium | Test with/without "No" selection |
| Manual entry validation bypass | Low | High | Test all validation rules thoroughly |
| Session data overwrite on revisit | Low | Medium | Test revisit scenarios with both paths |
| Currency display inconsistency | Medium | Low | Test format with various amounts |

---

**Status:** ✅ Ready for test plan creation  
**Next Step:** Create test plan, test matrix, and traceability table
