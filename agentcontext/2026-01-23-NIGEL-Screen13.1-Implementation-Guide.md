# Screen 13.1 Implementation Guide for Claude
**Date:** 2026-01-23  
**Prepared by:** Nigel (Tester)  
**For:** Claude (Developer)

## Summary

Screen 13.1 has been **completely replaced** with new functionality. The old "rent arrears question" is gone, replaced with an "assured journey confirmation" screen.

---

## What Changed

### OLD Screen 13.1 (DELETED)
- **Route:** `/claims/grounds`
- **Question:** "Are you claiming possession because of rent arrears?"
- **Session:** `session.claim.grounds.rentArrears`
- **Purpose:** Branch between rent arrears grounds and other grounds

### NEW Screen 13.1 (IMPLEMENT THIS)
- **Route:** `/claims/grounds-for-possession-assured-confirmation`
- **Question:** "Do you want to proceed with assured-tenancy grounds?"
- **Session:** `session.claim.grounds.assuredProceed`
- **Purpose:** Confirm if user wants assured-tenancy journey or switch to alternate flow

---

## Route Changes Required

### 1. Rename Old Route for Other Journeys

The old `/claims/grounds` route should be **renamed** to `/claims/grounds-for-possession` for use in other (non-assured) journeys.

```js
// OLD:
router.get('/grounds', ...)
router.post('/grounds', ...)

// NEW (for non-assured journeys):
router.get('/grounds-for-possession', ...)
router.post('/grounds-for-possession', ...)
```

**Note:** This route will be used for other tenancy types (SECURE_LIKE, OTHER_UNSUPPORTED) but that's not your concern for now. Just rename it.

### 2. Create New Route Handler

Create a completely new route handler for the assured confirmation screen:

```js
// ============================================================
// Screen 13.1: Assured Journey Confirmation
// ============================================================

router.get('/grounds-for-possession-assured-confirmation', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in');
  }

  // Get existing selection if returning to page
  const assuredProceed = req.session.claim?.grounds?.assuredProceed;
  const errors = req.session.errors || [];
  delete req.session.errors;

  res.render('pages/claims/grounds-for-possession-assured-confirmation', {
    assuredProceed: assuredProceed,
    errors: errors,
    errorList: errors.map(e => ({ text: e.message, href: e.href })),
    fieldErrors: errors.reduce((acc, e) => {
      acc[e.field] = { text: e.message };
      return acc;
    }, {})
  });
});

router.post('/grounds-for-possession-assured-confirmation', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in');
  }

  const assuredProceed = req.body.assuredProceed;
  const errors = [];

  // Validation: assuredProceed is required
  if (!assuredProceed) {
    errors.push({
      field: 'assuredProceed',
      message: 'Select whether you want to proceed with assured-tenancy grounds',
      href: '#assuredProceed'
    });
  }

  // If validation errors, redirect back
  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/grounds-for-possession-assured-confirmation');
  }

  // Store selection in session
  if (!req.session.claim.grounds) {
    req.session.claim.grounds = {};
  }
  
  req.session.claim.grounds.assuredProceed = (assuredProceed === 'yes');

  // Conditional routing based on selection
  if (assuredProceed === 'yes') {
    // Proceed with assured-tenancy grounds
    return res.redirect('/claims/grounds-for-possession-assured-selection');
  } else {
    // Proceed to general grounds flow
    return res.redirect('/claims/grounds-for-possession');
  }
});
```

---

## Template Creation

Create a new template file:

**File:** `src/views/pages/claims/grounds-for-possession-assured-confirmation.njk`

```njk
{% extends "layouts/main.njk" %}
{% from "govuk/components/radios/macro.njk" import govukRadios %}
{% from "govuk/components/button/macro.njk" import govukButton %}
{% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %}

{% block pageTitle %}
  {%- if errors and errors.length > 0 -%}Error: {%- endif -%}
  Assured tenancy grounds confirmation - Possessions - GOV.UK
{% endblock %}

{% block beforeContent %}
  {{ govukBackLink({
    text: "Previous",
    href: "/claims/tenancy"
  }) }}
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      
      {% if errors and errors.length > 0 %}
        {{ govukErrorSummary({
          titleText: "There is a problem",
          errorList: errorList
        }) }}
      {% endif %}

      <form method="post" action="/claims/grounds-for-possession-assured-confirmation" novalidate>
        
        <span class="govuk-caption-l">Make a claim</span>
        <h1 class="govuk-heading-l">Assured tenancy grounds</h1>

        <p class="govuk-body">
          You indicated that this claim involves an assured tenancy. 
          You can proceed with assured-tenancy specific grounds, or choose to use the general grounds for possession.
        </p>

        {{ govukRadios({
          name: "assuredProceed",
          fieldset: {
            legend: {
              text: "Do you want to proceed with assured-tenancy grounds?",
              classes: "govuk-fieldset__legend--m"
            }
          },
          items: [
            {
              value: "yes",
              text: "Yes",
              checked: assuredProceed === true
            },
            {
              value: "no",
              text: "No",
              checked: assuredProceed === false
            }
          ],
          errorMessage: fieldErrors.assuredProceed
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

## Updates to Screen 13.1.1 (Assured Grounds Selection)

The route name for Screen 13.1.1 has changed:

**Old:** `/claims/assured-tenancy-grounds-selection`  
**New:** `/claims/grounds-for-possession-assured-selection`

You'll need to:
1. Rename the route handlers
2. Rename the template file
3. Update all references to the old route name

This was already documented in the Screen 12 implementation guide.

---

## Session Flow After Screen 12

```
Screen 12 (Tenancy) - User selects "Assured tenancy"
  ↓ (groundsModel = 'ASSURED' set in session)
  ↓ (redirects to...)
  ↓
Screen 13.1 (NEW - Assured Confirmation)
Route: /claims/grounds-for-possession-assured-confirmation
Question: "Do you want to proceed with assured-tenancy grounds?"
  ├─ Yes (assuredProceed = true)
  │    → /claims/grounds-for-possession-assured-selection (Screen 13.1.1)
  └─ No (assuredProceed = false)
       → /claims/grounds-for-possession (Screen 14.1 - general grounds)
```

---

## Test Files Updated

**Test Artifacts:**
- ✅ `test/artifacts/screen13.1/understanding.md` - Completely rewritten
- ✅ `test/artifacts/screen13.1/test-plan.md` - Completely rewritten
- ✅ `test/artifacts/screen13.1/test-matrix.md` - Completely rewritten
- ✅ `test/artifacts/screen13.1/traceability.md` - Completely rewritten

**Executable Tests:**
- ✅ `test/routes/grounds.test.js` - Completely rewritten (27 tests)

**Navigation Helpers:**
- ✅ `test/helpers/sessionHelper.js` - Updated with `navigateToAssuredConfirmation()`

---

## Expected Test Results

### Before Implementation
- All 27 tests in `grounds.test.js` will fail (route doesn't exist)

### After Implementation
- All 27 tests should pass

**Test count:** 27 tests

---

## Verification Checklist

After implementation, verify:

- [ ] Old `/claims/grounds` route renamed to `/claims/grounds-for-possession`
- [ ] New `/claims/grounds-for-possession-assured-confirmation` route exists (GET and POST)
- [ ] Template created at correct path
- [ ] Validation works (required radio selection)
- [ ] Yes path redirects to `/claims/grounds-for-possession-assured-selection`
- [ ] No path redirects to `/claims/grounds-for-possession`
- [ ] `session.claim.grounds.assuredProceed` stored as boolean
- [ ] Previous link points to `/claims/tenancy`
- [ ] Cancel link points to `/case-list`
- [ ] GOV.UK error patterns implemented correctly
- [ ] All 27 tests in `grounds.test.js` pass

---

## Important Notes

1. **This is a complete replacement** - don't try to merge with old code
2. **The rent arrears question is gone** - it's been moved to a different journey (not your concern)
3. **Screen 14.1 doesn't exist yet** - just ensure the redirect works
4. **Session structure changed** - `rentArrears` → `assuredProceed`

---

## Questions?

If anything is unclear, ask Steve for clarification before proceeding.

Good luck, Claude! 🚀
