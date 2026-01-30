# Implementation Guide — Screen 29: Additional Reasons for Possession

## Overview

This document provides implementation guidance for Claude (Developer Agent) to implement Screen 29 based on the test specifications.

---

## Route Configuration

### Routes to Implement

```javascript
GET  /claims/additional-reasons-for-possession
POST /claims/additional-reasons-for-possession
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/claims/additional-reasons-for-possession.njk`

### Page Structure
```html
{% extends "layouts/main.njk" %}

{% block pageTitle %}Additional reasons for possession{% endblock %}

{% block content %}
  <!-- Error summary (conditional) -->
  <!-- Case number display -->

  <h1 class="govuk-heading-l">Additional reasons for possession</h1>

  <form method="post" novalidate>
    <!-- Radio group: hasAdditionalReasons -->
    {{ govukRadios({
      name: "hasAdditionalReasons",
      fieldset: {
        legend: {
          text: "Is there any other information you'd like to provide about your reasons for possession?",
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

    <!-- Conditional textarea: additionalReasonsText -->
    <!-- Revealed when hasAdditionalReasons === 'yes' -->
    {% if hasAdditionalReasons === 'yes' %}
    {{ govukTextarea({
      name: "additionalReasonsText",
      label: {
        text: "Additional reasons for possession"
      },
      hint: {
        text: "You can enter up to 6400 characters"
      },
      value: additionalReasonsText || '',
      attributes: {
        maxlength: 6400
      }
    }) }}
    {% endif %}

    <!-- Button group: Previous, Continue, Cancel -->
  </form>
{% endblock %}
```

---

## Form Fields

### Radio Group: hasAdditionalReasons

| Property | Value |
|----------|-------|
| Name | `hasAdditionalReasons` |
| Type | Radio |
| Required | Yes |
| Options | 2 fixed options |

**Option 1:**
- Value: `yes`
- Label: `Yes`

**Option 2:**
- Value: `no`
- Label: `No`

### Textarea: additionalReasonsText

| Property | Value |
|----------|-------|
| Name | `additionalReasonsText` |
| Type | Textarea |
| Required | No (optional even when Yes selected) |
| Max length | 6400 characters |
| Visible when | `hasAdditionalReasons === 'yes'` |

**Label:** `Additional reasons for possession`

**Hint:** `You can enter up to 6400 characters`

---

## Validation Rules

### Required Selection
| Field | Rule | Error Message | Error Target |
|-------|------|---------------|--------------|
| hasAdditionalReasons | Required | "Select yes if you would like to provide additional reasons for possession" | #hasAdditionalReasons |

### Validation Logic
```javascript
function validateAdditionalReasons(body) {
  const errors = [];

  if (!body.hasAdditionalReasons) {
    errors.push({
      field: 'hasAdditionalReasons',
      href: '#hasAdditionalReasons',
      text: 'Select yes if you would like to provide additional reasons for possession'
    });
  }

  // Character limit validation (frontend enforces via maxlength, but validate on backend)
  if (body.additionalReasonsText && body.additionalReasonsText.length > 6400) {
    errors.push({
      field: 'additionalReasonsText',
      href: '#additionalReasonsText',
      text: 'Additional reasons must be 6400 characters or fewer'
    });
  }

  return errors;
}
```

---

## Session Structure

### Storage Location
```javascript
session.claim.additionalReasons = {
  hasAdditionalReasons: 'yes' | 'no' | null,
  additionalReasonsText: 'text' | null
}
```

### Session Operations

**On successful POST:**
```javascript
// Store selection and text
req.session.claim.additionalReasons = {
  hasAdditionalReasons: req.body.hasAdditionalReasons,
  additionalReasonsText: req.body.additionalReasonsText || null
};
```

**On GET (pre-population):**
```javascript
const additionalReasons = req.session.claim?.additionalReasons || {
  hasAdditionalReasons: null,
  additionalReasonsText: null
};
const hasAdditionalReasons = additionalReasons.hasAdditionalReasons;
const additionalReasonsText = additionalReasons.additionalReasonsText;
```

---

## Navigation Logic

### Previous Button
```javascript
if (req.body.action === 'previous') {
  // Data already in session, preserved
  return res.redirect('/claims/claiming-costs');
}
```

### Continue Button (Success)
```javascript
// After validation passes and session saved
return res.redirect('/claims/check-answers'); // TBD - placeholder
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
  name: "hasAdditionalReasons",
  errorMessage: errors | getErrorFor('hasAdditionalReasons'),
  // ... rest of config
}) }}
```

---

## Pre-population Logic

### GET Handler
```javascript
router.get('/additional-reasons-for-possession', (req, res) => {
  const additionalReasons = req.session.claim?.additionalReasons || {
    hasAdditionalReasons: null,
    additionalReasonsText: null
  };

  res.render('claims/additional-reasons-for-possession', {
    hasAdditionalReasons: additionalReasons.hasAdditionalReasons,
    additionalReasonsText: additionalReasons.additionalReasonsText,
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
    checked: hasAdditionalReasons === 'yes'
  },
  {
    value: "no",
    text: "No",
    checked: hasAdditionalReasons === 'no'
  }
]
```

### Textarea Pre-fill
```javascript
{{ govukTextarea({
  name: "additionalReasonsText",
  label: { text: "Additional reasons for possession" },
  hint: { text: "You can enter up to 6400 characters" },
  value: additionalReasonsText || '',
  attributes: { maxlength: 6400 }
}) }}
```

---

## POST Handler Structure

```javascript
router.post('/additional-reasons-for-possession', (req, res) => {
  // Handle Previous
  if (req.body.action === 'previous') {
    return res.redirect('/claims/claiming-costs');
  }

  // Handle Cancel
  if (req.body.action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validate
  const errors = validateAdditionalReasons(req.body);

  if (errors.length > 0) {
    return res.render('claims/additional-reasons-for-possession', {
      hasAdditionalReasons: req.body.hasAdditionalReasons || null,
      additionalReasonsText: req.body.additionalReasonsText || null,
      errors
    });
  }

  // Save to session
  req.session.claim.additionalReasons = {
    hasAdditionalReasons: req.body.hasAdditionalReasons,
    additionalReasonsText: req.body.additionalReasonsText || null
  };

  // Navigate to next screen
  res.redirect('/claims/check-answers'); // TBD - placeholder
});
```

---

## Conditional Textarea Reveal

The textarea is revealed/hidden via JavaScript based on the `hasAdditionalReasons` radio selection. The template conditionally includes the textarea when `hasAdditionalReasons === 'yes'`.

### Frontend Enhancement (Optional but Recommended)
```javascript
// Client-side conditional reveal
document.querySelectorAll('input[name="hasAdditionalReasons"]').forEach(radio => {
  radio.addEventListener('change', function() {
    const textarea = document.getElementById('additionalReasonsText');
    if (this.value === 'yes') {
      textarea?.parentElement?.style.display = 'block';
    } else {
      textarea?.parentElement?.style.display = 'none';
    }
  });
});
```

### Text Retention
When user switches between Yes and No, the text previously entered is retained in session and will be re-displayed if user switches back to Yes.

---

## Character Limit

### Frontend Enforcement
```html
<textarea
  name="additionalReasonsText"
  maxlength="6400"
  ...
></textarea>
```

### Backend Validation
Validate in `validateAdditionalReasons()` that text does not exceed 6400 characters.

### Character Counter (Optional)
Consider adding a GOV.UK character counter component for enhanced UX.

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
- Textarea hint text properly associated

### Keyboard Navigation
- All radios focusable via Tab
- Arrow keys navigate between radio options
- Enter/Space selects focused radio
- Textarea focusable and keyboard accessible

---

## Test File Reference

Tests are located at: `prototype/test/routes/additionalReasons.test.js`

Run tests with:
```bash
npm test -- --grep "Screen 29"
```

---

## Dependencies

### Placeholder Route Required
A placeholder route `/claims/check-answers` must be created to handle the Continue navigation, as the next screen (Screen 30) is TBD.

### Session Helper
Add `navigateToAdditionalReasons` to `prototype/test/helpers/sessionHelper.js`

---

## Case Number Display

The case number should be displayed at the top of the page. Retrieve it from:
```javascript
req.session.claim?.caseNumber || ''
```

Display in template using appropriate GOV.UK caption styling.

---

## Comparison with Screen 28

| Aspect | Screen 28 | Screen 29 |
|--------|-----------|----------|
| Route | `/claims/claiming-costs` | `/claims/additional-reasons-for-possession` |
| Question | "Do you want to ask for your costs back?" | "Is there any other information you'd like to provide about your reasons for possession?" |
| Field type | Simple radio (yes/no) | Radio with conditional textarea |
| Textarea | None | Optional (revealed when Yes) |
| Max length | N/A | 6400 characters |
| Session key | `claimingCosts` | `additionalReasons` (object with 2 properties) |
| Session structure | String (`yes`\|`no`\|null) | Object: `{ hasAdditionalReasons, additionalReasonsText }` |
| Previous screen | Screen 27 | Screen 28 |
| Next screen | Screen 29 | Screen 30 (TBD) |

---

*Implementation guide created by Nigel (Tester Agent) on 2026-01-29 for Screen 29.*
