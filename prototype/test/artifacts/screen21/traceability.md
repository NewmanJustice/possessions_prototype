# Traceability Table: Screen 21 — Daily Rent Amount

## Acceptance Criteria → Test Coverage

| AC | Description | Test IDs | Coverage | Notes |
|----|-------------|----------|----------|-------|
| **AC-1** | Display calculated daily rent | T-1.1 to T-1.4 | ✅ Complete | Amount display, currency format, explanation |
| **AC-2** | Ask confirmation question | T-2.1 to T-2.4 | ✅ Complete | Yes/No radios, question text |
| **AC-3** | Selection required | T-3.1 to T-3.4 | ✅ Complete | Validation, error summary, focus |
| **AC-4** | Yes path acceptance | T-4.1 to T-4.4 | ✅ Complete | Confirmation flag, dailyAmount storage |
| **AC-5** | No path reveal field | T-5.1 to T-5.5 | ✅ Complete | Conditional reveal behavior |
| **AC-6** | Manual entry validation | T-6.1 to T-6.12 | ✅ Complete | All validation rules (same as Screen 20) |
| **AC-7** | Manual entry acceptance | T-7.1 to T-7.4 | ✅ Complete | Override flag, manual value storage |
| **AC-8** | Persist daily rent | T-8.1 to T-8.4 | ✅ Complete | Session structure, types |
| **AC-9** | Continue route | T-9.1 to T-9.3 | ✅ Complete | Redirect to details-of-rent-arrears |
| **AC-10** | Previous navigation | T-10.1 to T-10.3 | ✅ Complete | Button, target, preservation |
| **AC-11** | Cancel behaviour | T-11.1 to T-11.3 | ✅ Complete | Button, target, draft retention |
| **AC-12** | Accessibility | T-12.1 to T-12.6 | ✅ Complete | Error focus, links, labels, keyboard |

---

## Test Categories → Acceptance Criteria

### Display Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-1.1 | AC-1 | Calculated amount displayed |
| T-1.2 | AC-1 | Currency format (£17.86) |
| T-1.3 | AC-1 | Explanation text present |
| T-1.4 | AC-1 | Value from Screen 20 |

**Coverage:** AC-1 fully covered

---

### Radio Question Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-2.1 | AC-2 | Confirmation question displayed |
| T-2.2 | AC-2 | "Yes" option present |
| T-2.3 | AC-2 | "No" option present |
| T-2.4 | AC-2 | GOV.UK radios component |

**Coverage:** AC-2 fully covered

---

### Radio Validation Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-3.1 | AC-3 | No selection → error |
| T-3.2 | AC-3 | Error summary displayed |
| T-3.3 | AC-3 | Focus on error summary |
| T-3.4 | AC-3 | Error link to radios |

**Coverage:** AC-3 fully covered

---

### Yes Path Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-4.1 | AC-4 | "Yes" accepted |
| T-4.2 | AC-4 | dailyAmountConfirmed = true |
| T-4.3 | AC-4 | dailyAmount = calculatedDailyAmount |
| T-4.4 | AC-4 | Redirect to next screen |

**Coverage:** AC-4 fully covered

---

### Conditional Reveal Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-5.1 | AC-5 | Field initially hidden |
| T-5.2 | AC-5 | Field revealed when "No" selected |
| T-5.3 | AC-5 | Correct field label |
| T-5.4 | AC-5 | Currency prefix (£) |
| T-5.5 | AC-5 | Field hidden when "Yes" selected |

**Coverage:** AC-5 fully covered

---

### Manual Entry Validation Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-6.1 | AC-6 | Empty field → error |
| T-6.2 | AC-6 | Non-numeric → error |
| T-6.3 | AC-6 | Zero → error |
| T-6.4 | AC-6 | Negative → error |
| T-6.5 | AC-6 | Valid amount accepted |
| T-6.6 | AC-6 | 2 decimals accepted |
| T-6.7 | AC-6 | 3+ decimals → error |
| T-6.8 | AC-6 | Minimum (0.01) accepted |
| T-6.9 | AC-6 | Maximum (£1M) accepted |
| T-6.10 | AC-6 | Over maximum → error |
| T-6.11 | AC-6 | Currency symbol → error |
| T-6.12 | AC-6 | Error summary displayed |

**Coverage:** AC-6 fully covered (12 tests)

---

### Manual Entry Acceptance Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-7.1 | AC-7 | dailyAmountConfirmed = false |
| T-7.2 | AC-7 | dailyAmount = manual entry |
| T-7.3 | AC-7 | Overrides calculated amount |
| T-7.4 | AC-7 | Redirect to next screen |

**Coverage:** AC-7 fully covered

---

### Session Persistence Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-8.1 | AC-8 | Session structure (Yes path) |
| T-8.2 | AC-8 | Session structure (No path) |
| T-8.3 | AC-8 | calculatedDailyAmount preserved |
| T-8.4 | AC-8 | dailyAmount stored as Number |

**Coverage:** AC-8 fully covered

---

### Routing Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-9.1 | AC-9 | Redirect on "Yes" |
| T-9.2 | AC-9 | Redirect on "No" + valid |
| T-9.3 | AC-9 | Placeholder route exists |

**Coverage:** AC-9 fully covered (implicit from AC-4 & AC-7)

---

### Navigation Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-10.1 | AC-10 | Previous button present |
| T-10.2 | AC-10 | Previous → /claims/rent-details |
| T-10.3 | AC-10 | Data preserved |
| T-11.1 | AC-11 | Cancel button present |
| T-11.2 | AC-11 | Cancel → /case-list |
| T-11.3 | AC-11 | Draft preserved |

**Coverage:** AC-10, AC-11 fully covered

---

### Accessibility Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-12.1 | AC-12 | Error summary tabindex="-1" |
| T-12.2 | AC-12 | Error summary has links |
| T-12.3 | AC-12 | Radio error link target |
| T-12.4 | AC-12 | Manual entry error link target |
| T-12.5 | AC-12 | Input labels present |
| T-12.6 | AC-12 | Keyboard accessible |

**Coverage:** AC-12 fully covered

---

### Revisit & Pre-population Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-R.1 | AC-4, AC-8 | "Yes" pre-populated |
| T-R.2 | AC-5, AC-7, AC-8 | "No" pre-populated |
| T-R.3 | AC-5 | Conditional shown on revisit |
| T-R.4 | AC-7, AC-8 | Manual value pre-populated |
| T-R.5 | AC-5 | Conditional hidden on "Yes" revisit |
| T-R.6 | AC-7, AC-8 | Change from Yes to No |
| T-R.7 | AC-4, AC-8 | Change from No to Yes |
| T-R.8 | AC-7, AC-8 | Update manual value |

**Coverage:** Cross-cutting (revisit behavior clarified in Q4)

---

### Edge Case Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-E.1 | AC-3, AC-6 | Multiple errors |
| T-E.2 | AC-5, AC-6 | Values preserved on error |
| T-E.3 | AC-6 | Whole number accepted |
| T-E.4 | AC-6 | Single decimal accepted |
| T-E.5 | AC-6 | Very small amount |
| T-E.6 | AC-6 | Very large amount |
| T-E.7 | AC-1 | Calculated amount display rounding |

**Coverage:** Edge cases and boundary conditions

---

## Coverage Summary

| Category | Test Count | ACs Covered | Status |
|----------|-----------|-------------|---------|
| Display | 4 | AC-1 | ✅ Complete |
| Radio question | 4 | AC-2 | ✅ Complete |
| Radio validation | 4 | AC-3 | ✅ Complete |
| Yes path | 4 | AC-4 | ✅ Complete |
| Conditional reveal | 5 | AC-5 | ✅ Complete |
| Manual validation | 12 | AC-6 | ✅ Complete |
| Manual acceptance | 4 | AC-7 | ✅ Complete |
| Session persistence | 4 | AC-8 | ✅ Complete |
| Routing | 3 | AC-9 | ✅ Complete |
| Navigation (previous) | 3 | AC-10 | ✅ Complete |
| Navigation (cancel) | 3 | AC-11 | ✅ Complete |
| Accessibility | 6 | AC-12 | ✅ Complete |
| Revisit | 8 | Multiple | ✅ Complete |
| Edge cases | 7 | Multiple | ✅ Complete |
| **TOTAL** | **71** | **12/12** | ✅ **100%** |

---

## Uncovered Scenarios

❌ **None** — All acceptance criteria have comprehensive test coverage.

---

## Test Priorities

### P1 - Critical (Must Pass)
- All validation tests (T-3.x, T-6.x)
- Session storage (T-4.x, T-7.x, T-8.x)
- Conditional reveal (T-5.x)
- Routing (T-9.x)

### P2 - High (Should Pass)
- Display tests (T-1.x, T-2.x)
- Error handling (T-3.2, T-6.12)
- Accessibility (T-12.x)
- Revisit behavior (T-R.x)

### P3 - Medium (Important)
- Navigation (T-10.x, T-11.x)
- Edge cases (T-E.x)

---

## Questions & Assumptions

### Resolved via Clarifications
✅ **Q1 — Display format:** Currency format (£17.86)  
✅ **Q2 — Manual validation:** Same as Screen 20  
✅ **Q3 — Session storage:** Yes/No paths clarified  
✅ **Q4 — Revisit behavior:** Pre-populate radio + manual field  
✅ **Q5 — Next route:** /claims/details-of-rent-arrears  
✅ **Q6 — Placeholder:** Create placeholder route

### Testing Assumptions
- **A1:** Error messages match AC text exactly
- **A2:** Conditional reveal uses GOV.UK `govuk-radios__conditional` pattern
- **A3:** calculatedDailyAmount always present from Screen 20
- **A4:** Session initialized via navigation helper chain
- **A5:** Placeholder route returns 200 status

---

## Implementation Notes for Developer

### Session Structure
```javascript
session.claim.rentDetails = {
  amount: 125.00,                  // From Screen 20
  frequency: 'weekly',             // From Screen 20
  calculatedDailyAmount: 17.86,    // From Screen 20
  dailyAmount: 17.86,              // Confirmed value (Yes) or manual (No)
  dailyAmountConfirmed: true       // true = Yes, false = No
}
```

### Validation Rules (Manual Entry)
```javascript
// Reuse Screen 20 validation logic
function validateManualDailyAmount(amount) {
  if (!amount || amount.trim() === '') {
    return 'Enter the daily rent amount as a number greater than 0';
  }
  
  const numValue = parseFloat(amount);
  if (isNaN(numValue) || numValue <= 0 || numValue > 1000000) {
    return 'Enter the daily rent amount as a number greater than 0';
  }
  
  if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
    return 'Enter the daily rent amount as a number greater than 0';
  }
  
  return null;
}
```

### Conditional Logic
```javascript
// Yes path
if (confirmation === 'yes') {
  req.session.claim.rentDetails.dailyAmount = 
    req.session.claim.rentDetails.calculatedDailyAmount;
  req.session.claim.rentDetails.dailyAmountConfirmed = true;
}

// No path
if (confirmation === 'no') {
  req.session.claim.rentDetails.dailyAmount = parseFloat(manualAmount);
  req.session.claim.rentDetails.dailyAmountConfirmed = false;
}
```

### Routing
```javascript
// After successful validation
res.redirect('/claims/details-of-rent-arrears');
```

---

**Status:** ✅ Traceability complete  
**Coverage:** 71 tests covering 12 acceptance criteria  
**Next:** Create executable test file
