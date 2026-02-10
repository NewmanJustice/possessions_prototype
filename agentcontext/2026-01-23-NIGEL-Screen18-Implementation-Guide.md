# Screen 18 Implementation Guide - Notice of Intention

**Date:** 2026-01-23  
**Author:** Nigel (Tester Agent)  
**For:** Claude (Developer Agent)  
**User Story:** `businessArtifacts/userstories/screen18.txt`

---

## Overview

Screen 18 captures declarative confirmation about whether the solicitor has served notice of their intention to begin possession proceedings. This is a straightforward screen similar to Screen 16, with the addition of an external link that must open in a new tab with proper security attributes.

**Complexity:** ⭐ Simple — Standard GOV.UK radio pattern with external link

---

## Changes Required

### 1. Create new route handler
**File:** `prototype/src/app/routes/noticeOfIntention.js` (replace placeholder from Screen 17)

### 2. Create template
**File:** `prototype/src/app/views/noticeOfIntention.njk` (new file)

### 3. Create placeholder route
**File:** `prototype/src/app/routes/noticeDetails.js` (temporary placeholder)

---

## Route Handler Implementation

Replace `prototype/src/app/routes/noticeOfIntention.js`:

```javascript
const express = require('express');
const router = express.Router();

// GET /claims/notice-of-intention
router.get('/claims/notice-of-intention', (req, res) => {
  // Ensure session initialized
  if (!req.session.claim) {
    return res.redirect('/claims/start');
  }

  // Initialize noticeOfIntention if needed
  if (!req.session.claim.noticeOfIntention) {
    req.session.claim.noticeOfIntention = {};
  }

  // Get previously selected value (if any)
  const noticeServed = req.session.claim.noticeOfIntention.noticeServed;

  res.render('noticeOfIntention', {
    noticeServed: noticeServed,
    errors: req.session.errors || {}
  });

  // Clear errors after rendering
  delete req.session.errors;
});

// POST /claims/notice-of-intention
router.post('/claims/notice-of-intention', (req, res) => {
  const { noticeServed } = req.body;

  // Validation: AC-3
  if (!noticeServed) {
    req.session.errors = {
      noticeServed: {
        text: 'Select whether you have served notice to the defendants'
      }
    };
    return res.redirect('/claims/notice-of-intention');
  }

  // Initialize if needed
  if (!req.session.claim.noticeOfIntention) {
    req.session.claim.noticeOfIntention = {};
  }

  // Store answer: AC-4
  req.session.claim.noticeOfIntention.noticeServed = (noticeServed === 'true');

  // AC-5: Both paths converge
  res.redirect('/claims/notice-details');
});

module.exports = router;
```

---

## Template Implementation

Create `prototype/src/app/views/noticeOfIntention.njk`:

```njk
{% extends "layout.njk" %}

{% block pageTitle %}
  Notice of your intention to begin possession proceedings - HMCTS Possessions
{% endblock %}

{% block beforeContent %}
  {{ govukBackLink({
    text: "Previous",
    href: "/claims/mediation-settlement"
  }) }}
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">

      {% if errors.noticeServed %}
        {{ govukErrorSummary({
          titleText: "There is a problem",
          errorList: [
            {
              text: errors.noticeServed.text,
              href: "#noticeServed"
            }
          ],
          attributes: {
            tabindex: "-1"
          }
        }) }}
      {% endif %}

      <h1 class="govuk-heading-l">Notice of your intention to begin possession proceedings</h1>

      {# AC-1: Guidance text #}
      <p class="govuk-body">
        Notice periods vary depending on the grounds for possession. Some grounds may not require notice to be served.
      </p>

      <p class="govuk-body">
        You should consult the <a href="#" class="govuk-link" target="_blank" rel="noopener noreferrer">guidance on possession notice periods (opens in new tab)</a>.
      </p>

      {# AC-1: Warning message #}
      {{ govukWarningText({
        text: "A judge may not grant a possession order if the correct notice procedure has not been followed.",
        iconFallbackText: "Warning"
      }) }}

      <form method="post" action="/claims/notice-of-intention">

        {# AC-2: Radio question #}
        {{ govukRadios({
          name: "noticeServed",
          fieldset: {
            legend: {
              text: "Have you served notice to the defendants?",
              classes: "govuk-fieldset__legend--m"
            }
          },
          items: [
            {
              value: "true",
              text: "Yes",
              checked: noticeServed === true
            },
            {
              value: "false",
              text: "No",
              checked: noticeServed === false
            }
          ],
          errorMessage: errors.noticeServed if errors.noticeServed
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

Create `prototype/src/app/routes/noticeDetails.js`:

```javascript
const express = require('express');
const router = express.Router();

// Temporary placeholder for Screen TBD: Notice details
router.get('/claims/notice-details', (req, res) => {
  res.send('<h1>Placeholder: Notice Details</h1><p>This screen will be implemented later.</p>');
});

module.exports = router;
```

Register in `app.js`:
```javascript
const noticeDetailsRoute = require('./routes/noticeDetails');
app.use('/', noticeDetailsRoute);
```

---

## Session Data Structure

After successful submission:

```javascript
session.claim.noticeOfIntention = {
  noticeServed: true | false
}
```

**Key points:**
- Store boolean value (convert string to boolean)
- Both Yes/No store a value (not just Yes)
- Previous answer overwrites (no appending)

---

## Navigation Flow

```
Screen 17 (Mediation and settlement)
  ↓
Screen 18 (Notice of intention)
  ├─ Yes → /claims/notice-details
  └─ No  → /claims/notice-details

Previous → /claims/mediation-settlement (Screen 17)
Cancel → /case-list
```

**Note:** Both Yes/No converge to same destination (similar to Screen 16)

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| noticeServed | Required | "Select whether you have served notice to the defendants" |

**Validation behavior:**
- Check on POST only
- Store error in session
- Redirect back to GET (PRG pattern)
- Display GOV.UK error summary + inline error
- Clear error after rendering

---

## External Link Requirements (Q1)

**Important:** The external guidance link must have proper security attributes:

```html
<a href="[URL]" target="_blank" rel="noopener noreferrer">
  guidance on possession notice periods (opens in new tab)
</a>
```

**Required attributes:**
- `target="_blank"` — Opens in new tab
- `rel="noopener noreferrer"` — Security (prevents window.opener exploitation)

**Link text:**
- Include "(opens in new tab)" for accessibility
- Makes it clear to screen reader users and all users that link opens externally

**Why these attributes matter:**
- `noopener` — Prevents new page from accessing window.opener
- `noreferrer` — Prevents referrer information being passed
- Security best practice for external links

---

## Test Execution

Run the test file:
```bash
cd prototype
npm test -- test/routes/noticeOfIntention.test.js
```

**Expected result:** 35/35 tests passing

---

## Verification Checklist

After implementation, verify:

**Display:**
- [ ] Page loads at `/claims/notice-of-intention`
- [ ] Guidance text displayed (presence-only, Q2)
- [ ] Warning message displayed
- [ ] External link present
- [ ] Link has `target="_blank"`
- [ ] Link has `rel="noopener noreferrer"`
- [ ] Link indicates it opens in new tab
- [ ] Radio question with Yes/No options shown
- [ ] Continue button present
- [ ] Previous link returns to Screen 17
- [ ] Cancel link returns to /case-list

**Validation:**
- [ ] Error shown when no selection
- [ ] Error summary and inline error displayed
- [ ] Error message correct
- [ ] Error summary links to radio group
- [ ] Focus moves to error summary

**Session storage:**
- [ ] Yes selection stores `noticeServed: true`
- [ ] No selection stores `noticeServed: false`
- [ ] Both paths redirect to `/claims/notice-details`
- [ ] Session data persists after redirect
- [ ] Previous answer can be changed

**Accessibility:**
- [ ] Fieldset/legend structure correct
- [ ] Radio inputs properly labelled
- [ ] All 35 tests passing

---

## Common Issues

**Issue:** Link doesn't open in new tab  
**Fix:** Ensure `target="_blank"` attribute present

**Issue:** Security warning about window.opener  
**Fix:** Add `rel="noopener noreferrer"` attribute

**Issue:** Session not persisting  
**Fix:** Ensure `req.session.claim.noticeOfIntention` initialized before storing

**Issue:** Boolean stored as string  
**Fix:** Convert string to boolean: `noticeServed === 'true'`

**Issue:** Link text not accessible  
**Fix:** Include "(opens in new tab)" in link text

---

## Notes

- **Convergent routing:** Both Yes/No lead to same screen (intentional)
- **Presence-only testing:** Don't test specific guidance text (Q2)
- **External link:** Must have both `target` and `rel` attributes (Q1)
- **Previous navigation:** Returns to Screen 17 (Mediation and settlement)
- **PRG pattern:** POST → Redirect → GET (prevents form resubmission)
- **Simple screen:** No complex branching or conditional logic
- **Similar to Screen 16:** Same pattern and validation approach

---

## Test Artifacts Location

- Understanding: `prototype/test/artifacts/screen18/understanding.md`
- Test Plan: `prototype/test/artifacts/screen18/test-plan.md`
- Test Matrix: `prototype/test/artifacts/screen18/test-matrix.md`
- Traceability: `prototype/test/artifacts/screen18/traceability.md`
- Executable Tests: `prototype/test/routes/noticeOfIntention.test.js` (496 lines, 35 tests)
- Navigation Helper: `prototype/test/helpers/sessionHelper.js` (navigateToNoticeOfIntention)

---

**Ready for implementation!** 🚀

All test artifacts created. Run tests to verify implementation correctness. Pay special attention to the external link attributes - these are tested specifically per Q1.
