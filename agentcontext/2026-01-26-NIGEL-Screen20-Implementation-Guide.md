# Screen 20 Implementation Guide - Rent Details

**Date:** 2026-01-26  
**Author:** Nigel (Tester Agent)  
**For:** Claude (Developer Agent)  
**User Story:** `businessArtifacts/userstories/screen20.txt`

---

## Overview

Screen 20 captures rent amount and payment frequency, then auto-calculates daily rent for standard frequencies. It features conditional routing: standard frequencies (weekly, fortnightly, monthly) route to a confirmation screen, while "other" routes to manual arrears entry.

**Complexity:** ⭐⭐⭐ Medium-High — Currency input, calculation logic, conditional routing

---

## Changes Required

### 1. Create new route handler
**File:** `prototype/src/routes/claims.js` — Add GET/POST handlers for `/claims/rent-details`

### 2. Create template
**File:** `prototype/src/views/pages/claims/rent-details.njk` (new file)

### 3. Create placeholder routes (both branches)
**Files:** 
- `prototype/src/views/pages/claims/daily-rent-amount.njk` (temporary placeholder)
- `prototype/src/views/pages/claims/details-of-rent-arrears.njk` (temporary placeholder)

### 4. Add calculation logic
**Note:** Daily rent calculation with 2 decimal precision (Q3)

---

## Key Implementation Notes (Q1-Q5)

**Q1: Decimal Handling**
- Accept decimals with max 2 decimal places
- Valid: `125`, `125.5`, `125.50`
- Invalid: `125.567` (triggers error)

**Q2: Maximum Amount**
- Maximum rent: £1,000,000.00
- Valid: `1000000.00`, `999999.99`
- Invalid: `1000000.01` (triggers error)

**Q3: Calculation Precision**
- Round to 2 decimal places
- Example: `125 ÷ 7 = 17.857... → 17.86`
- Use standard rounding (0.5 rounds up)

**Q4: Other Frequency Storage**
- Set `calculatedDailyAmount = null` (not omit property)
- Session still contains `rentDetails` object

**Q5: Placeholder Routes**
- Create both: `/claims/daily-rent-amount` AND `/claims/details-of-rent-arrears`
- Both should return 200 with basic placeholder HTML

---

## Validation Rules

### Rent Amount Validation
```javascript
function validateAmount(amount) {
  // Required
  if (!amount || amount.trim() === '') {
    return 'Enter the rent amount as a number greater than 0';
  }
  
  // Numeric
  const numValue = parseFloat(amount);
  if (isNaN(numValue)) {
    return 'Enter the rent amount as a number greater than 0';
  }
  
  // Positive (greater than 0)
  if (numValue <= 0) {
    return 'Enter the rent amount as a number greater than 0';
  }
  
  // Maximum £1,000,000
  if (numValue > 1000000) {
    return 'Enter the rent amount as a number greater than 0';
  }
  
  // Max 2 decimal places
  if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
    return 'Enter the rent amount as a number greater than 0';
  }
  
  return null; // Valid
}
```

### Frequency Validation
```javascript
function validateFrequency(frequency) {
  const validFrequencies = ['weekly', 'fortnightly', 'monthly', 'other'];
  
  if (!frequency || !validFrequencies.includes(frequency)) {
    return 'Select how often rent should be paid';
  }
  
  return null; // Valid
}
```

---

## Calculation Logic

### Daily Rent Formulas
```javascript
function calculateDailyRent(amount, frequency) {
  const numAmount = parseFloat(amount);
  let dailyAmount = null;
  
  switch (frequency) {
    case 'weekly':
      dailyAmount = (numAmount / 7).toFixed(2);
      break;
    case 'fortnightly':
      dailyAmount = (numAmount / 14).toFixed(2);
      break;
    case 'monthly':
      dailyAmount = (numAmount / 365 * 12).toFixed(2);
      break;
    case 'other':
      dailyAmount = null;
      break;
  }
  
  return dailyAmount !== null ? parseFloat(dailyAmount) : null;
}
```

### Calculation Examples
| Amount | Frequency | Formula | Result |
|--------|-----------|---------|--------|
| 700.00 | weekly | 700 ÷ 7 | 100.00 |
| 750.00 | fortnightly | 750 ÷ 14 | 53.57 |
| 1500.00 | monthly | 1500 ÷ 365 × 12 | 493.15 |
| 125.00 | weekly | 125 ÷ 7 | 17.86 |
| 125.00 | fortnightly | 125 ÷ 14 | 8.93 |
| 125.00 | monthly | 125 ÷ 365 × 12 | 41.10 |
| 125.00 | other | null | null |

---

## Routing Logic

### Conditional Routing
```javascript
// After successful validation and calculation
if (frequency === 'weekly' || frequency === 'fortnightly' || frequency === 'monthly') {
  // Standard frequencies → daily rent confirmation
  res.redirect('/claims/daily-rent-amount');
} else if (frequency === 'other') {
  // Other frequency → manual arrears entry
  res.redirect('/claims/details-of-rent-arrears');
}
```

---

## Session Structure

```javascript
session.claim.rentDetails = {
  amount: 125.50,                      // Number (2 decimals max)
  frequency: 'weekly',                 // 'weekly' | 'fortnightly' | 'monthly' | 'other'
  calculatedDailyAmount: 17.86         // Number (2 decimals) or null (for 'other')
}
```

### Storage Notes
- `amount`: Store as Number type, not String
- `frequency`: Store as lowercase string
- `calculatedDailyAmount`: Number with 2 decimals OR null (for 'other')

---

## Route Handler Implementation

Add to `prototype/src/routes/claims.js`:

```javascript
// GET /claims/rent-details
router.get('/claims/rent-details', (req, res) => {
  const rentDetails = req.session.claim?.rentDetails || {};
  
  res.render('pages/claims/rent-details', {
    amount: rentDetails.amount || '',
    frequency: rentDetails.frequency || '',
    errors: {}
  });
});

// POST /claims/rent-details
router.post('/claims/rent-details', (req, res) => {
  const { amount, frequency } = req.body;
  const errors = {};
  
  // Validate amount
  const amountError = validateAmount(amount);
  if (amountError) {
    errors.amount = { text: amountError };
  }
  
  // Validate frequency
  const frequencyError = validateFrequency(frequency);
  if (frequencyError) {
    errors.frequency = { text: frequencyError };
  }
  
  // If validation errors, re-render with errors
  if (Object.keys(errors).length > 0) {
    return res.status(400).render('pages/claims/rent-details', {
      amount: amount || '',
      frequency: frequency || '',
      errors,
      errorList: Object.entries(errors).map(([field, error]) => ({
        text: error.text,
        href: `#${field}`
      }))
    });
  }
  
  // Calculate daily rent
  const calculatedDailyAmount = calculateDailyRent(amount, frequency);
  
  // Store in session
  if (!req.session.claim) req.session.claim = {};
  req.session.claim.rentDetails = {
    amount: parseFloat(amount),
    frequency: frequency,
    calculatedDailyAmount: calculatedDailyAmount
  };
  
  // Conditional routing
  if (frequency === 'weekly' || frequency === 'fortnightly' || frequency === 'monthly') {
    res.redirect('/claims/daily-rent-amount');
  } else {
    res.redirect('/claims/details-of-rent-arrears');
  }
});

// Validation helper (include in file)
function validateAmount(amount) {
  if (!amount || amount.trim() === '') {
    return 'Enter the rent amount as a number greater than 0';
  }
  
  const numValue = parseFloat(amount);
  if (isNaN(numValue) || numValue <= 0 || numValue > 1000000) {
    return 'Enter the rent amount as a number greater than 0';
  }
  
  if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
    return 'Enter the rent amount as a number greater than 0';
  }
  
  return null;
}

function validateFrequency(frequency) {
  const validFrequencies = ['weekly', 'fortnightly', 'monthly', 'other'];
  if (!frequency || !validFrequencies.includes(frequency)) {
    return 'Select how often rent should be paid';
  }
  return null;
}

function calculateDailyRent(amount, frequency) {
  const numAmount = parseFloat(amount);
  let dailyAmount = null;
  
  switch (frequency) {
    case 'weekly':
      dailyAmount = (numAmount / 7).toFixed(2);
      break;
    case 'fortnightly':
      dailyAmount = (numAmount / 14).toFixed(2);
      break;
    case 'monthly':
      dailyAmount = (numAmount / 365 * 12).toFixed(2);
      break;
    case 'other':
      dailyAmount = null;
      break;
  }
  
  return dailyAmount !== null ? parseFloat(dailyAmount) : null;
}
```

---

## Template Implementation

Create `prototype/src/views/pages/claims/rent-details.njk`:

```jinja
{% extends "layouts/main.njk" %}

{% block pageTitle %}
  {% if errorList %}Error: {% endif %}Rent details - Possession claims
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      
      {% if errorList %}
        {{ govukErrorSummary({
          titleText: "There is a problem",
          errorList: errorList,
          attributes: {
            tabindex: "-1"
          }
        }) }}
      {% endif %}
      
      <h1 class="govuk-heading-xl">Rent details</h1>
      
      <form method="post" action="/claims/rent-details">
        
        {# Rent amount input with £ prefix #}
        {{ govukInput({
          label: {
            text: "How much is the rent?",
            classes: "govuk-label--m"
          },
          id: "amount",
          name: "amount",
          prefix: {
            text: "£"
          },
          classes: "govuk-input--width-10",
          value: amount,
          errorMessage: errors.amount if errors.amount,
          spellcheck: false
        }) }}
        
        {# Frequency radios #}
        {{ govukRadios({
          name: "frequency",
          fieldset: {
            legend: {
              text: "How frequently should rent be paid?",
              classes: "govuk-fieldset__legend--m"
            }
          },
          items: [
            {
              value: "weekly",
              text: "Weekly",
              checked: frequency == 'weekly'
            },
            {
              value: "fortnightly",
              text: "Fortnightly",
              checked: frequency == 'fortnightly'
            },
            {
              value: "monthly",
              text: "Monthly",
              checked: frequency == 'monthly'
            },
            {
              value: "other",
              text: "Other",
              checked: frequency == 'other'
            }
          ],
          errorMessage: errors.frequency if errors.frequency
        }) }}
        
        {# Navigation buttons #}
        <div class="govuk-button-group">
          {{ govukButton({
            text: "Continue"
          }) }}
          
          <a class="govuk-link" href="/claims/notice-details">Previous</a>
          <a class="govuk-link" href="/case-list">Cancel</a>
        </div>
        
      </form>
      
    </div>
  </div>
{% endblock %}
```

---

## Placeholder Routes

### Placeholder 1: Daily Rent Amount
Create `prototype/src/views/pages/claims/daily-rent-amount.njk`:

```jinja
{% extends "layouts/main.njk" %}

{% block pageTitle %}
  Daily Rent Amount - Possession claims
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-xl">Placeholder: Daily Rent Amount</h1>
      <p class="govuk-body">This is a placeholder for Screen 21 (Daily Rent Amount).</p>
      <p class="govuk-body">
        <a href="/claims/rent-details" class="govuk-link">Back to Rent Details</a>
      </p>
    </div>
  </div>
{% endblock %}
```

Add GET route in `prototype/src/routes/claims.js`:
```javascript
router.get('/claims/daily-rent-amount', (req, res) => {
  res.render('pages/claims/daily-rent-amount');
});
```

### Placeholder 2: Details of Rent Arrears
Create `prototype/src/views/pages/claims/details-of-rent-arrears.njk`:

```jinja
{% extends "layouts/main.njk" %}

{% block pageTitle %}
  Details of Rent Arrears - Possession claims
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-xl">Placeholder: Details of Rent Arrears</h1>
      <p class="govuk-body">This is a placeholder for Screen 21 alternate (Details of Rent Arrears).</p>
      <p class="govuk-body">
        <a href="/claims/rent-details" class="govuk-link">Back to Rent Details</a>
      </p>
    </div>
  </div>
{% endblock %}
```

Add GET route in `prototype/src/routes/claims.js`:
```javascript
router.get('/claims/details-of-rent-arrears', (req, res) => {
  res.render('pages/claims/details-of-rent-arrears');
});
```

---

## GOV.UK Component Notes

### Currency Input with Prefix
- Use `govuk-input` with `prefix` property
- Prefix is visual only (not part of value)
- `classes: "govuk-input--width-10"` for appropriate width

### Radio Group
- Standard GOV.UK radios component
- 4 options: weekly, fortnightly, monthly, other
- No conditional reveals needed

### Error Patterns
- Error summary at top with `tabindex="-1"`
- Error links: `#amount` and `#frequency`
- Inline errors on both fields
- Error message text matches AC exactly

---

## Testing Notes

### Running Tests
```bash
cd prototype
npm test -- test/routes/rentDetails.test.js
```

### Expected Results
- **Total tests:** 71
- **All should FAIL initially** (no implementation yet)
- **After implementation:** All 71 tests should PASS

### Test Coverage
- Display: 9 tests
- Validation (amount): 14 tests
- Validation (frequency): 5 tests
- Persistence: 9 tests
- Calculation: 8 tests
- Routing: 6 tests
- Navigation: 6 tests
- Accessibility: 7 tests
- Edge cases: 7 tests

---

## Navigation Flow

```
Previous: /claims/notice-details (Screen 19)
  ↓
Current: /claims/rent-details (Screen 20)
  ↓
Next (Standard): /claims/daily-rent-amount (Screen 21 - placeholder)
  OR
Next (Other): /claims/details-of-rent-arrears (Screen 21 alt - placeholder)

Cancel: /case-list
```

---

## Common Pitfalls

### ❌ Don't Do This
```javascript
// DON'T store amount as string
req.session.claim.rentDetails.amount = amount;  // Wrong!

// DON'T forget to handle 'other' frequency
if (frequency !== 'other') {
  // Missing: what if frequency IS 'other'?
}

// DON'T use wrong calculation formula
dailyAmount = (numAmount * 12 / 365);  // Wrong for monthly!
```

### ✅ Do This
```javascript
// DO store amount as number
req.session.claim.rentDetails.amount = parseFloat(amount);

// DO handle all frequencies
if (frequency === 'weekly' || frequency === 'fortnightly' || frequency === 'monthly') {
  // Standard path
} else if (frequency === 'other') {
  // Other path
}

// DO use correct monthly formula
dailyAmount = (numAmount / 365 * 12);  // Correct!
```

---

## Acceptance Criteria Checklist

When implementing, ensure:

- [x] AC-1: Rent amount input displayed with £ prefix
- [x] AC-2: Amount validation (required, numeric, positive, max 2 decimals, max £1M)
- [x] AC-3: Frequency radios displayed (4 options)
- [x] AC-4: Frequency validation (required)
- [x] AC-5: Input preservation on validation error
- [x] AC-6: Session persistence (correct structure and types)
- [x] AC-7: Daily rent calculation (weekly/fortnightly/monthly/other)
- [x] AC-8: Standard frequencies → /claims/daily-rent-amount
- [x] AC-9: Other frequency → /claims/details-of-rent-arrears
- [x] AC-10: Previous → /claims/notice-details
- [x] AC-11: Cancel → /case-list (data preserved)
- [x] AC-12: Accessibility (error focus, links, labels, ARIA)

---

## Files to Create/Modify

### New Files (3)
1. `prototype/src/views/pages/claims/rent-details.njk`
2. `prototype/src/views/pages/claims/daily-rent-amount.njk` (placeholder)
3. `prototype/src/views/pages/claims/details-of-rent-arrears.njk` (placeholder)

### Modified Files (2)
1. `prototype/src/routes/claims.js` — Add GET/POST handlers + placeholders
2. `prototype/test/helpers/sessionHelper.js` — ✅ Already updated by Nigel

### Test Files (already created)
1. `prototype/test/routes/rentDetails.test.js` — 71 tests
2. `prototype/test/artifacts/screen20/` — 4 artifact files

---

## Summary

Screen 20 is a **medium-high complexity** screen that:
- Captures currency input with validation
- Provides 4 frequency options
- Auto-calculates daily rent (with 2 decimal precision)
- Routes conditionally based on frequency selection
- Requires both placeholder routes for testing

**Key Challenge:** Correct calculation formulas and rounding precision

**Ready for implementation!** ✅

---

**Questions?** Refer to test artifacts in `prototype/test/artifacts/screen20/` or ask Steve.
