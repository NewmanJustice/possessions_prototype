# Implementation Guide — Screen 26c: Housing Act (Demotion of tenancy)

## Overview

This document provides implementation guidance for Claude (Developer Agent) to implement Screen 26c based on the test specifications.

---

## Route Configuration

### Routes to Implement

```javascript
GET  /claims/select-housing-act-demotion
POST /claims/select-housing-act-demotion
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/claims/select-housing-act-demotion.njk`

### Page Structure
```html
{% extends "layouts/main.njk" %}

{% block pageTitle %}Housing Act{% endblock %}

{% block content %}
  <!-- Error summary (conditional) -->
  <!-- Back link to /claims/alternative-to-possession -->

  <h1 class="govuk-heading-l">Housing Act</h1>

  <!-- Guidance paragraph -->
  <p class="govuk-body">
    Select the relevant Housing Act for the demotion order request.
  </p>

  <form method="post" novalidate>
    <!-- Radio group: demotionHousingAct -->
    {{ govukRadios({
      name: "demotionHousingAct",
      fieldset: {
        legend: {
          text: "Which Housing Act does the demotion order relate to?",
          classes: "govuk-fieldset__legend--m"
        }
      },
      items: [
        {
          value: "housing-act-1985-section-82a",
          text: "Housing Act 1985 (section 82A)"
        },
        {
          value: "housing-act-1996-section-143a",
          text: "Housing Act 1996 (section 143A)"
        }
      ]
    }) }}

    <!-- Button group: Previous, Continue, Cancel -->
  </form>
{% endblock %}
```

---

## Form Fields

### Radio Group: demotionHousingAct

| Property | Value |
|----------|-------|
| Name | `demotionHousingAct` |
| Type | Radio |
| Required | Yes |
| Options | 2 fixed options |

**Option 1:**
- Value: `housing-act-1985-section-82a`
- Label: `Housing Act 1985 (section 82A)`

**Option 2:**
- Value: `housing-act-1996-section-143a`
- Label: `Housing Act 1996 (section 143A)`

---

## Validation Rules

### Required Selection
| Field | Rule | Error Message | Error Target |
|-------|------|---------------|--------------|
| demotionHousingAct | Required | "Select the Housing Act" | #demotionHousingAct |

### Validation Logic
```javascript
function validateSelectHousingActDemotion(body) {
  const errors = [];

  if (!body.demotionHousingAct) {
    errors.push({
      field: 'demotionHousingAct',
      href: '#demotionHousingAct',
      text: 'Select the Housing Act'
    });
  }

  return errors;
}
```

---

## Session Structure

### Storage Location
```javascript
session.claim.demotionOrder = {
  housingAct: 'housing-act-1985-section-82a' | 'housing-act-1996-section-143a' | null
}
```

### Session Operations

**On successful POST:**
```javascript
// Ensure demotionOrder object exists
if (!req.session.claim.demotionOrder) {
  req.session.claim.demotionOrder = {};
}

// Store selection
req.session.claim.demotionOrder.housingAct = req.body.demotionHousingAct;
```

**On GET (pre-population):**
```javascript
const demotionOrder = req.session.claim?.demotionOrder || {};
const selectedHousingAct = demotionOrder.housingAct || null;
```

---

## Navigation Logic

### Previous Button
```javascript
if (req.body.action === 'previous') {
  // Optionally save partial data
  return res.redirect('/claims/alternative-to-possession');
}
```

### Continue Button (Success)
```javascript
// After validation passes and session saved
return res.redirect('/claims/statement-of-express-terms');
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
  name: "demotionHousingAct",
  errorMessage: errors | getErrorFor('demotionHousingAct'),
  // ... rest of config
}) }}
```

---

## Pre-population Logic

### GET Handler
```javascript
router.get('/select-housing-act-demotion', (req, res) => {
  const demotionOrder = req.session.claim?.demotionOrder || {};

  res.render('claims/select-housing-act-demotion', {
    selectedHousingAct: demotionOrder.housingAct || null,
    errors: []
  });
});
```

### Template Pre-selection
```javascript
items: [
  {
    value: "housing-act-1985-section-82a",
    text: "Housing Act 1985 (section 82A)",
    checked: selectedHousingAct === 'housing-act-1985-section-82a'
  },
  {
    value: "housing-act-1996-section-143a",
    text: "Housing Act 1996 (section 143A)",
    checked: selectedHousingAct === 'housing-act-1996-section-143a'
  }
]
```

---

## POST Handler Structure

```javascript
router.post('/select-housing-act-demotion', (req, res) => {
  // Handle Previous
  if (req.body.action === 'previous') {
    return res.redirect('/claims/alternative-to-possession');
  }

  // Handle Cancel
  if (req.body.action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validate
  const errors = validateSelectHousingActDemotion(req.body);

  if (errors.length > 0) {
    return res.render('claims/select-housing-act-demotion', {
      selectedHousingAct: req.body.demotionHousingAct || null,
      errors
    });
  }

  // Save to session
  if (!req.session.claim.demotionOrder) {
    req.session.claim.demotionOrder = {};
  }
  req.session.claim.demotionOrder.housingAct = req.body.demotionHousingAct;

  // Navigate to next screen
  res.redirect('/claims/statement-of-express-terms');
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

Tests are located at: `prototype/test/routes/selectHousingActDemotion.test.js`

Run tests with:
```bash
npm test -- --grep "Screen 26c"
```

---

## Dependencies

### Placeholder Route Required
Screen 26d (`/claims/statement-of-express-terms`) must exist or have a placeholder for navigation tests to pass.

### Session Helper
Add `navigateToSelectHousingActDemotion` to `prototype/test/helpers/sessionHelper.js`

---

## Comparison with Screen 26a

| Aspect | Screen 26a | Screen 26c |
|--------|-----------|-----------|
| Route | `/select-housing-act-suspension` | `/select-housing-act-demotion` |
| Options | 3 (1985, 1996, Other) | 2 (1985 s82A, 1996 s143A) |
| Conditional | Other reveals text input | None |
| Section field | Separate input | Embedded in labels |
| Session key | `suspensionOrder` | `demotionOrder` |
| Next screen | Screen 26b (reasons) | Screen 26d (express terms) |

---

*Implementation guide created by Nigel (Tester Agent) on 2026-01-28 for Screen 26c.*
