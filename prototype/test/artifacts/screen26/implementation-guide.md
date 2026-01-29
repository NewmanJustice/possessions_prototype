# Implementation Guide — Screen 26: Alternatives to Possession

## Overview

This document provides implementation guidance for Claude (Developer Agent) to implement Screen 26 based on the test specifications.

---

## Route Configuration

### Routes to Implement

```javascript
GET  /claims/alternative-to-possession
POST /claims/alternative-to-possession
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/claims/alternative-to-possession.njk`

### Page Structure
```html
{% extends "layouts/main.njk" %}

{% block pageTitle %}Alternatives to possession{% endblock %}

{% block content %}
  <!-- Error summary (conditional) -->
  <!-- Back link to /claims/defendants-circumstances -->

  <h1 class="govuk-heading-l">Alternatives to possession</h1>

  <!-- Guidance paragraph -->
  <p class="govuk-body">
    You can request the court to consider alternatives to making a possession order. These are:
  </p>
  <ul class="govuk-list govuk-list--bullet">
    <li>suspension of the defendant's right to buy</li>
    <li>demotion of tenancy</li>
  </ul>
  <p class="govuk-body">
    These are optional. If you do not select either option, the claim will proceed to claiming costs.
  </p>

  <form method="post" novalidate>
    <!-- Radio group: alternativesToPossession -->
    {{ govukRadios({
      name: "alternativesToPossession",
      fieldset: {
        legend: {
          text: "In the alternative to possession, would you like to claim suspension of right to buy or demotion of tenancy? (Optional)",
          classes: "govuk-fieldset__legend--m"
        }
      },
      items: [
        {
          value: "suspensionOfRightToBuy",
          text: "Suspension of right to buy"
        },
        {
          value: "demotionOfTenancy",
          text: "Demotion of tenancy"
        },
        {
          value: "neither",
          text: "Neither"
        }
      ]
    }) }}

    <!-- Button group: Previous, Continue, Cancel -->
  </form>
{% endblock %}
```

---

## Form Fields

### Radio Group: alternativesToPossession

| Property | Value |
|----------|-------|
| Name | `alternativesToPossession` |
| Type | Radio |
| Required | No (user can select "Neither" or no selection) |
| Options | 3 fixed options |

**Option 1:**
- Value: `suspensionOfRightToBuy`
- Label: `Suspension of right to buy`

**Option 2:**
- Value: `demotionOfTenancy`
- Label: `Demotion of tenancy`

**Option 3:**
- Value: `neither`
- Label: `Neither`

---

## Validation Rules

### No Validation Errors on Optional Selection
| Field | Rule | Behavior |
|-------|------|----------|
| alternativesToPossession | Optional | No selection accepted; no error raised |

### Validation Logic
```javascript
function validateAlternativesToPossession(body) {
  const errors = [];

  // No validation - selection is optional
  // Server must prevent both suspensionOfRightToBuy and demotionOfTenancy being true simultaneously
  if (body.suspensionOfRightToBuy && body.demotionOfTenancy) {
    errors.push({
      field: 'alternativesToPossession',
      href: '#alternativesToPossession',
      text: 'You cannot select both suspension of right to buy and demotion of tenancy'
    });
  }

  return errors;
}
```

---

## Session Structure

### Storage Location
```javascript
session.claim.alternativesToPossession = {
  suspensionOfRightToBuy: true | false,
  demotionOfTenancy: true | false
}
```

### Session Operations

**On successful POST:**
```javascript
// Determine which option was selected
let suspensionOfRightToBuy = false;
let demotionOfTenancy = false;

if (req.body.alternativesToPossession === 'suspensionOfRightToBuy') {
  suspensionOfRightToBuy = true;
} else if (req.body.alternativesToPossession === 'demotionOfTenancy') {
  demotionOfTenancy = true;
}
// If 'neither' or undefined, both remain false

// Ensure alternativesToPossession object exists
if (!req.session.claim.alternativesToPossession) {
  req.session.claim.alternativesToPossession = {};
}

// Store selection
req.session.claim.alternativesToPossession.suspensionOfRightToBuy = suspensionOfRightToBuy;
req.session.claim.alternativesToPossession.demotionOfTenancy = demotionOfTenancy;
```

**On GET (pre-population):**
```javascript
const alternativesToPossession = req.session.claim?.alternativesToPossession || {};
let selectedOption = null;

if (alternativesToPossession.suspensionOfRightToBuy) {
  selectedOption = 'suspensionOfRightToBuy';
} else if (alternativesToPossession.demotionOfTenancy) {
  selectedOption = 'demotionOfTenancy';
} else {
  selectedOption = 'neither';
}
```

---

## Navigation Logic

### Previous Button
```javascript
if (req.body.action === 'previous') {
  // Data preserved in session
  return res.redirect('/claims/defendants-circumstances');
}
```

### Continue Button (Routing Based on Selection)
```javascript
// After validation passes and session saved
const alternatives = req.session.claim.alternativesToPossession;

if (alternatives.suspensionOfRightToBuy) {
  return res.redirect('/claims/select-housing-act-suspension');
} else if (alternatives.demotionOfTenancy) {
  return res.redirect('/claims/select-housing-act-demotion');
} else {
  // Neither option selected
  return res.redirect('/claims/claiming-costs');
}
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
  name: "alternativesToPossession",
  errorMessage: errors | getErrorFor('alternativesToPossession'),
  // ... rest of config
}) }}
```

---

## Pre-population Logic

### GET Handler
```javascript
router.get('/alternative-to-possession', (req, res) => {
  const alternativesToPossession = req.session.claim?.alternativesToPossession || {};

  let selectedOption = null;
  if (alternativesToPossession.suspensionOfRightToBuy) {
    selectedOption = 'suspensionOfRightToBuy';
  } else if (alternativesToPossession.demotionOfTenancy) {
    selectedOption = 'demotionOfTenancy';
  } else {
    selectedOption = 'neither';
  }

  res.render('claims/alternative-to-possession', {
    selectedOption: selectedOption,
    errors: []
  });
});
```

### Template Pre-selection
```javascript
items: [
  {
    value: "suspensionOfRightToBuy",
    text: "Suspension of right to buy",
    checked: selectedOption === 'suspensionOfRightToBuy'
  },
  {
    value: "demotionOfTenancy",
    text: "Demotion of tenancy",
    checked: selectedOption === 'demotionOfTenancy'
  },
  {
    value: "neither",
    text: "Neither",
    checked: selectedOption === 'neither' || selectedOption === null
  }
]
```

---

## POST Handler Structure

```javascript
router.post('/alternative-to-possession', (req, res) => {
  // Handle Previous
  if (req.body.action === 'previous') {
    return res.redirect('/claims/defendants-circumstances');
  }

  // Handle Cancel
  if (req.body.action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validate (mutual exclusivity check)
  const errors = validateAlternativesToPossession(req.body);

  if (errors.length > 0) {
    return res.render('claims/alternative-to-possession', {
      selectedOption: req.body.alternativesToPossession || 'neither',
      errors
    });
  }

  // Determine selection and update session
  let suspensionOfRightToBuy = false;
  let demotionOfTenancy = false;

  if (req.body.alternativesToPossession === 'suspensionOfRightToBuy') {
    suspensionOfRightToBuy = true;
  } else if (req.body.alternativesToPossession === 'demotionOfTenancy') {
    demotionOfTenancy = true;
  }

  if (!req.session.claim.alternativesToPossession) {
    req.session.claim.alternativesToPossession = {};
  }
  req.session.claim.alternativesToPossession.suspensionOfRightToBuy = suspensionOfRightToBuy;
  req.session.claim.alternativesToPossession.demotionOfTenancy = demotionOfTenancy;

  // Route based on selection
  if (suspensionOfRightToBuy) {
    return res.redirect('/claims/select-housing-act-suspension');
  } else if (demotionOfTenancy) {
    return res.redirect('/claims/select-housing-act-demotion');
  } else {
    return res.redirect('/claims/claiming-costs');
  }
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
- Mutual exclusivity conveyed through radio group nature (only one can be selected at a time)

### Keyboard Navigation
- All radios focusable via Tab
- Arrow keys navigate between radio options
- Enter/Space selects focused radio

---

## Test File Reference

Tests are located at: `prototype/test/routes/alternativesToPossession.test.js`

Run tests with:
```bash
npm test -- --grep "Screen 26"
```

---

## Dependencies

### Placeholder Routes Required
- Screen 25: `/claims/defendants-circumstances` (previous screen)
- Screen 26a: `/claims/select-housing-act-suspension` (conditional next)
- Screen 26c: `/claims/select-housing-act-demotion` (conditional next)
- Screen 28: `/claims/claiming-costs` (default next)

### Session Helper
Add `navigateToAlternativesToPossession` to `prototype/test/helpers/sessionHelper.js`

---

## Comparison with Related Screens

| Aspect | Screen 25 | Screen 26 | Screen 26a | Screen 26c |
|--------|-----------|-----------|-----------|-----------|
| Route | `/defendants-circumstances` | `/alternative-to-possession` | `/select-housing-act-suspension` | `/select-housing-act-demotion` |
| Type | Text input, checkboxes | Radio selection | Radio selection | Radio selection |
| Selection | Multiple possible | Single (mutually exclusive) | Single (required) | Single (required) |
| Optional | No | Yes | No | No |
| Next screen | Screen 26 | Varies (26a, 26c, 28) | Screen 26b | Screen 26d |

---

*Implementation guide created by Nigel (Tester Agent) on 2026-01-29 for Screen 26.*
