# Implementation Guide — Screen 26d: Statement of express terms

## Overview

This document provides implementation guidance for Claude (Developer Agent) to implement Screen 26d based on the test specifications.

---

## Route Configuration

### Routes to Implement

```javascript
GET  /claims/statement-of-express-terms
POST /claims/statement-of-express-terms
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/claims/statement-of-express-terms.njk`

### Page Structure
```html
{% extends "layouts/main.njk" %}

{% block pageTitle %}Statement of express terms{% endblock %}

{% block content %}
  <!-- Error summary (conditional) -->
  <!-- Back link to /claims/select-housing-act-demotion -->

  <h1 class="govuk-heading-l">Statement of express terms</h1>

  <!-- Guidance paragraph -->
  <p class="govuk-body">
    This is a statutory requirement under the Housing Act.
  </p>

  <form method="post" novalidate>
    <!-- Radio group: expressTermsServed -->
    {{ govukRadios({
      name: "expressTermsServed",
      fieldset: {
        legend: {
          text: "Have you served the defendants with a statement of the express terms which will apply to the demoted tenancy?",
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

    <!-- Conditional textarea: expressTermsDetails -->
    {% if selectedExpressTerms === 'yes' or formData.expressTermsServed === 'yes' %}
      {{ govukTextarea({
        name: "expressTermsDetails",
        label: {
          text: "Provide details of how you served the statement"
        },
        hint: {
          text: "This is optional"
        },
        value: expressTermsDetails or '',
        rows: 5,
        attributes: {
          maxlength: 2000
        }
      }) }}
    {% endif %}

    <!-- Button group: Previous, Continue, Cancel -->
  </form>
{% endblock %}
```

---

## Form Fields

### Radio Group: expressTermsServed

| Property | Value |
|----------|-------|
| Name | `expressTermsServed` |
| Type | Radio |
| Required | Yes |
| Options | 2 fixed options |

**Option 1:**
- Value: `yes`
- Label: `Yes`

**Option 2:**
- Value: `no`
- Label: `No`

### Textarea: expressTermsDetails

| Property | Value |
|----------|-------|
| Name | `expressTermsDetails` |
| Type | Textarea (multi-line) |
| Required | No (conditional on Yes selection) |
| Max length | 2000 characters |
| Rows | 5 |
| Visibility | Shown when `expressTermsServed === 'yes'` |

---

## Validation Rules

### Required Selection
| Field | Rule | Error Message | Error Target |
|-------|------|---------------|--------------|
| expressTermsServed | Required | "Select yes if you have served the statement of express terms" | #expressTermsServed |

### Validation Logic
```javascript
function validateStatementOfExpressTerms(body) {
  const errors = [];

  if (!body.expressTermsServed) {
    errors.push({
      field: 'expressTermsServed',
      href: '#expressTermsServed',
      text: 'Select yes if you have served the statement of express terms'
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
  housingAct: 'housing-act-1985-section-82a' | 'housing-act-1996-section-143a' | null,
  statementOfExpressTerms: 'yes' | 'no' | null,
  statementOfExpressTermsDetails: 'text' | null
}
```

### Session Operations

**On successful POST:**
```javascript
// Ensure demotionOrder object exists
if (!req.session.claim.demotionOrder) {
  req.session.claim.demotionOrder = {};
}

// Store selection and optional details
req.session.claim.demotionOrder.statementOfExpressTerms = req.body.expressTermsServed;
req.session.claim.demotionOrder.statementOfExpressTermsDetails = req.body.expressTermsServed === 'yes' ? (req.body.expressTermsDetails || null) : null;
```

**On GET (pre-population):**
```javascript
const demotionOrder = req.session.claim?.demotionOrder || {};
const selectedExpressTerms = demotionOrder.statementOfExpressTerms || null;
const expressTermsDetails = demotionOrder.statementOfExpressTermsDetails || '';
```

---

## Navigation Logic

### Previous Button
```javascript
if (req.body.action === 'previous') {
  // Optionally save partial data
  return res.redirect('/claims/select-housing-act-demotion');
}
```

### Continue Button (Success)
```javascript
// After validation passes and session saved
return res.redirect('/claims/claiming-costs');
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
  name: "expressTermsServed",
  errorMessage: errors | getErrorFor('expressTermsServed'),
  // ... rest of config
}) }}
```

---

## Pre-population Logic

### GET Handler
```javascript
router.get('/statement-of-express-terms', (req, res) => {
  const demotionOrder = req.session.claim?.demotionOrder || {};

  res.render('claims/statement-of-express-terms', {
    selectedExpressTerms: demotionOrder.statementOfExpressTerms || null,
    expressTermsDetails: demotionOrder.statementOfExpressTermsDetails || '',
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
    checked: selectedExpressTerms === 'yes'
  },
  {
    value: "no",
    text: "No",
    checked: selectedExpressTerms === 'no'
  }
]
```

### Conditional Textarea Visibility
```html
{% if selectedExpressTerms === 'yes' or formData.expressTermsServed === 'yes' %}
  <!-- Textarea renders here -->
{% endif %}
```

---

## POST Handler Structure

```javascript
router.post('/statement-of-express-terms', (req, res) => {
  // Handle Previous
  if (req.body.action === 'previous') {
    return res.redirect('/claims/select-housing-act-demotion');
  }

  // Handle Cancel
  if (req.body.action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validate
  const errors = validateStatementOfExpressTerms(req.body);

  if (errors.length > 0) {
    return res.render('claims/statement-of-express-terms', {
      selectedExpressTerms: req.body.expressTermsServed || null,
      expressTermsDetails: req.body.expressTermsServed === 'yes' ? (req.body.expressTermsDetails || '') : '',
      errors
    });
  }

  // Save to session
  if (!req.session.claim.demotionOrder) {
    req.session.claim.demotionOrder = {};
  }
  req.session.claim.demotionOrder.statementOfExpressTerms = req.body.expressTermsServed;
  req.session.claim.demotionOrder.statementOfExpressTermsDetails = req.body.expressTermsServed === 'yes' ? (req.body.expressTermsDetails || null) : null;

  // Navigate to next screen
  res.redirect('/claims/claiming-costs');
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
- Textarea has associated label

### Keyboard Navigation
- All radios focusable via Tab
- Arrow keys navigate between radio options
- Enter/Space selects focused radio
- Textarea focusable and navigable

### Conditional Display Accessibility
- Textarea is hidden when not selected; still accessible in DOM but not displayed
- Selection change triggers textarea display/hide
- Focus is retained appropriately on field changes

---

## Client-Side Conditional Logic

### JavaScript for Dynamic Textarea Toggle
```javascript
document.addEventListener('DOMContentLoaded', function() {
  const radioButtons = document.querySelectorAll('input[name="expressTermsServed"]');
  const textareaContainer = document.querySelector('[id="expressTermsDetails"]')?.closest('.govuk-form-group');

  function toggleTextarea() {
    const selectedValue = document.querySelector('input[name="expressTermsServed"]:checked')?.value;
    if (textareaContainer) {
      textareaContainer.style.display = selectedValue === 'yes' ? 'block' : 'none';
    }
  }

  radioButtons.forEach(radio => {
    radio.addEventListener('change', toggleTextarea);
  });

  // Initial state on page load
  toggleTextarea();
});
```

---

## Test File Reference

Tests are located at: `prototype/test/routes/statementOfExpressTerms.test.js`

Run tests with:
```bash
npm test -- --grep "Screen 26d"
```

---

## Dependencies

### Required Routes
Screen 26c (`/claims/select-housing-act-demotion`) must exist and set `demotionOrder.housingAct` before this screen is accessed.

Screen 28 (`/claims/claiming-costs`) must exist or have a placeholder for navigation tests to pass.

### Session Helper
Add `navigateToStatementOfExpressTerms` to `prototype/test/helpers/sessionHelper.js`

---

## Comparison with Screen 26b (Suspension Reason)

| Aspect | Screen 26b | Screen 26d |
|--------|-----------|-----------|
| Route | `/select-suspension-reason` | `/statement-of-express-terms` |
| Previous screen | `/select-housing-act-suspension` | `/select-housing-act-demotion` |
| Question type | Checkbox group | Radio group with conditional textarea |
| Conditional field | Reveal text input on "Other" | Reveal textarea on "Yes" |
| Session key | `suspensionOrder` | `demotionOrder` |
| Next screen | `/claiming-costs` | `/claiming-costs` |
| Field names | `reasonsForSuspension` + conditional | `expressTermsServed` + `expressTermsDetails` |

---

## Comparison with Screen 26a (Suspension Housing Act)

| Aspect | Screen 26a | Screen 26d |
|--------|-----------|-----------|
| Route | `/select-housing-act-suspension` | `/statement-of-express-terms` |
| Form type | Radio selection only | Radio with conditional textarea |
| Session namespace | `suspensionOrder` | `demotionOrder` |
| Next screen | Screen 26b (reasons) | Screen 28 (costs) |
| Conditional logic | Reveal on "Other" | Reveal on "Yes" |

---

*Implementation guide created by Nigel (Tester Agent) on 2026-01-29 for Screen 26d.*
