# Test Behaviour Matrix: Screen 21 — Daily Rent Amount

## AC-1 → Display calculated daily rent amount

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-1.1 | Page displays calculated amount | On daily rent page | Page loads | See calculated daily rent amount |
| T-1.2 | Amount formatted as currency | Calculated amount = 17.86 | View page | Display shows "£17.86" |
| T-1.3 | Explanation text present | On daily rent page | View page | See text explaining calculation source |
| T-1.4 | Amount from Screen 20 | calculatedDailyAmount in session | Page loads | Value matches Screen 20 calculation |

---

## AC-2 → Ask whether the daily rent amount is correct

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-2.1 | Question displayed | On daily rent page | View page | See "Is the amount per day that unpaid rent should be charged at correct?" |
| T-2.2 | Yes option present | Viewing radios | Inspect options | "Yes" radio exists |
| T-2.3 | No option present | Viewing radios | Inspect options | "No" radio exists |
| T-2.4 | Radio group structure | Viewing form | Inspect HTML | GOV.UK radios component rendered |

---

## AC-3 → Selection is required

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-3.1 | Required: No selection | No radio selected | Submit form | Error: "Select whether the daily rent amount is correct" |
| T-3.2 | Error summary displayed | No selection | Submit form | GOV.UK error summary shown |
| T-3.3 | Focus on error summary | Validation fails | Page re-renders | Focus moves to error summary |
| T-3.4 | Error link to radios | Error summary shown | Click error link | Focus moves to radio group |

---

## AC-4 → Yes path: accept calculated amount

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-4.1 | Yes accepted | Select "Yes" | Submit form | Validation passes (302 redirect) |
| T-4.2 | Store dailyAmountConfirmed | Select "Yes" | Submit | `dailyAmountConfirmed = true` |
| T-4.3 | Store dailyAmount (calculated) | Select "Yes" | Submit | `dailyAmount = calculatedDailyAmount` |
| T-4.4 | Redirect on Yes | Select "Yes" | Submit | Redirect to next screen |

---

## AC-5 → No path: show manual entry field

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-5.1 | Conditional initially hidden | Page loads (no selection) | View page | Manual entry field not visible |
| T-5.2 | Conditional revealed on No | Select "No" | View conditional | Manual entry field visible |
| T-5.3 | Field label correct | "No" selected | View field | Label: "Enter the correct daily rent amount" |
| T-5.4 | Field has currency prefix | "No" selected | View field | £ prefix on input |
| T-5.5 | Yes hides conditional | Select "No" then "Yes" | Toggle selection | Manual entry field hidden |

---

## AC-6 → Manual daily rent amount validation

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-6.1 | Required when No selected | "No" + empty field | Submit | Error: "Enter the daily rent amount as a number greater than 0" |
| T-6.2 | Non-numeric rejected | "No" + "abc" | Submit | Error message shown |
| T-6.3 | Zero rejected | "No" + "0" | Submit | Error message shown |
| T-6.4 | Negative rejected | "No" + "-10" | Submit | Error message shown |
| T-6.5 | Valid amount accepted | "No" + "17.85" | Submit | Validation passes |
| T-6.6 | Decimal 2dp accepted | "No" + "125.50" | Submit | Accepted |
| T-6.7 | Decimal 3dp rejected | "No" + "125.567" | Submit | Error message shown |
| T-6.8 | Minimum valid | "No" + "0.01" | Submit | Accepted |
| T-6.9 | Maximum valid | "No" + "1000000.00" | Submit | Accepted |
| T-6.10 | Over maximum rejected | "No" + "1000000.01" | Submit | Error message shown |
| T-6.11 | Currency symbol rejected | "No" + "£125" | Submit | Error message shown |
| T-6.12 | Error summary on validation | "No" + invalid | Submit | GOV.UK error summary displayed |

---

## AC-7 → Accept manually entered daily rent amount

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-7.1 | Store dailyAmountConfirmed false | "No" + valid amount | Submit | `dailyAmountConfirmed = false` |
| T-7.2 | Store manual dailyAmount | "No" + "20.00" | Submit | `dailyAmount = 20.00` |
| T-7.3 | Override calculated amount | "No" + manual value | Submit | `dailyAmount ≠ calculatedDailyAmount` |
| T-7.4 | Redirect on manual entry | "No" + valid amount | Submit | Redirect to next screen |

---

## AC-8 → Persist daily rent amount

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-8.1 | Session structure (Yes) | "Yes" path | Submit | `rentDetails` has dailyAmount + dailyAmountConfirmed |
| T-8.2 | Session structure (No) | "No" path | Submit | `rentDetails` has dailyAmount + dailyAmountConfirmed |
| T-8.3 | calculatedDailyAmount preserved | Either path | Submit | Original calculated value not overwritten |
| T-8.4 | dailyAmount type number | Either path | Submit | Stored as Number type |

---

## AC-9 → Continue route (implicit from AC-4 & AC-7)

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-9.1 | Redirect on success (Yes) | "Yes" selected | Submit | Redirect to `/claims/details-of-rent-arrears` |
| T-9.2 | Redirect on success (No) | "No" + valid amount | Submit | Redirect to `/claims/details-of-rent-arrears` |
| T-9.3 | Placeholder route exists | Submit valid form | Follow redirect | Placeholder page renders (200) |

---

## AC-10 → Previous navigation

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-10.1 | Previous button exists | On daily rent page | View page | "Previous" link present |
| T-10.2 | Previous → rent details | On daily rent page | Click Previous | Navigate to `/claims/rent-details` |
| T-10.3 | Data preserved on previous | Select option | Click Previous → return | Selection preserved in session |

---

## AC-11 → Cancel behaviour

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-11.1 | Cancel button exists | On daily rent page | View page | "Cancel" link present |
| T-11.2 | Cancel → case list | On daily rent page | Click Cancel | Navigate to `/case-list` |
| T-11.3 | Draft preserved on cancel | Select option | Click Cancel | Session data retained |

---

## AC-12 → Accessibility compliance

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-12.1 | Error summary focus | Validation errors | Page re-renders | Error summary has `tabindex="-1"` |
| T-12.2 | Error summary links | Errors present | View summary | Links have `href` to fields |
| T-12.3 | Radio error link | Radio validation fails | Click error link | Links to radio group |
| T-12.4 | Manual entry error link | Manual entry fails | Click error link | Links to manual entry field |
| T-12.5 | Labels present | View form | Inspect HTML | All inputs have labels |
| T-12.6 | Keyboard accessible | View form | Tab through | All controls keyboard accessible |

---

## Revisit & Pre-population Tests

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-R.1 | Pre-populate Yes | Submit with "Yes" → revisit | GET page | "Yes" radio checked |
| T-R.2 | Pre-populate No | Submit with "No" → revisit | GET page | "No" radio checked |
| T-R.3 | Show conditional on revisit | Submit with "No" → revisit | GET page | Manual entry field visible |
| T-R.4 | Pre-populate manual value | Submit with "No" + 20.00 → revisit | GET page | Manual field contains "20.00" |
| T-R.5 | Hide conditional on Yes revisit | Submit with "Yes" → revisit | GET page | Manual entry field hidden |
| T-R.6 | Change from Yes to No | Submit "Yes" → revisit → select "No" | Re-submit with value | New manual value stored |
| T-R.7 | Change from No to Yes | Submit "No" → revisit → select "Yes" | Re-submit | Reverts to calculated value |
| T-R.8 | Update manual value | Submit "No" + 20 → revisit → change to 25 | Re-submit | New value stored |

---

## Edge Cases

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-E.1 | Multiple errors | "No" + no value + (other error if possible) | Submit | Both errors shown |
| T-E.2 | Values preserved on error | "No" + invalid value | Submit → error | "No" still selected, value preserved |
| T-E.3 | Whole number accepted | "No" + "125" | Submit | Accepted (treated as 125.00) |
| T-E.4 | Single decimal accepted | "No" + "125.5" | Submit | Accepted (treated as 125.50) |
| T-E.5 | Very small amount | "No" + "0.01" | Submit | Accepted |
| T-E.6 | Very large amount | "No" + "999999.99" | Submit | Accepted |
| T-E.7 | Calculated amount with many decimals | calculatedDailyAmount = 17.857142... | View page | Displays as £17.86 (rounded) |

---

## Total Tests by Category

- **Display:** 4 tests (T-1.x)
- **Radio question:** 4 tests (T-2.x)
- **Radio validation:** 4 tests (T-3.x)
- **Yes path:** 4 tests (T-4.x)
- **Conditional reveal:** 5 tests (T-5.x)
- **Manual entry validation:** 12 tests (T-6.x)
- **Manual entry acceptance:** 4 tests (T-7.x)
- **Session persistence:** 4 tests (T-8.x)
- **Routing:** 3 tests (T-9.x)
- **Previous navigation:** 3 tests (T-10.x)
- **Cancel:** 3 tests (T-11.x)
- **Accessibility:** 6 tests (T-12.x)
- **Revisit/Pre-population:** 8 tests (T-R.x)
- **Edge cases:** 7 tests (T-E.x)

**Total: 71 tests**

---

**Status:** ✅ Test matrix complete  
**Next:** Create traceability table mapping tests to acceptance criteria
