# Implementation Guide — Screen 30: Underlessee or Mortgagee Entitled to Claim Relief Against Forfeiture

## Overview

This document provides implementation guidance for Claude (Developer Agent) to implement Screen 30 based on the test specifications.

---

## Route Configuration

### Routes to Implement

```javascript
GET  /claims/underlessee-or-mortgagee
POST /claims/underlessee-or-mortgagee
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/claims/underlessee-or-mortgagee.njk`

### Page Structure
```html
{% extends "layouts/main.njk" %}

{% block pageTitle %}Underlessee or mortgagee entitled to claim relief against forfeiture{% endblock %}

{% block content %}
  <!-- Error summary (conditional) -->
  <!-- Caption: "Make a claim" -->
  <!-- Case number display -->

  <h1 class="govuk-heading-l">Underlessee or mortgagee entitled to claim relief against forfeiture</h1>

  <!-- Explanatory text -->
  <p class="govuk-body">
    You must tell us if there is an underlessee (a subtenant) or a mortgagee (a mortgage lender) who has a legal right to ask the court to let a lease continue, even though the landlord has tried to end it.
  </p>

  <form method="post" novalidate>
    <!-- Radio group: hasUnderlesseeOrMortgagee -->
    {{ govukRadios({
      name: "hasUnderlesseeOrMortgagee",
      fieldset: {
        legend: {
          text: "Is there an underlessee or mortgagee entitled to claim relief against forfeiture?",
          classes: "govuk-fieldset__legend--m"
        }
      },
      items: [
        {
          value: "yes",
          text: "Yes"
        },
        {
          value: "no",
          text: "No"
        }
      ]
    }) }}

    <!-- Button group: Previous, Continue, Cancel -->
  </form>
{% endblock %}
```

---

## Form Fields

### Radio Group: hasUnderlesseeOrMortgagee

| Property | Value |
|----------|-------|
| Name | `hasUnderlesseeOrMortgagee` |
| Type | Radio |
| Required | Yes |
| Options | 2 fixed options |

**Option 1:**
- Value: `yes`
- Label: `Yes`

**Option 2:**
- Value: `no`
- Label: `No`

---

## Validation Rules

### Required Selection
| Field | Rule | Error Message | Error Target |
|-------|------|---------------|--------------|
| hasUnderlesseeOrMortgagee | Required | "Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture" | #hasUnderlesseeOrMortgagee |

### Validation Logic
```javascript
function validateUnderlesseeOrMortgagee(body) {
  const errors = [];

  if (!body.hasUnderlesseeOrMortgagee) {
    errors.push({
      field: 'hasUnderlesseeOrMortgagee',
      href: '#hasUnderlesseeOrMortgagee',
      text: 'Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture'
    });
  }

  return errors;
}
```

---

## Session Structure

### Storage Location
```javascript
session.claim.underlesseeOrMortgagee = {
  hasUnderlesseeOrMortgagee: 'yes' | 'no' | null
}
```

### Session Operations

**On successful POST:**
```javascript
// Initialize if needed
if (!req.session.claim.underlesseeOrMortgagee) {
  req.session.claim.underlesseeOrMortgagee = {};
}

// Store selection
req.session.claim.underlesseeOrMortgagee.hasUnderlesseeOrMortgagee = req.body.hasUnderlesseeOrMortgagee;
```

**On GET (pre-population):**
```javascript
const hasUnderlesseeOrMortgagee = req.session.claim?.underlesseeOrMortgagee?.hasUnderlesseeOrMortgagee || null;
```

---

## Navigation Logic

### Previous Button
```javascript
if (req.body.action === 'previous') {
  // Optionally save partial data
  return res.redirect('/claims/additional-reasons-for-possession');
}
```

### Continue Button (Success)
```javascript
// After validation passes and session saved
return res.redirect('/claims/underlessee-or-mortgagee-next'); // TBD - placeholder for Screen 31
```

### Cancel Button
```javascript
if (req.body.action === 'cancel') {
  return res.redirect('/case-list');
}
```

---

## Error Handling

### Error Summary Pattern
```html
{% if errors.length %}
{{ govukErrorSummary({
  titleText: "There is a problem",
  errorList: errors
}) }}
{% endif %}
```

### Inline Error Pattern
```javascript
{{ govukRadios({
  name: "hasUnderlesseeOrMortgagee",
  errorMessage: errors | getErrorFor('hasUnderlesseeOrMortgagee'),
  // ... rest of config
}) }}
```

---

## Pre-population Logic

### GET Handler
```javascript
router.get('/underlessee-or-mortgagee', (req, res) => {
  const hasUnderlesseeOrMortgagee = req.session.claim?.underlesseeOrMortgagee?.hasUnderlesseeOrMortgagee || null;

  res.render('claims/underlessee-or-mortgagee', {
    hasUnderlesseeOrMortgagee,
    errors: []
  });
});
```

### Template Pre-selection
```javascript
items: [
  {
    value: "yes",
    text: "Yes",
    checked: hasUnderlesseeOrMortgagee === 'yes'
  },
  {
    value: "no",
    text: "No",
    checked: hasUnderlesseeOrMortgagee === 'no'
  }
]
```

---

## POST Handler Structure

```javascript
router.post('/underlessee-or-mortgagee', (req, res) => {
  // Handle Previous
  if (req.body.action === 'previous') {
    return res.redirect('/claims/additional-reasons-for-possession');
  }

  // Handle Cancel
  if (req.body.action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validate
  const errors = validateUnderlesseeOrMortgagee(req.body);

  if (errors.length > 0) {
    return res.render('claims/underlessee-or-mortgagee', {
      hasUnderlesseeOrMortgagee: req.body.hasUnderlesseeOrMortgagee || null,
      errors
    });
  }

  // Initialize session object if needed
  if (!req.session.claim.underlesseeOrMortgagee) {
    req.session.claim.underlesseeOrMortgagee = {};
  }

  // Save to session
  req.session.claim.underlesseeOrMortgagee.hasUnderlesseeOrMortgagee = req.body.hasUnderlesseeOrMortgagee;

  // Navigate to next screen
  res.redirect('/claims/check-answers'); // Placeholder - Screen 31 TBD
});
```

---

## Accessibility Requirements

### Focus Management
- On validation error, focus moves to error summary
- Error summary has `tabindex="-1"` for programmatic focus

### Labelling
- Radio group has associated legend
- Each radio has visible label text
- Error messages linked to field via `aria-describedby`

### Keyboard Navigation
- All radios focusable via Tab
- Arrow keys navigate between radio options
- Enter/Space selects focused radio

---

## Test File Reference

Tests are located at: `prototype/test/routes/underlesseeOrMortgagee.test.js`

Run tests with:
```bash
npm test -- --grep "Screen 30"
```

---

## Dependencies

### Placeholder Route Required
A placeholder route or redirect to `/claims/check-answers` must be created to handle the Continue navigation, as Screen 31 is TBD.

### Session Helper
Add `navigateToUnderlesseeOrMortgagee` to `prototype/test/helpers/sessionHelper.js`

---

## Case Number Display

The case number should be displayed at the top of the page. Retrieve it from:
```javascript
req.session.claim?.caseNumber || ''
```

Display in template using appropriate GOV.UK caption styling.

---

## Comparison with Similar Screens

| Aspect | Screen 28 (Claiming Costs) | Screen 30 (Underlessee/Mortgagee) |
|--------|---------------------------|----------------------------------|
| Route | `/claiming-costs` | `/underlessee-or-mortgagee` |
| Options | 2 (Yes/No) | 2 (Yes/No) |
| Values | Simple strings (yes/no) | Simple strings (yes/no) |
| Session key | `claimingCosts` | `underlesseeOrMortgagee.hasUnderlesseeOrMortgagee` |
| Hint text | Yes (costs guidance) | None (explanatory text before question) |
| Previous screen | Screen 26d | Screen 29 |
| Next screen | Screen 29 | Screen 31 TBD |
| Explanatory text | No | Yes (before question) |

---

## Page Content Summary

### Static Text Elements
1. **Caption:** "Make a claim"
2. **Heading:** "Underlessee or mortgagee entitled to claim relief against forfeiture"
3. **Explanatory text:** "You must tell us if there is an underlessee (a subtenant) or a mortgagee (a mortgage lender) who has a legal right to ask the court to let a lease continue, even though the landlord has tried to end it."
4. **Question (legend):** "Is there an underlessee or mortgagee entitled to claim relief against forfeiture?"
5. **Radio labels:** "Yes", "No"

### Dynamic Elements
1. **Case number:** Retrieved from session
2. **Error messages:** Conditional on validation failure
3. **Pre-selection:** Based on session state

---

*Implementation guide created by Nigel (Tester Agent) on 2026-01-30 for Screen 30.*
