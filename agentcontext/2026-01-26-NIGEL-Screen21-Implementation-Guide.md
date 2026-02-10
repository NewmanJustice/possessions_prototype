# Screen 21 - Daily Rent Amount - Implementation Guide

**For:** Claude (Implementation Agent)  
**Created by:** Nigel (Tester Agent)  
**Date:** 2026-01-26  
**User Story:** businessArtifacts/userstories/screen21.txt  
**Test Coverage:** 71 tests in prototype/test/routes/dailyRentAmount.test.js

---

## Overview

This guide provides comprehensive implementation details for Screen 21 (Daily Rent Amount), including:
- Session structure requirements
- Validation rules for manual entry
- Conditional reveal pattern for "No" path
- Route and template specifications
- GOV.UK Frontend component usage
- Pre-population logic for revisits

---

## Quick Reference

### Route Information
- **GET Route:** `/claims/daily-rent-amount`
- **POST Route:** `/claims/daily-rent-amount`
- **Next Route:** `/claims/details-of-rent-arrears` (placeholder required)
- **Previous Route:** `/claims/rent-details` (Screen 20)

### Session Path
```javascript
session.claim.rentDetails.dailyAmount
session.claim.rentDetails.dailyAmountConfirmed
session.claim.rentDetails.calculatedDailyAmount  // from Screen 20
```

### Key Behaviors
1. Display calculated daily rent amount from Screen 20
2. Ask user to confirm or provide manual override
3. "Yes" path: Accept calculated amount, set confirmed = true
4. "No" path: Show manual entry field (conditional reveal)
5. Manual entry validation: Same as Screen 20 rent amount
6. Store decision and amount in session
7. Pre-populate on revisit

---

## Test Coverage Summary

**Total Tests: 71**
- Authentication & Access: 1 test
- Display calculated amount (AC-1): 4 tests
- Confirmation question (AC-2): 4 tests
- Radio selection required (AC-3): 4 tests
- Yes path acceptance (AC-4): 4 tests
- Conditional reveal (AC-5): 5 tests
- Manual entry validation (AC-6): 12 tests
- Manual entry acceptance (AC-7): 4 tests
- Session persistence (AC-8): 4 tests
- Routing (AC-9): 3 tests
- Previous button (AC-10): 3 tests
- Cancel button (AC-11): 3 tests
- Accessibility (AC-12): 6 tests
- Revisit & Pre-population: 8 tests
- Edge Cases: 7 tests

---

## Clarification Questions (Q1-Q6 Answered by Steve)

### Q1: Display Format
**Question:** Should the calculated daily rent amount be displayed as formatted currency (e.g., "£17.86")?  
**Answer:** Yes, display in currency format with £ symbol

### Q2: Validation Rules
**Question:** Should manual entry validation match Screen 20 rules (numeric, positive, max 2 decimals, max £1,000,000)?  
**Answer:** Yes, same validation rules

### Q3: Session Storage Logic
**Question:** For "Yes" path, should we:
- Set dailyAmount = calculatedDailyAmount
- Set dailyAmountConfirmed = true

For "No" path:
- Set dailyAmount = manual entry value
- Set dailyAmountConfirmed = false  

**Answer:** Yes, exactly as described

### Q4: Revisit Behavior
**Question:** When revisiting, should we pre-populate:
- Radio selection (Yes/No)
- Manual entry field (if "No" was selected)  

**Answer:** Yes, pre-populate both

### Q5: Next Route
**Question:** Where should the form redirect on success?  
**Answer:** `/claims/details-of-rent-arrears` (same as Screen 20's "other" path)

### Q6: Placeholder Route
**Question:** Should we create a placeholder for `/claims/details-of-rent-arrears`?  
**Answer:** Yes, create placeholder

---

## Session Structure

### Input (from Screen 20)
```javascript
session.claim.rentDetails = {
  amount: 125.00,                    // Original rent amount
  frequency: 'weekly',               // Rent frequency
  calculatedDailyAmount: 17.86       // Daily amount calculated by Screen 20
}
```

### Output (after Screen 21)
```javascript
// "Yes" path (confirmed calculated amount)
session.claim.rentDetails = {
  amount: 125.00,
  frequency: 'weekly',
  calculatedDailyAmount: 17.86,
  dailyAmount: 17.86,                // Set to calculatedDailyAmount
  dailyAmountConfirmed: true         // User confirmed calculated amount
}

// "No" path (manual override)
session.claim.rentDetails = {
  amount: 125.00,
  frequency: 'weekly',
  calculatedDailyAmount: 17.86,      // Preserve original calculation
  dailyAmount: 20.00,                // User's manual entry
  dailyAmountConfirmed: false        // User did not confirm calculated
}
```

### Important Notes:
- **Always preserve `calculatedDailyAmount`** - never overwrite it
- The page must display `calculatedDailyAmount` even after manual override
- Store `dailyAmount` as **Number** type, not string
- `dailyAmountConfirmed` is **Boolean** (true/false)

---

## Validation Rules

### Radio Selection (confirmation)
- **Required:** Must select either "Yes" or "No"
- **Error Message:** "Select whether the daily rent amount is correct"
- **Field ID:** `confirmation`

### Manual Daily Amount (when "No" selected)
- **Required:** Must be provided when "No" is selected
- **Format:** Numeric, positive, max 2 decimal places
- **Minimum:** £0.01
- **Maximum:** £1,000,000.00
- **Regex:** `/^\d+(\.\d{1,2})?$/`
- **Reject:** Negative, zero, non-numeric, £ symbol, commas, >2 decimals
- **Error Message:** "Enter the daily rent amount as a number greater than 0"
- **Field ID:** `manualDailyAmount`

### Validation Examples
```javascript
// Valid
'0.01'        // Minimum
'17.86'       // 2 decimals
'125.5'       // 1 decimal
'125'         // Whole number
'999999.99'   // Large amount
'1000000.00'  // Maximum

// Invalid
''            // Empty when "No" selected
'0'           // Zero
'0.00'        // Zero with decimals
'-10'         // Negative
'abc'         // Non-numeric
'£125'        // Currency symbol
'125.567'     // More than 2 decimals
'1000000.01'  // Over maximum
```

---

## Route Implementation

### GET /claims/daily-rent-amount

```javascript
router.get('/daily-rent-amount', (req, res) => {
  // Ensure user completed Screen 20
  if (!req.session.claim?.rentDetails?.calculatedDailyAmount) {
    return res.redirect('/claims/rent-details');
  }
  
  const rentDetails = req.session.claim.rentDetails;
  
  // Pre-populate from session on revisit
  const confirmation = rentDetails.dailyAmountConfirmed === true ? 'yes' : 
                       rentDetails.dailyAmountConfirmed === false ? 'no' : 
                       undefined;
  
  const manualDailyAmount = !rentDetails.dailyAmountConfirmed && rentDetails.dailyAmount 
    ? rentDetails.dailyAmount 
    : undefined;
  
  res.render('pages/claims/daily-rent-amount', {
    calculatedDailyAmount: rentDetails.calculatedDailyAmount,
    confirmation,
    manualDailyAmount,
    errors: {}
  });
});
```

### POST /claims/daily-rent-amount

```javascript
router.post('/daily-rent-amount', (req, res) => {
  const { confirmation, manualDailyAmount } = req.body;
  const errors = {};
  
  // Validation: Radio selection required
  if (!confirmation) {
    errors.confirmation = {
      text: 'Select whether the daily rent amount is correct',
      href: '#confirmation'
    };
  }
  
  // Validation: Manual entry when "No" selected
  if (confirmation === 'no') {
    const regex = /^\d+(\.\d{1,2})?$/;
    const amount = parseFloat(manualDailyAmount);
    
    if (!manualDailyAmount || 
        !regex.test(manualDailyAmount) || 
        amount <= 0 || 
        amount > 1000000) {
      errors.manualDailyAmount = {
        text: 'Enter the daily rent amount as a number greater than 0',
        href: '#manualDailyAmount'
      };
    }
  }
  
  // If errors, re-render with preserved values
  if (Object.keys(errors).length > 0) {
    return res.status(400).render('pages/claims/daily-rent-amount', {
      calculatedDailyAmount: req.session.claim.rentDetails.calculatedDailyAmount,
      confirmation,
      manualDailyAmount,
      errors
    });
  }
  
  // Store in session
  if (confirmation === 'yes') {
    req.session.claim.rentDetails.dailyAmount = 
      req.session.claim.rentDetails.calculatedDailyAmount;
    req.session.claim.rentDetails.dailyAmountConfirmed = true;
  } else {
    req.session.claim.rentDetails.dailyAmount = parseFloat(manualDailyAmount);
    req.session.claim.rentDetails.dailyAmountConfirmed = false;
  }
  
  // Save and redirect
  req.session.save((err) => {
    if (err) throw err;
    res.redirect('/claims/details-of-rent-arrears');
  });
});
```

---

## Template Implementation

### File Location
`prototype/src/views/pages/claims/daily-rent-amount.njk`

### Template Structure

```njk
{% extends "layouts/main.njk" %}

{% block pageTitle %}
  {{ "Error: " if errors | length }}Daily rent amount - Make a possession claim - GOV.UK
{% endblock %}

{% block beforeContent %}
  {{ govukBackLink({
    text: "Previous",
    href: "/claims/rent-details"
  }) }}
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      
      {# Error Summary #}
      {% if errors | length %}
        {{ govukErrorSummary({
          titleText: "There is a problem",
          errorList: errors | toErrorList,
          attributes: {
            tabindex: "-1"
          }
        }) }}
      {% endif %}
      
      <form method="post" novalidate>
        
        <h1 class="govuk-heading-xl">
          Daily rent amount
        </h1>
        
        {# Display calculated amount #}
        <p class="govuk-body">
          Based on your previous answers about unpaid rent, the amount per day 
          that unpaid rent should be charged at is 
          <strong class="govuk-!-font-weight-bold">£{{ calculatedDailyAmount | fixed(2) }}</strong>.
        </p>
        
        {# Radio group with conditional reveal #}
        {% set manualEntryHtml %}
          {{ govukInput({
            id: "manualDailyAmount",
            name: "manualDailyAmount",
            type: "text",
            classes: "govuk-input--width-10",
            label: {
              text: "Enter the correct daily rent amount"
            },
            prefix: {
              text: "£"
            },
            value: manualDailyAmount,
            errorMessage: errors.manualDailyAmount
          }) }}
        {% endset %}
        
        {{ govukRadios({
          name: "confirmation",
          fieldset: {
            legend: {
              text: "Is the amount per day that unpaid rent should be charged at correct?",
              classes: "govuk-fieldset__legend--m"
            }
          },
          items: [
            {
              value: "yes",
              text: "Yes",
              checked: confirmation == "yes"
            },
            {
              value: "no",
              text: "No",
              checked: confirmation == "no",
              conditional: {
                html: manualEntryHtml
              }
            }
          ],
          errorMessage: errors.confirmation
        }) }}
        
        {# Submit button #}
        {{ govukButton({
          text: "Continue"
        }) }}
        
        {# Cancel link #}
        <p class="govuk-body">
          <a href="/case-list" class="govuk-link">Cancel</a>
        </p>
        
      </form>
      
    </div>
  </div>
{% endblock %}
```

---

## GOV.UK Frontend Components

### 1. Error Summary
```njk
{{ govukErrorSummary({
  titleText: "There is a problem",
  errorList: [
    {
      text: "Select whether the daily rent amount is correct",
      href: "#confirmation"
    },
    {
      text: "Enter the daily rent amount as a number greater than 0",
      href: "#manualDailyAmount"
    }
  ],
  attributes: {
    tabindex: "-1"  // For focus management
  }
}) }}
```

### 2. Radios with Conditional Reveal
```njk
{{ govukRadios({
  name: "confirmation",
  items: [
    {
      value: "yes",
      text: "Yes",
      checked: confirmation == "yes"
    },
    {
      value: "no",
      text: "No",
      checked: confirmation == "no",
      conditional: {
        html: manualEntryHtml  // Content revealed when selected
      }
    }
  ],
  errorMessage: errors.confirmation
}) }}
```

### 3. Input with Prefix
```njk
{{ govukInput({
  id: "manualDailyAmount",
  name: "manualDailyAmount",
  type: "text",
  classes: "govuk-input--width-10",
  prefix: {
    text: "£"
  },
  value: manualDailyAmount,
  errorMessage: errors.manualDailyAmount
}) }}
```

### 4. Back Link
```njk
{{ govukBackLink({
  text: "Previous",
  href: "/claims/rent-details"
}) }}
```

---

## Nunjucks Filters

### Currency Formatting Filter
The template uses `| fixed(2)` filter to format the calculated amount to 2 decimal places.

**Add to app setup if not present:**
```javascript
nunjucksEnv.addFilter('fixed', function(num, decimals) {
  return parseFloat(num).toFixed(decimals);
});
```

### Error List Filter
The template uses `| toErrorList` to convert errors object to GOV.UK format.

**Add to app setup if not present:**
```javascript
nunjucksEnv.addFilter('toErrorList', function(errors) {
  return Object.values(errors);
});
```

---

## Placeholder Route

Create placeholder for next screen at `/claims/details-of-rent-arrears`

### Route Handler (in routes/claims.js)
```javascript
router.get('/details-of-rent-arrears', (req, res) => {
  res.render('pages/claims/details-of-rent-arrears');
});
```

### Template (views/pages/claims/details-of-rent-arrears.njk)
```njk
{% extends "layouts/main.njk" %}

{% block pageTitle %}
  Details of Rent Arrears - Make a possession claim - GOV.UK
{% endblock %}

{% block beforeContent %}
  {{ govukBackLink({
    text: "Previous",
    href: "/claims/daily-rent-amount"
  }) }}
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-xl">
        Details of Rent Arrears
      </h1>
      <p class="govuk-body">
        This is a placeholder page for the details of rent arrears screen.
      </p>
    </div>
  </div>
{% endblock %}
```

---

## Pre-population Logic

### On GET Request
When a user revisits the page after submission:

1. **Check `dailyAmountConfirmed` flag:**
   - If `true` → Pre-select "Yes" radio
   - If `false` → Pre-select "No" radio and populate manual entry field
   - If `undefined` → No pre-selection (first visit)

2. **Pre-populate manual entry field:**
   - Only populate if `dailyAmountConfirmed === false`
   - Use `rentDetails.dailyAmount` value

3. **Always display calculated amount:**
   - Use `rentDetails.calculatedDailyAmount` regardless of user's choice
   - Never change this value

### Example Logic
```javascript
const confirmation = rentDetails.dailyAmountConfirmed === true ? 'yes' : 
                     rentDetails.dailyAmountConfirmed === false ? 'no' : 
                     undefined;

const manualDailyAmount = !rentDetails.dailyAmountConfirmed && rentDetails.dailyAmount 
  ? rentDetails.dailyAmount 
  : undefined;
```

---

## Conditional Reveal Pattern

The manual entry field must use GOV.UK's conditional reveal pattern:

### HTML Structure
```html
<div class="govuk-radios" data-module="govuk-radios">
  <div class="govuk-radios__item">
    <input type="radio" name="confirmation" value="yes">
    <label>Yes</label>
  </div>
  <div class="govuk-radios__item">
    <input type="radio" name="confirmation" value="no">
    <label>No</label>
  </div>
  <div class="govuk-radios__conditional" id="conditional-confirmation-no">
    <!-- Manual entry field here -->
  </div>
</div>
```

### JavaScript Module
GOV.UK Frontend automatically handles show/hide if:
- `data-module="govuk-radios"` is present on container
- Conditional has class `govuk-radios__conditional`
- Radio has `data-aria-controls` attribute linking to conditional ID

---

## Error Handling

### Validation Order
1. Check radio selection first
2. If "No" selected, validate manual entry
3. Display all errors in error summary

### Error States

**No radio selected:**
```javascript
errors.confirmation = {
  text: 'Select whether the daily rent amount is correct',
  href: '#confirmation'
};
```

**Manual entry invalid (when "No" selected):**
```javascript
errors.manualDailyAmount = {
  text: 'Enter the daily rent amount as a number greater than 0',
  href: '#manualDailyAmount'
};
```

### Preserving Values on Error
When re-rendering with errors:
- Preserve radio selection (`confirmation`)
- Preserve manual entry value (`manualDailyAmount`)
- Display calculated amount (`calculatedDailyAmount`)
- Show error summary with links

---

## Navigation Flow

### Entry Point
User arrives from Screen 20 (Rent Details) after submitting with:
- `weekly`, `fortnightly`, or `monthly` frequency (not "other")

### Exit Points
Both paths redirect to same route:
- **Yes path:** `/claims/details-of-rent-arrears`
- **No path (manual entry):** `/claims/details-of-rent-arrears`

### Previous Navigation
Back link points to: `/claims/rent-details`

### Cancel Navigation
Cancel link points to: `/case-list`

---

## Accessibility Requirements

### 1. Error Summary
- Must have `tabindex="-1"` for focus management
- Links must use `href="#fieldId"` to target form controls
- Display "There is a problem" as title

### 2. Form Controls
- All inputs must have associated labels
- Radio group must have fieldset with legend
- Manual entry field must have clear label

### 3. Error Messages
- Link radio error to `#confirmation`
- Link manual entry error to `#manualDailyAmount`
- Error messages must be clear and actionable

### 4. Keyboard Navigation
- All form controls keyboard accessible (default with GOV.UK)
- Conditional reveal works with keyboard
- Focus moves to error summary on submission with errors

---

## Testing Checklist

Use this checklist to verify implementation against tests:

### Display & Structure
- [ ] Page displays calculated daily rent amount
- [ ] Amount shown in currency format (£17.86)
- [ ] Explanation text present about calculation source
- [ ] "Yes" radio option present
- [ ] "No" radio option present
- [ ] Manual entry field exists in conditional

### Validation
- [ ] Error when no radio selected
- [ ] Error when "No" selected but manual entry empty
- [ ] Reject non-numeric manual entry
- [ ] Reject zero and negative values
- [ ] Reject amounts with >2 decimal places
- [ ] Accept valid amounts (0.01 to 1,000,000.00)
- [ ] Error summary displays correctly
- [ ] Error links target correct fields

### Yes Path
- [ ] Accepts "Yes" selection
- [ ] Sets dailyAmountConfirmed = true
- [ ] Sets dailyAmount = calculatedDailyAmount
- [ ] Redirects to /claims/details-of-rent-arrears

### No Path (Manual Entry)
- [ ] Manual entry field revealed when "No" selected
- [ ] Manual entry has £ prefix
- [ ] Accepts valid manual entry
- [ ] Sets dailyAmountConfirmed = false
- [ ] Sets dailyAmount = manual entry value
- [ ] Redirects to /claims/details-of-rent-arrears

### Session Persistence
- [ ] calculatedDailyAmount preserved after manual override
- [ ] dailyAmount stored as Number type
- [ ] dailyAmountConfirmed stored as Boolean

### Revisit Behavior
- [ ] Pre-populates "Yes" radio when confirmed
- [ ] Pre-populates "No" radio when manual entry used
- [ ] Pre-populates manual entry field value
- [ ] Allows changing from Yes to No
- [ ] Allows changing from No to Yes
- [ ] Allows updating manual entry value

### Navigation
- [ ] Previous link points to /claims/rent-details
- [ ] Cancel link points to /case-list
- [ ] Placeholder exists at /claims/details-of-rent-arrears
- [ ] Data preserved when navigating previous

### Accessibility
- [ ] Error summary has tabindex="-1"
- [ ] Error links use href="#fieldId"
- [ ] All form controls have labels
- [ ] Keyboard accessible

---

## Common Implementation Pitfalls

### ❌ Don't:
1. Overwrite `calculatedDailyAmount` when user enters manual value
2. Store `dailyAmount` as string (use `parseFloat()`)
3. Forget to validate manual entry when "No" selected
4. Show manual entry field on initial page load
5. Use "Yes"/"No" strings for `dailyAmountConfirmed` (use Boolean)

### ✅ Do:
1. Preserve `calculatedDailyAmount` permanently in session
2. Store both `dailyAmount` and `dailyAmountConfirmed`
3. Validate manual entry with same rules as Screen 20
4. Use GOV.UK conditional reveal pattern
5. Pre-populate on revisit based on `dailyAmountConfirmed` flag

---

## Test Execution

### Run Screen 21 Tests Only
```bash
cd prototype
npm test -- test/routes/dailyRentAmount.test.js
```

### Expected Baseline
- **Before implementation:** All tests fail (expected)
- **After implementation:** All 71 tests pass

### Test Organization
Tests are organized by Acceptance Criteria (AC-1 through AC-12) plus:
- Revisit & Pre-population tests
- Edge case tests
- Cross-cutting concerns (authentication, accessibility)

---

## Session Flow Example

### User Journey: Confirm Calculated Amount

1. **Screen 20 Submission:**
   ```javascript
   session.claim.rentDetails = {
     amount: 125.00,
     frequency: 'weekly',
     calculatedDailyAmount: 17.86
   }
   ```

2. **Screen 21 GET:** Display £17.86 with "Yes/No" question

3. **User selects "Yes":**
   ```javascript
   POST { confirmation: 'yes' }
   ```

4. **Session Updated:**
   ```javascript
   session.claim.rentDetails = {
     amount: 125.00,
     frequency: 'weekly',
     calculatedDailyAmount: 17.86,
     dailyAmount: 17.86,              // Added
     dailyAmountConfirmed: true       // Added
   }
   ```

5. **Redirect:** → `/claims/details-of-rent-arrears`

### User Journey: Manual Override

1. **Screen 20 Submission:** (same as above)

2. **Screen 21 GET:** Display £17.86 with "Yes/No" question

3. **User selects "No" and enters £20.00:**
   ```javascript
   POST { 
     confirmation: 'no',
     manualDailyAmount: '20.00'
   }
   ```

4. **Session Updated:**
   ```javascript
   session.claim.rentDetails = {
     amount: 125.00,
     frequency: 'weekly',
     calculatedDailyAmount: 17.86,    // Preserved
     dailyAmount: 20.00,               // Manual entry
     dailyAmountConfirmed: false      // Not confirmed
   }
   ```

5. **Redirect:** → `/claims/details-of-rent-arrears`

6. **On Revisit:** "No" pre-selected, field shows "20.00"

---

## Related Files

### Test Files
- **Executable Tests:** `prototype/test/routes/dailyRentAmount.test.js` (71 tests)
- **Test Artifacts:** `prototype/test/artifacts/screen21/` (4 files)
  - `understanding.md` - Story summary and behaviors
  - `test-plan.md` - Test strategy and scope
  - `test-matrix.md` - All 71 tests with Given/When/Then
  - `traceability.md` - Tests mapped to ACs

### Source Files to Create/Modify
- **Route:** `prototype/src/routes/claims.js` - Add GET/POST handlers
- **Template:** `prototype/src/views/pages/claims/daily-rent-amount.njk`
- **Placeholder Route:** Add GET for `/claims/details-of-rent-arrears`
- **Placeholder Template:** `prototype/src/views/pages/claims/details-of-rent-arrears.njk`

### Helper Files
- **Navigation:** `prototype/test/helpers/sessionHelper.js` - Contains `navigateToDailyRentAmount()`
- **App Setup:** `prototype/src/app.js` - May need Nunjucks filters

### Business Artifacts
- **User Story:** `businessArtifacts/userstories/screen21.txt`

---

## Summary

Screen 21 is a confirmation/override screen that:
1. Displays the calculated daily rent amount from Screen 20
2. Asks user to confirm or provide manual override
3. Uses conditional reveal for manual entry field
4. Validates manual entry with same rules as Screen 20
5. Stores both the decision (confirmed/not) and the final amount
6. Pre-populates all fields when revisiting

**Key Implementation Points:**
- Preserve `calculatedDailyAmount` permanently
- Store `dailyAmount` as Number
- Store `dailyAmountConfirmed` as Boolean
- Use GOV.UK conditional reveal pattern
- Same validation as Screen 20 for manual entry
- Both paths redirect to same next screen

---

**Implementation Status:** ❌ NOT IMPLEMENTED  
**Test Status:** ✅ 71 tests written and ready  
**Ready for Implementation:** ✅ YES

---

*This guide was generated by Nigel (Tester Agent) based on user story screen21.txt and clarifications from Steve (Principal Developer). All 71 tests are executable and ready for implementation validation.*
