# Implementation Guide — Screen 26b: Reasons for requesting a suspension order

## Overview

This document provides implementation guidance for Claude (Developer Agent) to implement Screen 26b based on the test specifications.

---

## Route Configuration

### Routes to Implement

```javascript
GET  /claims/reasons-for-suspension
POST /claims/reasons-for-suspension
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/claims/reasons-for-suspension.njk`

### Page Structure
```html
{% extends "layouts/main.njk" %}

{% block pageTitle %}Reasons for requesting a suspension order{% endblock %}

{% block content %}
  <!-- Error summary (conditional) -->
  <!-- Back link to /claims/alternative-to-possession -->

  <h1 class="govuk-heading-l">Reasons for requesting a suspension order</h1>

  <!-- Guidance paragraph -->
  <p class="govuk-body">
    Explain why a suspension of the right to buy is being requested.
    The court will use this information to consider whether a suspension order is appropriate.
  </p>

  <form method="post" novalidate>
    <!-- Textarea with character count -->
    {{ govukCharacterCount({
      name: "reasons",
      id: "reasons",
      maxlength: 950,
      label: {
        text: "Explain the reasons for requesting a suspension order",
        classes: "govuk-label--m"
      },
      value: reasons,
      errorMessage: errors | getErrorFor('reasons')
    }) }}

    <!-- Button group: Previous, Continue, Cancel -->
  </form>
{% endblock %}
```

---

## Form Fields

### Textarea: reasons

| Property | Value |
|----------|-------|
| Name | `reasons` |
| ID | `reasons` |
| Type | Textarea (character count) |
| Required | No (optional) |
| Max Length | 950 characters |
| Label | "Explain the reasons for requesting a suspension order" |

---

## Validation Rules

### Summary Table
| Field | Rule | Error Message | Error Target |
|-------|------|---------------|--------------|
| reasons | Max 950 chars | "Enter 950 characters or fewer" | #reasons |

Note: No required validation - field is optional.

### Validation Logic
```javascript
function validateReasonsForSuspension(body) {
  const errors = [];

  // Check max length (only if text is provided)
  if (body.reasons && body.reasons.length > 950) {
    errors.push({
      field: 'reasons',
      href: '#reasons',
      text: 'Enter 950 characters or fewer'
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
  // ... existing fields from Screen 26a (if any)
  reasons: string | null
}
```

### Session Operations

**On successful POST:**
```javascript
// Ensure suspensionOrder object exists
if (!req.session.claim.suspensionOrder) {
  req.session.claim.suspensionOrder = {};
}

// Store reasons (null if empty, string if provided)
const reasons = req.body.reasons?.trim() || null;
req.session.claim.suspensionOrder.reasons = reasons;
```

**On GET (pre-population):**
```javascript
const suspensionOrder = req.session.claim?.suspensionOrder || {};
const reasons = suspensionOrder.reasons || '';
```

---

## Navigation Logic

### Previous Button
```javascript
if (req.body.action === 'previous') {
  // No validation needed
  return res.redirect('/claims/alternative-to-possession');
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

### Inline Error Pattern (Textarea)
```javascript
{{ govukCharacterCount({
  name: "reasons",
  errorMessage: errors | getErrorFor('reasons'),
  // ... rest of config
}) }}
```

---

## Pre-population Logic

### GET Handler
```javascript
router.get('/reasons-for-suspension', (req, res) => {
  const suspensionOrder = req.session.claim?.suspensionOrder || {};

  res.render('claims/reasons-for-suspension', {
    reasons: suspensionOrder.reasons || '',
    errors: []
  });
});
```

---

## POST Handler Structure

```javascript
router.post('/reasons-for-suspension', (req, res) => {
  // Handle Previous
  if (req.body.action === 'previous') {
    return res.redirect('/claims/alternative-to-possession');
  }

  // Handle Cancel
  if (req.body.action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validate
  const errors = validateReasonsForSuspension(req.body);

  if (errors.length > 0) {
    return res.render('claims/reasons-for-suspension', {
      reasons: req.body.reasons || '',
      errors
    });
  }

  // Save to session
  if (!req.session.claim.suspensionOrder) {
    req.session.claim.suspensionOrder = {};
  }

  // Store as null if empty, string otherwise
  const reasons = req.body.reasons?.trim() || null;
  req.session.claim.suspensionOrder.reasons = reasons;

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
- Textarea has visible label text
- Error messages linked to field via `aria-describedby`
- Character count announced appropriately

### Keyboard Navigation
- Textarea focusable via Tab
- Standard textarea keyboard interactions

---

## Test File Reference

Tests are located at: `prototype/test/routes/reasonsForSuspension.test.js`

Run tests with:
```bash
npm test -- --grep "Screen 26b"
```

---

## Dependencies

### Session Helper
Add `navigateToReasonsForSuspension` to `prototype/test/helpers/sessionHelper.js`

The navigation helper should build on `navigateToSelectHousingActSuspension` which already exists.

---

## Comparison with Similar Screens

| Aspect | Screen 26b | Screen 29 (Additional Reasons) |
|--------|-----------|-------------------------------|
| Route | `/reasons-for-suspension` | `/additional-reasons-for-possession` |
| Field type | Textarea only | Radio + conditional textarea |
| Required | No | Yes (radio), No (textarea) |
| Max chars | 950 | 1000 (if applicable) |
| Session key | `suspensionOrder.reasons` | `additionalReasons` |
| Previous | Screen 26 | Screen 28 |

---

## Key Implementation Notes

1. **Optional field:** Do not add "required" validation - empty submission is valid
2. **Null storage:** Store `null` when field is empty, not empty string
3. **Preserve existing data:** Use object spread/merge to not overwrite other `suspensionOrder` fields
4. **Character count:** Use GOV.UK character count component for better UX
5. **Simple screen:** This is intentionally simple - single textarea, one validation rule

---

*Implementation guide created by Nigel (Tester Agent) on 2026-02-02 for Screen 26b.*
