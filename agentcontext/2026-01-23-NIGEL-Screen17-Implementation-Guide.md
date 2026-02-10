# Screen 17 Implementation Guide - Mediation and Settlement

**Date:** 2026-01-23  
**Author:** Nigel (Tester Agent)  
**For:** Claude (Developer Agent)  
**User Story:** `businessArtifacts/userstories/screen17.txt`

---

## Overview

Screen 17 captures whether mediation and settlement have been attempted, with optional details fields that appear conditionally based on radio selections. This screen has complex frontend logic including conditional display and data clearing.

**Complexity:** ⭐⭐⭐ Medium-High — Conditional display, multiple validations, data clearing

---

## Changes Required

### 1. Update existing route handler
**File:** `prototype/src/app/routes/mediationSettlement.js` (replace placeholder)

### 2. Create template
**File:** `prototype/src/app/views/mediationSettlement.njk` (new file)

### 3. Create placeholder route
**File:** `prototype/src/app/routes/noticeOfIntention.js` (temporary placeholder)

### 4. Add conditional display JavaScript (optional)
**File:** `prototype/src/app/assets/javascripts/conditional-display.js` (or use progressive enhancement)

---

## Route Handler Implementation

Replace `prototype/src/app/routes/mediationSettlement.js`:

```javascript
const express = require('express');
const router = express.Router();

// GET /claims/mediation-settlement
router.get('/claims/mediation-settlement', (req, res) => {
  // Ensure session initialized
  if (!req.session.claim) {
    return res.redirect('/claims/start');
  }

  // Initialize mediationSettlement if needed
  if (!req.session.claim.mediationSettlement) {
    req.session.claim.mediationSettlement = {};
  }

  const data = req.session.claim.mediationSettlement;

  res.render('mediationSettlement', {
    mediationAttempted: data.mediationAttempted,
    mediationDetails: data.mediationDetails || '',
    settlementAttempted: data.settlementAttempted,
    settlementDetails: data.settlementDetails || '',
    errors: req.session.errors || {}
  });

  // Clear errors after rendering
  delete req.session.errors;
});

// POST /claims/mediation-settlement
router.post('/claims/mediation-settlement', (req, res) => {
  const { 
    mediationAttempted, 
    mediationDetails, 
    settlementAttempted, 
    settlementDetails 
  } = req.body;

  const errors = {};

  // Validation: AC-11 (required fields)
  if (!mediationAttempted) {
    errors.mediationAttempted = {
      text: 'Select whether you have attempted mediation'
    };
  }

  if (!settlementAttempted) {
    errors.settlementAttempted = {
      text: 'Select whether you have tried to reach a settlement'
    };
  }

  // Validation: AC-5, AC-10 (character limits)
  if (mediationAttempted === 'true' && mediationDetails && mediationDetails.length > 250) {
    errors.mediationDetails = {
      text: 'Enter 250 characters or fewer'
    };
  }

  if (settlementAttempted === 'true' && settlementDetails && settlementDetails.length > 250) {
    errors.settlementDetails = {
      text: 'Enter 250 characters or fewer'
    };
  }

  // If errors, redirect back
  if (Object.keys(errors).length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/mediation-settlement');
  }

  // Initialize if needed
  if (!req.session.claim.mediationSettlement) {
    req.session.claim.mediationSettlement = {};
  }

  // Store data: AC-13
  req.session.claim.mediationSettlement.mediationAttempted = (mediationAttempted === 'true');
  
  // Q4: Clear details if No selected, otherwise store
  if (mediationAttempted === 'true') {
    req.session.claim.mediationSettlement.mediationDetails = mediationDetails || null;
  } else {
    req.session.claim.mediationSettlement.mediationDetails = null;
  }

  req.session.claim.mediationSettlement.settlementAttempted = (settlementAttempted === 'true');
  
  // Q4: Clear details if No selected, otherwise store
  if (settlementAttempted === 'true') {
    req.session.claim.mediationSettlement.settlementDetails = settlementDetails || null;
  } else {
    req.session.claim.mediationSettlement.settlementDetails = null;
  }

  // AC-14: Redirect to next screen
  res.redirect('/claims/notice-of-intention');
});

module.exports = router;
```

---

## Template Implementation

Create `prototype/src/app/views/mediationSettlement.njk`:

```njk
{% extends "layout.njk" %}

{% block pageTitle %}
  Mediation and settlement - HMCTS Possessions
{% endblock %}

{% block beforeContent %}
  {{ govukBackLink({
    text: "Previous",
    href: "/claims/preaction-protocol"
  }) }}
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">

      {% if errors.mediationAttempted or errors.mediationDetails or errors.settlementAttempted or errors.settlementDetails %}
        {% set errorList = [] %}
        {% if errors.mediationAttempted %}
          {% set errorList = (errorList.push({
            text: errors.mediationAttempted.text,
            href: "#mediationAttempted"
          }), errorList) %}
        {% endif %}
        {% if errors.mediationDetails %}
          {% set errorList = (errorList.push({
            text: errors.mediationDetails.text,
            href: "#mediationDetails"
          }), errorList) %}
        {% endif %}
        {% if errors.settlementAttempted %}
          {% set errorList = (errorList.push({
            text: errors.settlementAttempted.text,
            href: "#settlementAttempted"
          }), errorList) %}
        {% endif %}
        {% if errors.settlementDetails %}
          {% set errorList = (errorList.push({
            text: errors.settlementDetails.text,
            href: "#settlementDetails"
          }), errorList) %}
        {% endif %}

        {{ govukErrorSummary({
          titleText: "There is a problem",
          errorList: errorList,
          attributes: {
            tabindex: "-1"
          }
        }) }}
      {% endif %}

      <h1 class="govuk-heading-l">Mediation and settlement</h1>

      <form method="post" action="/claims/mediation-settlement">

        {# AC-1, AC-2, AC-3: Mediation section #}
        <div class="govuk-inset-text">
          Mediation can help both sides reach an agreement without going to court.
        </div>

        {{ govukRadios({
          name: "mediationAttempted",
          fieldset: {
            legend: {
              text: "Have you attempted mediation with the defendants?",
              classes: "govuk-fieldset__legend--m"
            }
          },
          items: [
            {
              value: "true",
              text: "Yes",
              checked: mediationAttempted === true,
              conditional: {
                html: govukTextarea({
                  name: "mediationDetails",
                  id: "mediationDetails",
                  label: {
                    text: "Give details about the attempted mediation and what the outcome was"
                  },
                  hint: {
                    text: "You can enter up to 250 characters"
                  },
                  value: mediationDetails,
                  errorMessage: errors.mediationDetails if errors.mediationDetails
                })
              }
            },
            {
              value: "false",
              text: "No",
              checked: mediationAttempted === false
            }
          ],
          errorMessage: errors.mediationAttempted if errors.mediationAttempted
        }) }}

        {# AC-6, AC-7, AC-8: Settlement section #}
        <div class="govuk-inset-text">
          Settlement includes steps taken to recover arrears or agree a repayment plan.
        </div>

        {{ govukRadios({
          name: "settlementAttempted",
          fieldset: {
            legend: {
              text: "Have you tried to reach a settlement with the defendants?",
              classes: "govuk-fieldset__legend--m"
            }
          },
          items: [
            {
              value: "true",
              text: "Yes",
              checked: settlementAttempted === true,
              conditional: {
                html: govukTextarea({
                  name: "settlementDetails",
                  id: "settlementDetails",
                  label: {
                    text: "Explain what steps you've taken to reach a settlement"
                  },
                  hint: {
                    text: "You can enter up to 250 characters"
                  },
                  value: settlementDetails,
                  errorMessage: errors.settlementDetails if errors.settlementDetails
                })
              }
            },
            {
              value: "false",
              text: "No",
              checked: settlementAttempted === false
            }
          ],
          errorMessage: errors.settlementAttempted if errors.settlementAttempted
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

## Placeholder Route (Temporary)

Create `prototype/src/app/routes/noticeOfIntention.js`:

```javascript
const express = require('express');
const router = express.Router();

// Temporary placeholder for Screen TBD: Notice of intention
router.get('/claims/notice-of-intention', (req, res) => {
  res.send('<h1>Placeholder: Notice of Intention</h1><p>This screen will be implemented later.</p>');
});

module.exports = router;
```

Register in `app.js`:
```javascript
const noticeOfIntentionRoute = require('./routes/noticeOfIntention');
app.use('/', noticeOfIntentionRoute);
```

---

## Session Data Structure

After successful submission:

```javascript
session.claim.mediationSettlement = {
  mediationAttempted: true | false,     // Required
  mediationDetails: string | null,      // Optional, max 250
  settlementAttempted: true | false,    // Required
  settlementDetails: string | null      // Optional, max 250
}
```

**Key data rules (Q4):**
- When radio = No → details = null (cleared)
- When radio = Yes + empty → details = null or ""
- When radio = Yes + text → details = string
- Switching Yes→No → clear details (set to null)

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| mediationAttempted | Required | "Select whether you have attempted mediation" |
| settlementAttempted | Required | "Select whether you have tried to reach a settlement" |
| mediationDetails | Optional, max 250 chars | "Enter 250 characters or fewer" |
| settlementDetails | Optional, max 250 chars | "Enter 250 characters or fewer" |

**Character limit specifics (Q5):**
- 250 characters → ✅ Valid
- 251 characters → ❌ Error

**Validation behavior:**
- Check on POST only
- Can have multiple errors (up to 4)
- Store errors in session
- Redirect back to GET (PRG pattern)
- Preserve all inputs on error (AC-12)

---

## Navigation Flow

```
Screen 16 (Pre-action protocol)
  ↓
Screen 17 (Mediation and Settlement)
  ↓
/claims/notice-of-intention

Previous → /claims/preaction-protocol (Screen 16)
Cancel → /case-list
```

---

## Conditional Display Logic

**GOV.UK Frontend handles this automatically** using the `conditional` property in radios!

The template uses:
```njk
conditional: {
  html: govukTextarea({...})
}
```

This automatically shows/hides text areas with JavaScript. No custom JS needed!

**Progressive enhancement:**
- JavaScript enabled: Text areas show/hide smoothly
- JavaScript disabled: Text areas always visible (graceful degradation)

---

## Test Execution

Run the test file:
```bash
cd prototype
npm test -- test/routes/mediationSettlement.test.js
```

**Expected result:** 62/62 tests passing

---

## Verification Checklist

After implementation, verify:

**Display:**
- [ ] Page loads at `/claims/mediation-settlement`
- [ ] Mediation guidance text displayed
- [ ] Mediation question with Yes/No radios
- [ ] Settlement guidance text displayed (generic, not conditional)
- [ ] Settlement question with Yes/No radios
- [ ] Continue button present
- [ ] Previous link returns to Screen 16
- [ ] Cancel link returns to /case-list

**Conditional display:**
- [ ] Mediation details hidden by default
- [ ] Mediation details shown when Yes selected
- [ ] Mediation details hidden when No selected
- [ ] Settlement details hidden by default
- [ ] Settlement details shown when Yes selected
- [ ] Settlement details hidden when No selected
- [ ] Character count hints displayed

**Validation:**
- [ ] Error when mediation not answered
- [ ] Error when settlement not answered
- [ ] Both errors shown when neither answered
- [ ] Error when mediation details > 250 chars
- [ ] Error when settlement details > 250 chars
- [ ] Multiple errors can display together
- [ ] Error summary and inline errors shown
- [ ] Focus moves to error summary

**Data handling:**
- [ ] Both No → stores false, details null
- [ ] Yes + empty details → valid (optional)
- [ ] Yes + 250 chars → valid
- [ ] Yes + 251 chars → error
- [ ] Switching Yes→No clears details
- [ ] All inputs preserved on validation error

**Navigation:**
- [ ] Valid submission → /claims/notice-of-intention
- [ ] Session data persists
- [ ] Previous answers can be changed
- [ ] All 62 tests passing

---

## Common Issues

**Issue:** Text areas not showing/hiding  
**Fix:** Ensure GOV.UK Frontend JavaScript is loaded. Check `conditional` property in template.

**Issue:** Details not cleared when switching to No  
**Fix:** Check POST handler logic - must set to null when radio = 'false'

**Issue:** Character limit not validating  
**Fix:** Use `.length > 250` (not `>= 250`). 251 chars should error.

**Issue:** Multiple errors not displaying  
**Fix:** Build errorList array in template with all errors

**Issue:** Empty string vs null  
**Fix:** Both are acceptable for empty optional fields. Tests check for absence of data.

---

## Notes

- **Conditional display:** GOV.UK Frontend handles automatically
- **Settlement guidance:** Generic for all claim types (Q1)
- **Previous:** Returns to Screen 16 (Q2)
- **Next screen:** /claims/notice-of-intention (Q3)
- **Data clearing:** Must clear when No selected (Q4)
- **Character limit:** Exactly 251 triggers error (Q5)
- **Optional fields:** No validation when Yes + empty (AC-4, AC-9)
- **Input preservation:** All 4 fields preserved on error (AC-12)
- **PRG pattern:** POST → Redirect → GET

---

## Test Artifacts Location

- Understanding: `prototype/test/artifacts/screen17/understanding.md`
- Test Plan: `prototype/test/artifacts/screen17/test-plan.md`
- Test Matrix: `prototype/test/artifacts/screen17/test-matrix.md`
- Traceability: `prototype/test/artifacts/screen17/traceability.md`
- Executable Tests: `prototype/test/routes/mediationSettlement.test.js` (935 lines, 62 tests)
- Navigation Helper: `prototype/test/helpers/sessionHelper.js` (navigateToMediationSettlement)

---

**Ready for implementation!** 🚀

This is a medium-high complexity screen with conditional display and multiple validation rules. The GOV.UK Frontend handles the JavaScript automatically via the `conditional` property. All 62 tests are ready to verify implementation correctness.
