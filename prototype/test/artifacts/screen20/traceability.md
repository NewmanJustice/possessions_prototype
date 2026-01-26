# Traceability Table: Screen 20 — Rent Details

## Acceptance Criteria → Test Coverage

| AC | Description | Test IDs | Coverage | Notes |
|----|-------------|----------|----------|-------|
| **AC-1** | Display rent amount input | T-1.1, T-1.2, T-1.3 | ✅ Complete | Question text, £ prefix, numeric input |
| **AC-2** | Rent amount validation | T-2.1 to T-2.14 | ✅ Complete | Required, numeric, positive, decimals, max £1M |
| **AC-3** | Display frequency options | T-3.1 to T-3.6 | ✅ Complete | All 4 radio options, GOV.UK component |
| **AC-4** | Frequency selection required | T-4.1 to T-4.5 | ✅ Complete | Required validation, error patterns |
| **AC-5** | Preserve inputs on error | T-5.1 to T-5.4 | ✅ Complete | Amount, frequency, both preserved |
| **AC-6** | Persist rent details | T-6.1 to T-6.5 | ✅ Complete | Session structure, types, values |
| **AC-7** | Auto-calculate daily rent | T-7.1 to T-7.8 | ✅ Complete | Weekly/fortnightly/monthly formulas, rounding |
| **AC-8** | Navigate to daily rent page | T-8.1 to T-8.4 | ✅ Complete | Standard frequencies → daily-rent-amount |
| **AC-9** | Other frequency routing | T-9.1, T-9.2 | ✅ Complete | Other → details-of-rent-arrears |
| **AC-10** | Previous navigation | T-10.1 to T-10.3 | ✅ Complete | Button, target, data preservation |
| **AC-11** | Cancel behaviour | T-11.1 to T-11.3 | ✅ Complete | Button, target, draft retention |
| **AC-12** | Accessibility compliance | T-12.1 to T-12.7 | ✅ Complete | Error focus, links, labels, ARIA |

---

## Test Categories → Acceptance Criteria

### Display Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-1.1 | AC-1 | Rent amount question displayed |
| T-1.2 | AC-1 | Currency prefix (£) present |
| T-1.3 | AC-1 | Input accepts numeric values |
| T-3.1 | AC-3 | Frequency question displayed |
| T-3.2 | AC-3 | Weekly option present |
| T-3.3 | AC-3 | Fortnightly option present |
| T-3.4 | AC-3 | Monthly option present |
| T-3.5 | AC-3 | Other option present |
| T-3.6 | AC-3 | GOV.UK radios component |

**Coverage:** AC-1, AC-3 fully covered

---

### Validation Tests (Amount)
| Test ID | AC | Description |
|---------|-----|-------------|
| T-2.1 | AC-2 | Empty amount triggers error |
| T-2.2 | AC-2 | Error summary displayed |
| T-2.3 | AC-2 | Focus moves to error summary |
| T-2.4 | AC-2 | Error link navigates to field |
| T-2.5 | AC-2 | Non-numeric input rejected |
| T-2.6 | AC-2 | Currency symbol rejected |
| T-2.7 | AC-2 | Zero value rejected |
| T-2.8 | AC-2 | Negative value rejected |
| T-2.9 | AC-2 | Valid 2 decimals accepted |
| T-2.10 | AC-2 | 3+ decimals rejected |
| T-2.11 | AC-2 | Minimum valid (£0.01) |
| T-2.12 | AC-2 | Maximum valid (£1M) |
| T-2.13 | AC-2 | Over maximum rejected |
| T-2.14 | AC-2 | Inline error displayed |

**Coverage:** AC-2 fully covered (14 tests)

---

### Validation Tests (Frequency)
| Test ID | AC | Description |
|---------|-----|-------------|
| T-4.1 | AC-4 | No selection triggers error |
| T-4.2 | AC-4 | Error summary displayed |
| T-4.3 | AC-4 | Focus moves to error summary |
| T-4.4 | AC-4 | Error link navigates to radios |
| T-4.5 | AC-4 | Inline error displayed |

**Coverage:** AC-4 fully covered

---

### Input Preservation Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-5.1 | AC-5 | Amount preserved on error |
| T-5.2 | AC-5 | Frequency preserved on error |
| T-5.3 | AC-5 | Both preserved on multi-error |
| T-5.4 | AC-5 | Invalid values preserved for correction |

**Coverage:** AC-5 fully covered

---

### Session Persistence Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-6.1 | AC-6 | Amount stored in session |
| T-6.2 | AC-6 | Frequency stored in session |
| T-6.3 | AC-6 | Amount type is number |
| T-6.4 | AC-6 | Frequency stored as lowercase |
| T-6.5 | AC-6 | Session structure validated |

**Coverage:** AC-6 fully covered

---

### Calculation Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-7.1 | AC-7 | Weekly: amount ÷ 7 |
| T-7.2 | AC-7 | Fortnightly: amount ÷ 14 |
| T-7.3 | AC-7 | Monthly: amount ÷ 365 × 12 |
| T-7.4 | AC-7 | Weekly rounding (125 → 17.86) |
| T-7.5 | AC-7 | Fortnightly rounding (125 → 8.93) |
| T-7.6 | AC-7 | Monthly rounding (125 → 41.10) |
| T-7.7 | AC-7 | Precision: 2 decimal places |
| T-7.8 | AC-7 | Other: null (no calculation) |

**Coverage:** AC-7 fully covered (8 tests)

---

### Routing Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-8.1 | AC-8 | Weekly → daily-rent-amount |
| T-8.2 | AC-8 | Fortnightly → daily-rent-amount |
| T-8.3 | AC-8 | Monthly → daily-rent-amount |
| T-8.4 | AC-8 | Placeholder route exists |
| T-9.1 | AC-9 | Other → details-of-rent-arrears |
| T-9.2 | AC-9 | Placeholder route exists |

**Coverage:** AC-8, AC-9 fully covered

---

### Navigation Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-10.1 | AC-10 | Previous button present |
| T-10.2 | AC-10 | Previous → /claims/notice-details |
| T-10.3 | AC-10 | Data preserved on previous |
| T-11.1 | AC-11 | Cancel button present |
| T-11.2 | AC-11 | Cancel → /case-list |
| T-11.3 | AC-11 | Draft preserved on cancel |

**Coverage:** AC-10, AC-11 fully covered

---

### Accessibility Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-12.1 | AC-12 | Error summary has tabindex="-1" |
| T-12.2 | AC-12 | Error summary has links |
| T-12.3 | AC-12 | Amount error link target correct |
| T-12.4 | AC-12 | Frequency error link target correct |
| T-12.5 | AC-12 | Input labels present |
| T-12.6 | AC-12 | Keyboard accessible |
| T-12.7 | AC-12 | ARIA attributes correct |

**Coverage:** AC-12 fully covered

---

### Edge Case Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-E.1 | AC-2, AC-4 | Multiple errors displayed |
| T-E.2 | AC-2, AC-4 | Multiple distinct errors |
| T-E.3 | AC-5, AC-6 | Re-populate on revisit |
| T-E.4 | AC-6, AC-7 | Calculation updates on change |
| T-E.5 | AC-2, AC-6 | Trailing zeros handling |
| T-E.6 | AC-2, AC-6 | Whole numbers accepted |
| T-E.7 | AC-2, AC-6 | Single decimal accepted |

**Coverage:** Cross-cutting validation

---

## Coverage Summary

| Category | Test Count | ACs Covered | Status |
|----------|-----------|-------------|---------|
| Display | 9 | AC-1, AC-3 | ✅ Complete |
| Validation (amount) | 14 | AC-2 | ✅ Complete |
| Validation (frequency) | 5 | AC-4 | ✅ Complete |
| Input preservation | 4 | AC-5 | ✅ Complete |
| Session persistence | 5 | AC-6 | ✅ Complete |
| Calculation | 8 | AC-7 | ✅ Complete |
| Routing (standard) | 4 | AC-8 | ✅ Complete |
| Routing (other) | 2 | AC-9 | ✅ Complete |
| Navigation (previous) | 3 | AC-10 | ✅ Complete |
| Navigation (cancel) | 3 | AC-11 | ✅ Complete |
| Accessibility | 7 | AC-12 | ✅ Complete |
| Edge cases | 7 | Multiple | ✅ Complete |
| **TOTAL** | **71** | **12/12** | ✅ **100%** |

---

## Uncovered Scenarios

❌ **None** — All acceptance criteria have comprehensive test coverage.

---

## Test Priorities

### P1 - Critical (Must Pass)
- All validation tests (T-2.x, T-4.x)
- All calculation tests (T-7.x)
- All routing tests (T-8.x, T-9.x)
- Session persistence (T-6.x)

### P2 - High (Should Pass)
- Display tests (T-1.x, T-3.x)
- Error handling (T-2.2, T-2.3, T-4.2, T-4.3)
- Input preservation (T-5.x)
- Accessibility (T-12.x)

### P3 - Medium (Important)
- Navigation (T-10.x, T-11.x)
- Edge cases (T-E.x)

---

## Questions & Assumptions

### Resolved via Clarifications
✅ **Q1 — Decimal precision:** Max 2 decimal places  
✅ **Q2 — Maximum amount:** £1,000,000.00 limit  
✅ **Q3 — Calculation rounding:** 2 decimal places  
✅ **Q4 — Other frequency:** Set to null  
✅ **Q5 — Placeholder routes:** Create both  

### Testing Assumptions
- **A1:** Error messages match AC text exactly
- **A2:** Calculation uses standard rounding (0.5 rounds up)
- **A3:** £ symbol is visual prefix, not part of value
- **A4:** Session initialized via navigation helper chain
- **A5:** Placeholder routes return 200 status with basic HTML

---

## Implementation Notes for Developer

### Key Validation Rules
```javascript
// Rent amount validation
- Required: value must exist
- Numeric: parseFloat() succeeds
- Positive: value > 0
- Max amount: value <= 1000000
- Max decimals: /^\d+(\.\d{1,2})?$/.test(value)
```

### Calculation Formulas
```javascript
// Standard frequencies
weekly: (amount / 7).toFixed(2)
fortnightly: (amount / 14).toFixed(2)
monthly: (amount / 365 * 12).toFixed(2)
other: null
```

### Session Structure
```javascript
session.claim.rentDetails = {
  amount: Number,      // 2 decimals max
  frequency: String,   // 'weekly' | 'fortnightly' | 'monthly' | 'other'
  calculatedDailyAmount: Number | null  // 2 decimals or null
}
```

### Routing Logic
```javascript
if (frequency === 'weekly' || frequency === 'fortnightly' || frequency === 'monthly') {
  redirect('/claims/daily-rent-amount')
} else if (frequency === 'other') {
  redirect('/claims/details-of-rent-arrears')
}
```

---

**Status:** ✅ Traceability complete  
**Coverage:** 71 tests covering 12 acceptance criteria  
**Next:** Create executable test file
