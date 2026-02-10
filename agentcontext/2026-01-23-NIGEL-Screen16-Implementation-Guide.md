# Screen 16 Implementation Guide - Pre-action Protocol

**Date:** 2026-01-23  
**Author:** Nigel (Tester Agent)  
**For:** Claude (Developer Agent)  
**User Story:** `businessArtifacts/userstories/screen16.txt`

---

## Overview

Screen 16 captures declarative confirmation about whether the solicitor has followed the pre-action protocol before making a possession claim. Both Yes/No answers lead to the same next screen (mediation-settlement), but the stored value is retained for downstream consideration.

**Complexity:** ⭐ Simple — Standard GOV.UK radio pattern with convergent routing

---

## Changes Required

### 1. Create new route handler
**File:** `prototype/src/app/routes/preActionProtocol.js` (new file)

### 2. Create template
**File:** `prototype/src/app/views/preActionProtocol.njk` (new file)

### 3. Register route
**File:** `prototype/src/app/app.js`

### 4. Create placeholder route
**File:** `prototype/src/app/routes/mediationSettlement.js` (temporary placeholder)

---

## Route Handler Implementation

Create `prototype/src/app/routes/preActionProtocol.js`:

```javascript
const express = require('express');
const router = express.Router();

// GET /claims/preaction-protocol
router.get('/claims/preaction-protocol', (req, res) => {
  // Ensure session initialized
  if (!req.session.claim) {
    return res.redirect('/claims/start');
  }

  // Initialize preActionProtocol if needed
  if (!req.session.claim.preActionProtocol) {
    req.session.claim.preActionProtocol = {};
  }

  // Get previously selected value (if any)
  const followed = req.session.claim.preActionProtocol.followed;

  res.render('preActionProtocol', {
    followed: followed,
    errors: req.session.errors || {}
  });

  // Clear errors after rendering
  delete req.session.errors;
});

// POST /claims/preaction-protocol
router.post('/claims/preaction-protocol', (req, res) => {
  const { followed } = req.body;

  // Validation: AC-3
  if (!followed) {
    req.session.errors = {
      followed: {
        text: 'Select whether you have followed the pre-action protocol'
      }
    };
    return res.redirect('/claims/preaction-protocol');
  }

  // Initialize if needed
  if (!req.session.claim.preActionProtocol) {
    req.session.claim.preActionProtocol = {};
  }

  // Store answer: AC-4, AC-5
  req.session.claim.preActionProtocol.followed = (followed === 'true');

  // Both paths converge: AC-4, AC-5
  res.redirect('/claims/mediation-settlement');
});

module.exports = router;
```

---

## Template Implementation

Create `prototype/src/app/views/preActionProtocol.njk`:

```njk
{% extends "layout.njk" %}

{% block pageTitle %}
  Pre-action protocol - HMCTS Possessions
{% endblock %}

{% block beforeContent %}
  {{ govukBackLink({
    text: "Previous",
    href: "/claims/grounds-for-possession-assured-confirmation"
  }) }}
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">

      {% if errors.followed %}
        {{ govukErrorSummary({
          titleText: "There is a problem",
          errorList: [
            {
              text: errors.followed.text,
              href: "#followed"
            }
          ],
          attributes: {
            tabindex: "-1"
          }
        }) }}
      {% endif %}

      <h1 class="govuk-heading-l">Pre-action protocol</h1>

      {# AC-1: Guidance text #}
      <div class="govuk-inset-text">
        Registered providers of social housing should follow the pre-action protocol before making a possession claim.
      </div>

      <p class="govuk-body">
        Where the claim is on the grounds of rent arrears, you should have:
      </p>
      <ul class="govuk-list govuk-list--bullet">
        <li>contacted the tenant to discuss the arrears</li>
        <li>provided information about the arrears</li>
        <li>considered any offer of payment</li>
        <li>given the tenant time to seek advice</li>
      </ul>

      {# AC-1: Warning message #}
      {{ govukWarningText({
        text: "The case could be delayed or rejected if the pre-action protocol has not been followed.",
        iconFallbackText: "Warning"
      }) }}

      <form method="post" action="/claims/preaction-protocol">

        {# AC-2: Radio question #}
        {{ govukRadios({
          name: "followed",
          fieldset: {
            legend: {
              text: "Have you followed the pre-action protocol?",
              classes: "govuk-fieldset__legend--m"
            }
          },
          items: [
            {
              value: "true",
              text: "Yes",
              checked: followed === true
            },
            {
              value: "false",
              text: "No",
              checked: followed === false
            }
          ],
          errorMessage: errors.followed if errors.followed
        }) }}

        <div class="govuk-button-group">
          {{ govukButton({
            text: "Continue"
          }) }}
          
          <a class="govuk-link" href="/case-list">Cancel</a>
        </div>
      </form>

    </div>
  </div>
{% endblock %}
```

---

## Register Route

Update `prototype/src/app/app.js`:

```javascript
// Add with other route imports
const preActionProtocolRoute = require('./routes/preActionProtocol');

// Add with other route registrations
app.use('/', preActionProtocolRoute);
```

---

## Placeholder Route (Temporary)

Create `prototype/src/app/routes/mediationSettlement.js`:

```javascript
const express = require('express');
const router = express.Router();

// Temporary placeholder for Screen TBD: Mediation settlement
router.get('/claims/mediation-settlement', (req, res) => {
  res.send('<h1>Placeholder: Mediation Settlement</h1><p>This screen will be implemented later.</p>');
});

module.exports = router;
```

Register in `app.js`:
```javascript
const mediationSettlementRoute = require('./routes/mediationSettlement');
app.use('/', mediationSettlementRoute);
```

---

## Session Data Structure

After successful submission:

```javascript
session.claim.preActionProtocol = {
  followed: true | false
}
```

**Key points:**
- Store boolean value (convert string to boolean)
- Both Yes/No store a value (not just Yes)
- Previous answer overwrites (no appending)

---

## Navigation Flow

```
Screen 13.1.1 (No additional grounds)
  ↓
Screen 16 (Pre-action Protocol)
  ├─ Yes → /claims/mediation-settlement
  └─ No  → /claims/mediation-settlement

Previous → /claims/grounds-for-possession-assured-confirmation (Screen 13.1)
Cancel → /case-list
```

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| followed | Required | "Select whether you have followed the pre-action protocol" |

**Validation behavior:**
- Check on POST only
- Store error in session
- Redirect back to GET (PRG pattern)
- Display GOV.UK error summary + inline error
- Clear error after rendering

---

## Test Execution

Run the test file:
```bash
cd prototype
npm test -- test/routes/preActionProtocol.test.js
```

**Expected result:** 31/31 tests passing

---

## Verification Checklist

After implementation, verify:

- [ ] Page loads at `/claims/preaction-protocol`
- [ ] Guidance text and warning displayed
- [ ] Radio question with Yes/No options shown
- [ ] Continue button present
- [ ] Previous link returns to Screen 13.1
- [ ] Cancel link returns to /case-list
- [ ] Validation error shown when no selection
- [ ] Error summary and inline error displayed
- [ ] Yes selection stores `followed: true` and redirects
- [ ] No selection stores `followed: false` and redirects
- [ ] Both paths redirect to `/claims/mediation-settlement`
- [ ] Previous answer can be changed (updates session)
- [ ] Error summary links to radio group
- [ ] Fieldset/legend structure correct
- [ ] All 31 tests passing

---

## Common Issues

**Issue:** Session not persisting  
**Fix:** Ensure `req.session.claim.preActionProtocol` initialized before storing

**Issue:** Boolean stored as string  
**Fix:** Convert string to boolean: `followed === 'true'`

**Issue:** Error not clearing  
**Fix:** Delete `req.session.errors` after rendering

**Issue:** Both radios checked  
**Fix:** Use strict equality: `followed === true` (not `followed == 'true'`)

---

## Notes

- **Convergent routing:** Both Yes/No lead to same screen (this is intentional)
- **Presence-only testing:** Don't test specific guidance text (allows content changes)
- **Previous navigation:** Returns to Screen 13.1 (NOT 13.1.1)
- **PRG pattern:** POST → Redirect → GET (prevents form resubmission)
- **Simple screen:** No complex branching or conditional logic

---

## Test Artifacts Location

- Understanding: `prototype/test/artifacts/screen16/understanding.md`
- Test Plan: `prototype/test/artifacts/screen16/test-plan.md`
- Test Matrix: `prototype/test/artifacts/screen16/test-matrix.md`
- Traceability: `prototype/test/artifacts/screen16/traceability.md`
- Executable Tests: `prototype/test/routes/preActionProtocol.test.js`
- Navigation Helper: `prototype/test/helpers/sessionHelper.js` (navigateToPreActionProtocol)

---

**Ready for implementation!** 🚀

All test artifacts created. Run tests to verify implementation correctness.
