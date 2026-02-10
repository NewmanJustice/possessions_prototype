# Implementation Guide — Screen 26a: Housing Act (Suspension of right to buy)

## Overview

This document provides implementation guidance for Claude (Developer Agent) to implement Screen 26a based on the test specifications.

---

## Route Configuration

### Routes to Implement

```javascript
GET  /claims/select-housing-act-suspension
POST /claims/select-housing-act-suspension
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/claims/select-housing-act-suspension.njk`

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
    Select the relevant Housing Act and provide the section reference for the suspension order request.
  </p>

  <form method="post" novalidate>
    <!-- Radio group: suspensionHousingAct -->
    {{ govukRadios({
      name: "suspensionHousingAct",
      fieldset: {
        legend: {
          text: "Which Housing Act does the suspension order relate to?",
          classes: "govuk-fieldset__legend--m"
        }
      },
      items: [
        {
          value: "housing-act-1985",
          text: "Housing Act 1985"
        },
        {
          value: "housing-act-1996",
          text: "Housing Act 1996"
        },
        {
          value: "other",
          text: "Other",
          conditional: {
            html: otherActNameHtml
          }
        }
      ]
    }) }}

    <!-- Section input -->
    {{ govukInput({
      label: {
        text: "Section",
        classes: "govuk-label--m"
      },
      hint: {
        text: "For example, section 121A"
      },
      id: "section",
      name: "section",
      classes: "govuk-input--width-20"
    }) }}

    <!-- Button group: Previous, Continue, Cancel -->
  </form>
{% endblock %}
```

---

## Form Fields

### Radio Group: suspensionHousingAct

| Property | Value |
|----------|-------|
| Name | `suspensionHousingAct` |
| Type | Radio |
| Required | Yes |
| Options | 3 options |

**Option 1:**
- Value: `housing-act-1985`
- Label: `Housing Act 1985`

**Option 2:**
- Value: `housing-act-1996`
- Label: `Housing Act 1996`

**Option 3:**
- Value: `other`
- Label: `Other`
- Conditional: Reveals `housingActOtherName` input

### Text Input: housingActOtherName (Conditional)

| Property | Value |
|----------|-------|
| Name | `housingActOtherName` |
| Type | Text |
| Required | Conditionally (when Other selected) |
| Label | "Name of Housing Act" |
| Visible | Only when "Other" selected |

### Text Input: section

| Property | Value |
|----------|-------|
| Name | `section` |
| Type | Text |
| Required | Yes |
| Max Length | 50 characters |
| Label | "Section" |
| Hint | "For example, section 121A" |
| Width class | `govuk-input--width-20` |

---

## Validation Rules

### Summary Table
| Field | Rule | Error Message | Error Target |
|-------|------|---------------|--------------|
| suspensionHousingAct | Required | "Select the Housing Act" | #suspensionHousingAct |
| housingActOtherName | Required if Other | "Enter the name of the Housing Act" | #housingActOtherName |
| section | Required | "Enter the Housing Act section" | #section |
| section | Max 50 chars | "Enter 50 characters or fewer" | #section |

### Validation Logic
```javascript
function validateSelectHousingActSuspension(body) {
  const errors = [];

  // Housing Act selection required
  if (!body.suspensionHousingAct) {
    errors.push({
      field: 'suspensionHousingAct',
      href: '#suspensionHousingAct',
      text: 'Select the Housing Act'
    });
  }

  // Other name required when Other selected
  if (body.suspensionHousingAct === 'other' && !body.housingActOtherName?.trim()) {
    errors.push({
      field: 'housingActOtherName',
      href: '#housingActOtherName',
      text: 'Enter the name of the Housing Act'
    });
  }

  // Section required
  if (!body.section?.trim()) {
    errors.push({
      field: 'section',
      href: '#section',
      text: 'Enter the Housing Act section'
    });
  } else if (body.section.length > 50) {
    // Section max length
    errors.push({
      field: 'section',
      href: '#section',
      text: 'Enter 50 characters or fewer'
    });
  }

  return errors;
}
```

---

## Session Structure

### Storage Location
```javascript
session.claim.suspensionOrder = {
  housingAct: 'housing-act-1985' | 'housing-act-1996' | 'other',
  housingActOtherName: string | null,
  section: string
}
```

### Session Operations

**On successful POST:**
```javascript
// Ensure suspensionOrder object exists
if (!req.session.claim.suspensionOrder) {
  req.session.claim.suspensionOrder = {};
}

// Store Housing Act selection
req.session.claim.suspensionOrder.housingAct = req.body.suspensionHousingAct;

// Store Other name (only if Other selected, otherwise null)
req.session.claim.suspensionOrder.housingActOtherName =
  req.body.suspensionHousingAct === 'other'
    ? req.body.housingActOtherName
    : null;

// Store section
req.session.claim.suspensionOrder.section = req.body.section;
```

**On GET (pre-population):**
```javascript
const suspensionOrder = req.session.claim?.suspensionOrder || {};
const selectedHousingAct = suspensionOrder.housingAct || null;
const otherActName = suspensionOrder.housingActOtherName || '';
const section = suspensionOrder.section || '';
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
return res.redirect('/claims/reasons-for-suspension');
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

### Inline Error Pattern (Radio)
```javascript
{{ govukRadios({
  name: "suspensionHousingAct",
  errorMessage: errors | getErrorFor('suspensionHousingAct'),
  // ... rest of config
}) }}
```

### Inline Error Pattern (Text Input)
```javascript
{{ govukInput({
  name: "section",
  errorMessage: errors | getErrorFor('section'),
  // ... rest of config
}) }}
```

---

## Conditional Reveal Pattern

### Template Setup
```javascript
{% set otherActNameHtml %}
  {{ govukInput({
    id: "housingActOtherName",
    name: "housingActOtherName",
    label: {
      text: "Name of Housing Act"
    },
    value: otherActName,
    errorMessage: errors | getErrorFor('housingActOtherName')
  }) }}
{% endset %}

{{ govukRadios({
  name: "suspensionHousingAct",
  items: [
    { value: "housing-act-1985", text: "Housing Act 1985" },
    { value: "housing-act-1996", text: "Housing Act 1996" },
    {
      value: "other",
      text: "Other",
      conditional: {
        html: otherActNameHtml
      }
    }
  ]
}) }}
```

---

## Pre-population Logic

### GET Handler
```javascript
router.get('/select-housing-act-suspension', (req, res) => {
  const suspensionOrder = req.session.claim?.suspensionOrder || {};

  res.render('claims/select-housing-act-suspension', {
    selectedHousingAct: suspensionOrder.housingAct || null,
    otherActName: suspensionOrder.housingActOtherName || '',
    section: suspensionOrder.section || '',
    errors: []
  });
});
```

### Template Pre-selection
```javascript
items: [
  {
    value: "housing-act-1985",
    text: "Housing Act 1985",
    checked: selectedHousingAct === 'housing-act-1985'
  },
  {
    value: "housing-act-1996",
    text: "Housing Act 1996",
    checked: selectedHousingAct === 'housing-act-1996'
  },
  {
    value: "other",
    text: "Other",
    checked: selectedHousingAct === 'other',
    conditional: {
      html: otherActNameHtml
    }
  }
]
```

---

## POST Handler Structure

```javascript
router.post('/select-housing-act-suspension', (req, res) => {
  // Handle Previous
  if (req.body.action === 'previous') {
    return res.redirect('/claims/alternative-to-possession');
  }

  // Handle Cancel
  if (req.body.action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validate
  const errors = validateSelectHousingActSuspension(req.body);

  if (errors.length > 0) {
    return res.render('claims/select-housing-act-suspension', {
      selectedHousingAct: req.body.suspensionHousingAct || null,
      otherActName: req.body.housingActOtherName || '',
      section: req.body.section || '',
      errors
    });
  }

  // Save to session
  if (!req.session.claim.suspensionOrder) {
    req.session.claim.suspensionOrder = {};
  }
  req.session.claim.suspensionOrder.housingAct = req.body.suspensionHousingAct;
  req.session.claim.suspensionOrder.housingActOtherName =
    req.body.suspensionHousingAct === 'other'
      ? req.body.housingActOtherName
      : null;
  req.session.claim.suspensionOrder.section = req.body.section;

  // Navigate to next screen
  res.redirect('/claims/reasons-for-suspension');
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
- Text inputs have visible labels
- Error messages linked to field via `aria-describedby`

### Keyboard Navigation
- All radios focusable via Tab
- Arrow keys navigate between radio options
- Enter/Space selects focused radio
- Tab moves to text inputs
- Conditional reveal follows standard GOV.UK accessibility patterns

---

## Test File Reference

Tests are located at: `prototype/test/routes/selectHousingActSuspension.test.js`

Run tests with:
```bash
npm test -- --grep "Screen 26a"
```

---

## Dependencies

### Placeholder Route Required
Screen 26b (`/claims/reasons-for-suspension`) must exist or have a placeholder for navigation tests to pass.

### Session Helper
Add `navigateToSelectHousingActSuspension` to `prototype/test/helpers/sessionHelper.js`

---

## Comparison with Screen 26c

| Aspect | Screen 26a | Screen 26c |
|--------|-----------|-----------|
| Route | `/select-housing-act-suspension` | `/select-housing-act-demotion` |
| Options | 3 (1985, 1996, Other) | 2 (1985 s82A, 1996 s143A) |
| Conditional | Other reveals text input | None |
| Section field | Separate input (required, max 50) | Embedded in labels |
| Session key | `suspensionOrder` | `demotionOrder` |
| Next screen | Screen 26b (reasons) | Screen 26d (express terms) |
| Validation | 4 rules | 1 rule |

---

*Implementation guide created by Nigel (Tester Agent) on 2026-01-28 for Screen 26a.*
