# Implementation Guide — Screen 28: Claiming Costs

## Overview

This document provides implementation guidance for Claude (Developer Agent) to implement Screen 28 based on the test specifications.

---

## Route Configuration

### Routes to Implement

```javascript
GET  /claims/claiming-costs
POST /claims/claiming-costs
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/claims/claiming-costs.njk`

### Page Structure
```html
{% extends "layouts/main.njk" %}

{% block pageTitle %}Claiming costs{% endblock %}

{% block content %}
  <!-- Error summary (conditional) -->
  <!-- Case number display -->

  <h1 class="govuk-heading-l">Claiming costs</h1>

  <form method="post" novalidate>
    <!-- Radio group: claimingCosts -->
    {{ govukRadios({
      name: "claimingCosts",
      fieldset: {
        legend: {
          text: "Do you want to ask for your costs back?",
          classes: "govuk-fieldset__legend--m"
        }
      },
      hint: {
        text: "You do not need to provide the exact amount at this stage, but a judge will request a schedule of costs at the hearing"
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

### Radio Group: claimingCosts

| Property | Value |
|----------|-------|
| Name | `claimingCosts` |
| Type | Radio |
| Required | Yes |
| Options | 2 fixed options |

**Option 1:**
- Value: `yes`
- Label: `Yes`

**Option 2:**
- Value: `no`
- Label: `No`

**Hint text:** `You do not need to provide the exact amount at this stage, but a judge will request a schedule of costs at the hearing`

---

## Validation Rules

### Required Selection
| Field | Rule | Error Message | Error Target |
|-------|------|---------------|--------------|
| claimingCosts | Required | "Select yes if you want to ask for your costs back" | #claimingCosts |

### Validation Logic
```javascript
function validateClaimingCosts(body) {
  const errors = [];

  if (!body.claimingCosts) {
    errors.push({
      field: 'claimingCosts',
      href: '#claimingCosts',
      text: 'Select yes if you want to ask for your costs back'
    });
  }

  return errors;
}
```

---

## Session Structure

### Storage Location
```javascript
session.claim.claimingCosts = 'yes' | 'no' | null
```

### Session Operations

**On successful POST:**
```javascript
// Store selection
req.session.claim.claimingCosts = req.body.claimingCosts;
```

**On GET (pre-population):**
```javascript
const claimingCosts = req.session.claim?.claimingCosts || null;
```

---

## Navigation Logic

### Previous Button
```javascript
if (req.body.action === 'previous') {
  // Optionally save partial data
  return res.redirect('/claims/statement-of-express-terms');
}
```

### Continue Button (Success)
```javascript
// After validation passes and session saved
return res.redirect('/claims/claiming-costs-next'); // TBD - placeholder
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
  name: "claimingCosts",
  errorMessage: errors | getErrorFor('claimingCosts'),
  // ... rest of config
}) }}
```

---

## Pre-population Logic

### GET Handler
```javascript
router.get('/claiming-costs', (req, res) => {
  const claimingCosts = req.session.claim?.claimingCosts || null;

  res.render('claims/claiming-costs', {
    claimingCosts,
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
    checked: claimingCosts === 'yes'
  },
  {
    value: "no",
    text: "No",
    checked: claimingCosts === 'no'
  }
]
```

---

## POST Handler Structure

```javascript
router.post('/claiming-costs', (req, res) => {
  // Handle Previous
  if (req.body.action === 'previous') {
    return res.redirect('/claims/statement-of-express-terms');
  }

  // Handle Cancel
  if (req.body.action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validate
  const errors = validateClaimingCosts(req.body);

  if (errors.length > 0) {
    return res.render('claims/claiming-costs', {
      claimingCosts: req.body.claimingCosts || null,
      errors
    });
  }

  // Save to session
  req.session.claim.claimingCosts = req.body.claimingCosts;

  // Navigate to next screen
  res.redirect('/claims/claiming-costs-next'); // TBD - placeholder
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
- Hint text associated with radio group

### Keyboard Navigation
- All radios focusable via Tab
- Arrow keys navigate between radio options
- Enter/Space selects focused radio

---

## Test File Reference

Tests are located at: `prototype/test/routes/claimingCosts.test.js`

Run tests with:
```bash
npm test -- --grep "Screen 28"
```

---

## Dependencies

### Placeholder Route Required
A placeholder route `/claims/claiming-costs-next` must be created to handle the Continue navigation, as the next screen is TBD.

### Session Helper
Add `navigateToClaimingCosts` to `prototype/test/helpers/sessionHelper.js`

---

## Case Number Display

The case number should be displayed at the top of the page. Retrieve it from:
```javascript
req.session.claim?.caseNumber || ''
```

Display in template using appropriate GOV.UK caption styling.

---

## Comparison with Screen 26a/26c

| Aspect | Screen 26a | Screen 26c | Screen 28 |
|--------|-----------|-----------|----------|
| Route | `/select-housing-act-suspension` | `/select-housing-act-demotion` | `/claiming-costs` |
| Options | 3 | 2 | 2 (Yes/No) |
| Values | Complex strings | Complex strings | Simple strings (yes/no) |
| Session key | `suspensionOrder` | `demotionOrder` | `claimingCosts` |
| Hint text | None | None | Yes (costs guidance) |
| Next screen | Screen 26b | Screen 26d | TBD |

---

*Implementation guide created by Nigel (Tester Agent) on 2026-01-29 for Screen 28.*
