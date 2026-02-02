# Implementation Guide — Screen 32: Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture

## Overview

This document provides implementation guidance for Claude (Developer Agent) to implement Screen 32 based on the test specifications.

---

## Route Configuration

### Routes to Implement

```javascript
GET  /claims/underlessee-mortgagee-forfeiture-relief
POST /claims/underlessee-mortgagee-forfeiture-relief
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/pages/claims/underlessee-mortgagee-forfeiture-relief.njk`

### Page Structure
```html
{% extends "layouts/main.njk" %}

{% block pageTitle %}Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture{% endblock %}

{% block content %}
  <!-- Error summary (conditional) -->
  <!-- Caption: "Make a claim" -->
  <!-- Case number display -->

  <h1 class="govuk-heading-l">Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture</h1>

  <form method="post" novalidate>
    {{ govukRadios({
      name: "hasUnderlesseeOrMortgageeForRelief",
      fieldset: {
        legend: {
          text: "Is there an underlessee or mortgagee entitled to claim relief against forfeiture?",
          classes: "govuk-fieldset__legend--m"
        }
      },
      items: [
        { value: "yes", text: "Yes" },
        { value: "no", text: "No" }
      ]
    }) }}

    <!-- Button group: Previous, Continue, Cancel -->
  </form>
{% endblock %}
```

---

## Form Fields

### Radio Group: hasUnderlesseeOrMortgageeForRelief

| Property | Value |
|----------|-------|
| Name | `hasUnderlesseeOrMortgageeForRelief` |
| Type | Radio |
| Required | Yes |
| Options | 2 fixed options |

---

## Validation Rules

### Required Selection
| Field | Rule | Error Message | Error Target |
|-------|------|---------------|--------------|
| hasUnderlesseeOrMortgageeForRelief | Required | "Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture" | #hasUnderlesseeOrMortgageeForRelief |

---

## Session Structure

### Storage Location
```javascript
session.claim.forfeitureRelief = {
  hasUnderlesseeOrMortgageeForRelief: 'yes' | 'no' | null
}
```

---

## Navigation Logic

### Previous Button (Dynamic)
```javascript
if (req.body.action === 'previous') {
  // Check which path the user came from
  const hasUnderlesseeOrMortgagee = req.session.claim?.underlesseeOrMortgagee?.hasUnderlesseeOrMortgagee;
  
  if (hasUnderlesseeOrMortgagee === 'yes') {
    // Came via Screen 31 (underlessee/mortgagee details)
    return res.redirect('/claims/underlessee-or-mortgagee-details');
  } else {
    // Came via Screen 30 (skipped Screen 31)
    return res.redirect('/claims/underlessee-or-mortgagee');
  }
}
```

### Continue Button (Conditional)
```javascript
// After validation passes
const selection = req.body.hasUnderlesseeOrMortgageeForRelief;

if (selection === 'yes') {
  return res.redirect('/claims/upload-additional-document');
} else {
  return res.redirect('/claims/applications');
}
```

### Cancel Button
```javascript
if (req.body.action === 'cancel') {
  return res.redirect('/case-list');
}
```

---

## POST Handler Structure

```javascript
router.post('/underlessee-mortgagee-forfeiture-relief', (req, res) => {
  // Handle Previous (dynamic)
  if (req.body.action === 'previous') {
    const hasUnderlesseeOrMortgagee = req.session.claim?.underlesseeOrMortgagee?.hasUnderlesseeOrMortgagee;
    if (hasUnderlesseeOrMortgagee === 'yes') {
      return res.redirect('/claims/underlessee-or-mortgagee-details');
    }
    return res.redirect('/claims/underlessee-or-mortgagee');
  }

  // Handle Cancel
  if (req.body.action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validate
  const errors = [];
  if (!req.body.hasUnderlesseeOrMortgageeForRelief) {
    errors.push({
      field: 'hasUnderlesseeOrMortgageeForRelief',
      href: '#hasUnderlesseeOrMortgageeForRelief',
      text: 'Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture'
    });
  }

  if (errors.length > 0) {
    return res.render('pages/claims/underlessee-mortgagee-forfeiture-relief', {
      hasUnderlesseeOrMortgageeForRelief: req.body.hasUnderlesseeOrMortgageeForRelief || null,
      errors
    });
  }

  // Initialize session object if needed
  if (!req.session.claim.forfeitureRelief) {
    req.session.claim.forfeitureRelief = {};
  }

  // Save to session
  req.session.claim.forfeitureRelief.hasUnderlesseeOrMortgageeForRelief = req.body.hasUnderlesseeOrMortgageeForRelief;

  // Navigate based on selection
  if (req.body.hasUnderlesseeOrMortgageeForRelief === 'yes') {
    return res.redirect('/claims/upload-additional-document');
  }
  return res.redirect('/claims/applications');
});
```

---

## Test File Reference

Tests are located at: `prototype/test/routes/underlesseeMortgageeForfeitureRelief.test.js`

Run tests with:
```bash
npm test -- --grep "Screen 32"
```

---

## Navigation Helper

Add to `prototype/test/helpers/sessionHelper.js`:
- `navigateToUnderlesseeMortgageeForfeitureRelief(agent)` - navigates via Screen 30 "No" path
- `navigateToUnderlesseeMortgageeForfeitureReliefViaDetails(agent)` - navigates via Screen 31 path

---

*Implementation guide created by Nigel (Tester Agent) for Screen 32.*
