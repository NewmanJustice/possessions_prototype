# Test Behaviour Matrix: Screen 20 — Rent Details

## AC-1 → Display rent amount input

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-1.1 | Page displays rent amount input | On /claims/rent-details | Page loads | See question "How much is the rent?" |
| T-1.2 | Input has currency prefix | On rent details page | View amount input | Input has £ prefix |
| T-1.3 | Input accepts numeric values | On rent details page | Enter amount | Value accepted |

---

## AC-2 → Rent amount is required and numeric

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-2.1 | Required: Empty amount | No rent amount entered | Click Continue | Error: "Enter the rent amount as a number greater than 0" |
| T-2.2 | Required: Error summary | No rent amount entered | Submit form | GOV.UK error summary displayed |
| T-2.3 | Required: Focus management | Validation error | Page re-renders | Focus on error summary |
| T-2.4 | Required: Error link | Error summary shown | Click error link | Focus moves to amount input |
| T-2.5 | Numeric: Non-numeric input | Enter "abc" | Submit | Error: "Enter the rent amount as a number greater than 0" |
| T-2.6 | Numeric: Currency symbol | Enter "£125" | Submit | Error (or strip £ and accept?) |
| T-2.7 | Numeric: Zero value | Enter "0" | Submit | Error: "Enter the rent amount as a number greater than 0" |
| T-2.8 | Numeric: Negative value | Enter "-125" | Submit | Error: "Enter the rent amount as a number greater than 0" |
| T-2.9 | Numeric: Decimal limit (valid) | Enter "125.50" | Submit | Accepted (2 decimals OK) |
| T-2.10 | Numeric: Decimal limit (invalid) | Enter "125.567" | Submit | Error: "Enter the rent amount as a number greater than 0" |
| T-2.11 | Boundary: Minimum valid | Enter "0.01" | Submit | Accepted |
| T-2.12 | Boundary: Maximum valid | Enter "1000000.00" | Submit | Accepted |
| T-2.13 | Boundary: Over maximum | Enter "1000000.01" | Submit | Error: "Enter the rent amount as a number greater than 0" |
| T-2.14 | Inline error displayed | Validation fails | View form | Inline error on amount field |

---

## AC-3 → Display rent frequency options

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-3.1 | Frequency question displayed | On rent details page | Page loads | See "How frequently should rent be paid?" |
| T-3.2 | Weekly option present | Viewing frequency radios | Inspect options | "Weekly" radio exists |
| T-3.3 | Fortnightly option present | Viewing frequency radios | Inspect options | "Fortnightly" radio exists |
| T-3.4 | Monthly option present | Viewing frequency radios | Inspect options | "Monthly" radio exists |
| T-3.5 | Other option present | Viewing frequency radios | Inspect options | "Other" radio exists |
| T-3.6 | Radio group structure | Viewing form | Inspect HTML | GOV.UK radios component rendered |

---

## AC-4 → Frequency selection is required

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-4.1 | Required: No selection | No frequency selected | Click Continue | Error: "Select how often rent should be paid" |
| T-4.2 | Required: Error summary | No frequency selected | Submit form | GOV.UK error summary displayed |
| T-4.3 | Required: Focus management | Frequency validation error | Page re-renders | Focus on error summary |
| T-4.4 | Required: Error link | Error summary shown | Click frequency error link | Focus moves to frequency radios |
| T-4.5 | Inline error displayed | Frequency validation fails | View form | Inline error on frequency field |

---

## AC-5 → Preserve inputs on validation failure

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-5.1 | Preserve amount on error | Enter "125" only (no frequency) | Submit → error | Amount "125" still populated |
| T-5.2 | Preserve frequency on error | Select "weekly" only (no amount) | Submit → error | "Weekly" still selected |
| T-5.3 | Preserve both on multi-error | Enter invalid amount + no frequency | Submit → errors | Both values preserved |
| T-5.4 | Preserve on amount format error | Enter "125.567" (3 decimals) | Submit → error | "125.567" still shown |

---

## AC-6 → Persist rent details

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-6.1 | Store amount | Enter valid amount + frequency | Submit | `session.claim.rentDetails.amount` set |
| T-6.2 | Store frequency | Enter valid amount + frequency | Submit | `session.claim.rentDetails.frequency` set |
| T-6.3 | Amount stored as number | Enter "125.50" | Submit | Stored as 125.50 (number, not string) |
| T-6.4 | Frequency stored as lowercase | Select "Weekly" | Submit | Stored as "weekly" |
| T-6.5 | Session structure correct | Submit valid form | Check session | `rentDetails` has `{amount, frequency, calculatedDailyAmount}` |

---

## AC-7 → Auto-calculate daily rent amount

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-7.1 | Weekly calculation | Amount: 700, Frequency: weekly | Submit | `calculatedDailyAmount = 100.00` (700 ÷ 7) |
| T-7.2 | Fortnightly calculation | Amount: 750, Frequency: fortnightly | Submit | `calculatedDailyAmount = 53.57` (750 ÷ 14) |
| T-7.3 | Monthly calculation | Amount: 1500, Frequency: monthly | Submit | `calculatedDailyAmount = 493.15` (1500 ÷ 365 × 12) |
| T-7.4 | Calculation rounding (weekly) | Amount: 125, Frequency: weekly | Submit | `calculatedDailyAmount = 17.86` (125 ÷ 7 = 17.857...) |
| T-7.5 | Calculation rounding (fortnightly) | Amount: 125, Frequency: fortnightly | Submit | `calculatedDailyAmount = 8.93` (125 ÷ 14 = 8.928...) |
| T-7.6 | Calculation rounding (monthly) | Amount: 125, Frequency: monthly | Submit | `calculatedDailyAmount = 41.10` (125 ÷ 365 × 12 = 41.095...) |
| T-7.7 | Precision: 2 decimal places | Any standard frequency | Submit | `calculatedDailyAmount` has max 2 decimals |
| T-7.8 | Other frequency: No calculation | Amount: 125, Frequency: other | Submit | `calculatedDailyAmount = null` |

---

## AC-8 → Navigate to daily rent confirmation

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-8.1 | Weekly → daily rent amount | Amount + weekly | Submit | Redirect to `/claims/daily-rent-amount` |
| T-8.2 | Fortnightly → daily rent amount | Amount + fortnightly | Submit | Redirect to `/claims/daily-rent-amount` |
| T-8.3 | Monthly → daily rent amount | Amount + monthly | Submit | Redirect to `/claims/daily-rent-amount` |
| T-8.4 | Placeholder route exists | Navigate to daily-rent-amount | GET request | Placeholder page renders |

---

## AC-9 → Other frequency routes to rent arrears details

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-9.1 | Other → rent arrears details | Amount + other | Submit | Redirect to `/claims/details-of-rent-arrears` |
| T-9.2 | Placeholder route exists | Navigate to arrears details | GET request | Placeholder page renders |

---

## AC-10 → Previous navigation

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-10.1 | Previous button exists | On rent details page | View page | "Previous" link present |
| T-10.2 | Previous → notice details | On rent details | Click Previous | Navigate to `/claims/notice-details` |
| T-10.3 | Data preserved on previous | Enter amount + frequency | Click Previous → return | Data still in session |

---

## AC-11 → Cancel behaviour

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-11.1 | Cancel button exists | On rent details page | View page | "Cancel" link present |
| T-11.2 | Cancel → case list | On rent details | Click Cancel | Navigate to `/case-list` |
| T-11.3 | Draft preserved on cancel | Enter data | Click Cancel | Session data retained |

---

## AC-12 → Accessibility compliance

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-12.1 | Error summary focus | Validation errors | Page renders | Error summary has `tabindex="-1"` |
| T-12.2 | Error summary links | Errors present | View summary | Links have `href` to fields |
| T-12.3 | Amount error link target | Amount validation fails | Click error link | Links to `#amount` or amount input |
| T-12.4 | Frequency error link target | Frequency validation fails | Click error link | Links to frequency radio group |
| T-12.5 | Input labels present | View form | Inspect fields | All inputs have associated labels |
| T-12.6 | Keyboard accessible | View form | Tab through | All controls keyboard accessible |
| T-12.7 | ARIA attributes | Errors present | Inspect HTML | Error messages linked via `aria-describedby` |

---

## Edge Cases & Additional Tests

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-E.1 | Multiple errors displayed | No amount + no frequency | Submit | Both errors in summary |
| T-E.2 | Multiple errors (amount + frequency) | Invalid amount + no frequency | Submit | Both errors shown separately |
| T-E.3 | Re-populate on page revisit | Submit valid form → navigate away → return | Revisit /claims/rent-details | Previously entered data shown |
| T-E.4 | Update calculation on frequency change | Submit weekly → return → change to monthly | Re-submit | Calculation updates correctly |
| T-E.5 | Decimal with trailing zeros | Enter "125.50" | Submit | Stored as 125.5 or 125.50? |
| T-E.6 | Whole number in decimal field | Enter "125" | Submit | Accepted (treated as 125.00) |
| T-E.7 | Single decimal place | Enter "125.5" | Submit | Accepted (treated as 125.50) |

---

## Total Tests by Category

- **Display:** 9 tests (T-1.x, T-3.x)
- **Validation (amount):** 14 tests (T-2.x)
- **Validation (frequency):** 5 tests (T-4.x)
- **Persistence (input):** 4 tests (T-5.x)
- **Persistence (session):** 5 tests (T-6.x)
- **Calculation:** 8 tests (T-7.x)
- **Routing (standard):** 4 tests (T-8.x)
- **Routing (other):** 2 tests (T-9.x)
- **Navigation (previous):** 3 tests (T-10.x)
- **Navigation (cancel):** 3 tests (T-11.x)
- **Accessibility:** 7 tests (T-12.x)
- **Edge cases:** 7 tests (T-E.x)

**Total: 71 tests**

---

**Status:** ✅ Test matrix complete  
**Next:** Create traceability table mapping tests to acceptance criteria
