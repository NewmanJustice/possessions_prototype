# Screen 14 Implementation Guide

**Route:** `/claims/grounds-for-possession`  
**Screen Type:** Reusable screen with dynamic routing  
**Tests:** 45 tests in `test/routes/groundsForPossession.test.js`  
**Test Artifacts:** `/prototype/test/artifacts/screen14/`

---

## Quick Summary

Screen 14 is a **reusable checkbox selection screen** for collecting additional grounds for possession. It uses a **navigation contract** pattern stored in session to support dynamic routing from multiple entry points.

**For the assured journey:**
- User arrives from Screen 13.1.1 after selecting "Yes" to additional grounds
- Title displays as "Additional grounds for possession"
- 14 grounds presented in two groups (Mandatory + Discretionary)
- Selected grounds stored in `session.claim.grounds.additional`
- Continues to Screen 15 (Reasons for Possession)

---

## Implementation Checklist

Use this checklist while implementing:

```
Before coding:
[ ] Read user story (screen14.txt)
[ ] Read understanding document
[ ] Read executable tests
[ ] Run baseline tests (45 tests, 43 failing expected)

During implementation:
[ ] Create GET route with navigation contract setup
[ ] Create POST route with validation
[ ] Create Nunjucks template with 14 ground checkboxes
[ ] Implement session persistence logic
[ ] Implement pre-population logic
[ ] Implement dynamic navigation (Previous/Continue/Cancel)

Before handover:
[ ] All 45 tests passing
[ ] Lint passing (npm run lint)
[ ] No test.skip or test.todo
[ ] Changes summarized
```

---

## Session Structure

### Navigation Contract
```javascript
session.claim.navigation.screen14 = {
  previous: '/claims/grounds-for-possession-assured-selection',  // Where Previous goes
  continue: '/claims/reasons-for-possession',                    // Where Continue goes
  titleMode: 'additional'                                        // 'additional' or 'standard'
}
```

**Setup Rules:**
- Set **conditionally** in GET handler (only if not already present)
- Allows previous screen to pre-configure navigation
- Falls back to default values if not set

**Default values (assured journey):**
```javascript
if (!req.session.claim.navigation?.screen14) {
  req.session.claim.navigation = {
    ...req.session.claim.navigation,
    screen14: {
      previous: '/claims/grounds-for-possession-assured-selection',
      continue: '/claims/reasons-for-possession',
      titleMode: 'additional'
    }
  };
}
```

### Ground Selections
```javascript
session.claim.grounds.additional = {
  // Mandatory grounds (6 grounds)
  mandatoryGround1: true | false,
  mandatoryGround3: true | false,
  mandatoryGround4: true | false,
  mandatoryGround5: true | false,
  mandatoryGround7: true | false,
  mandatoryGround8: true | false,
  
  // Discretionary grounds (8 grounds)
  discretionaryGround9: true | false,
  discretionaryGround10: true | false,
  discretionaryGround11: true | false,
  discretionaryGround12: true | false,
  discretionaryGround13: true | false,
  discretionaryGround14: true | false,
  discretionaryGround15: true | false,
  discretionaryGround16: true | false
}
```

**Important:**
- Deselected grounds must be set to `false` (not undefined or null)
- This ensures pre-population works correctly on revisit

---

## GET Route Implementation

### Route: `GET /claims/grounds-for-possession`

```javascript
router.get('/grounds-for-possession', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Set navigation contract conditionally (only if not already set)
  if (!req.session.claim?.navigation?.screen14) {
    req.session.claim = req.session.claim || {};
    req.session.claim.navigation = req.session.claim.navigation || {};
    req.session.claim.navigation.screen14 = {
      previous: '/claims/grounds-for-possession-assured-selection',
      continue: '/claims/reasons-for-possession',
      titleMode: 'additional'
    };
  }

  // Get navigation contract
  const nav = req.session.claim.navigation.screen14;

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get existing ground selections for pre-population
  const additionalGrounds = claim.grounds?.additional || {};

  // Build checkbox items for mandatory grounds (6 grounds: 1, 3, 4, 5, 7, 8)
  const mandatoryGroundItems = [
    { value: 'mandatoryGround1', text: 'Ground 1', checked: additionalGrounds.mandatoryGround1 === true },
    { value: 'mandatoryGround3', text: 'Ground 3', checked: additionalGrounds.mandatoryGround3 === true },
    { value: 'mandatoryGround4', text: 'Ground 4', checked: additionalGrounds.mandatoryGround4 === true },
    { value: 'mandatoryGround5', text: 'Ground 5', checked: additionalGrounds.mandatoryGround5 === true },
    { value: 'mandatoryGround7', text: 'Ground 7', checked: additionalGrounds.mandatoryGround7 === true },
    { value: 'mandatoryGround8', text: 'Ground 8', checked: additionalGrounds.mandatoryGround8 === true }
  ];

  // Build checkbox items for discretionary grounds (8 grounds: 9-16)
  const discretionaryGroundItems = [
    { value: 'discretionaryGround9', text: 'Ground 9', checked: additionalGrounds.discretionaryGround9 === true },
    { value: 'discretionaryGround10', text: 'Ground 10', checked: additionalGrounds.discretionaryGround10 === true },
    { value: 'discretionaryGround11', text: 'Ground 11', checked: additionalGrounds.discretionaryGround11 === true },
    { value: 'discretionaryGround12', text: 'Ground 12', checked: additionalGrounds.discretionaryGround12 === true },
    { value: 'discretionaryGround13', text: 'Ground 13', checked: additionalGrounds.discretionaryGround13 === true },
    { value: 'discretionaryGround14', text: 'Ground 14', checked: additionalGrounds.discretionaryGround14 === true },
    { value: 'discretionaryGround15', text: 'Ground 15', checked: additionalGrounds.discretionaryGround15 === true },
    { value: 'discretionaryGround16', text: 'Ground 16', checked: additionalGrounds.discretionaryGround16 === true }
  ];

  // Determine page title based on titleMode
  const pageTitle = nav.titleMode === 'additional' 
    ? 'Additional grounds for possession' 
    : 'Grounds for possession';

  // Clear errors from session
  delete req.session.errors;

  res.render('pages/claims/grounds-for-possession', {
    pageTitle,
    mandatoryGroundItems,
    discretionaryGroundItems,
    errors: errorList,
    fieldErrors
  });
});
```

---

## POST Route Implementation

### Route: `POST /claims/grounds-for-possession`

```javascript
router.post('/grounds-for-possession', (req, res) => {
  const { grounds, action } = req.body;

  // Handle navigation actions
  if (action === 'previous') {
    const previousRoute = req.session.claim?.navigation?.screen14?.previous 
      || '/claims/grounds-for-possession-assured-selection';
    return res.redirect(previousRoute);
  }

  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validate: at least one ground must be selected
  const errors = [];
  const selectedGrounds = Array.isArray(grounds) ? grounds : (grounds ? [grounds] : []);

  if (selectedGrounds.length === 0) {
    errors.push({
      field: 'grounds',
      message: 'Select at least one ground for possession',
      href: '#grounds'
    });
  }

  // If validation fails, re-render with errors
  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/grounds-for-possession');
  }

  // Persist selections in session
  const claim = claimService.getClaim(req.session) || {};
  claim.grounds = claim.grounds || {};

  // Initialize all 14 grounds to false
  claim.grounds.additional = {
    mandatoryGround1: false,
    mandatoryGround3: false,
    mandatoryGround4: false,
    mandatoryGround5: false,
    mandatoryGround7: false,
    mandatoryGround8: false,
    discretionaryGround9: false,
    discretionaryGround10: false,
    discretionaryGround11: false,
    discretionaryGround12: false,
    discretionaryGround13: false,
    discretionaryGround14: false,
    discretionaryGround15: false,
    discretionaryGround16: false
  };

  // Set selected grounds to true
  selectedGrounds.forEach(ground => {
    claim.grounds.additional[ground] = true;
  });

  // Save to session
  claimService.saveClaim(req.session, claim);

  // Navigate to continue route (dynamic)
  const continueRoute = req.session.claim?.navigation?.screen14?.continue 
    || '/claims/reasons-for-possession';
  
  res.redirect(continueRoute);
});
```

---

## Template Implementation

### File: `src/views/pages/claims/grounds-for-possession.njk`

```njk
{% extends "layouts/main.njk" %}

{% block pageTitle %}
  {{ pageTitle }} – GOV.UK
{% endblock %}

{% block beforeContent %}
  {{ govukBackLink({
    text: "Back",
    href: "#",
    attributes: {
      "onclick": "history.back(); return false;"
    }
  }) }}
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">

      <form method="post" action="/claims/grounds-for-possession">

        {% if errors.length > 0 %}
          {{ govukErrorSummary({
            titleText: "There is a problem",
            errorList: errors
          }) }}
        {% endif %}

        <h1 class="govuk-heading-l">{{ pageTitle }}</h1>

        {# Mandatory Grounds Group #}
        <div class="govuk-form-group {% if fieldErrors.grounds %}govuk-form-group--error{% endif %}">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h2 class="govuk-fieldset__heading">
                Mandatory grounds
              </h2>
            </legend>

            {% if fieldErrors.grounds %}
              <p id="grounds-error" class="govuk-error-message">
                <span class="govuk-visually-hidden">Error:</span> {{ fieldErrors.grounds }}
              </p>
            {% endif %}

            {{ govukCheckboxes({
              name: "grounds",
              fieldset: {
                legend: {
                  text: "Select all mandatory grounds that apply",
                  classes: "govuk-visually-hidden"
                }
              },
              items: mandatoryGroundItems,
              errorMessage: fieldErrors.grounds and {
                text: fieldErrors.grounds
              } if fieldErrors.grounds
            }) }}
          </fieldset>
        </div>

        {# Discretionary Grounds Group #}
        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h2 class="govuk-fieldset__heading">
                Discretionary grounds
              </h2>
            </legend>

            {{ govukCheckboxes({
              name: "grounds",
              fieldset: {
                legend: {
                  text: "Select all discretionary grounds that apply",
                  classes: "govuk-visually-hidden"
                }
              },
              items: discretionaryGroundItems
            }) }}
          </fieldset>
        </div>

        {# Navigation Buttons #}
        <div class="govuk-button-group">
          {{ govukButton({
            text: "Continue"
          }) }}

          <button type="submit" name="action" value="previous" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Previous
          </button>

          <button type="submit" name="action" value="cancel" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Cancel
          </button>
        </div>

      </form>

    </div>
  </div>
{% endblock %}
```

---

## Key Implementation Notes

### 1. Navigation Contract Pattern

**Purpose:** Support multiple entry points with different navigation paths

**Setup timing:**
- GET route sets contract **conditionally** (only if not already present)
- Previous screen can pre-set contract before redirecting
- Provides default fallback values for direct access

**Usage:**
```javascript
// In POST handler for Previous button:
const previousRoute = req.session.claim?.navigation?.screen14?.previous;
res.redirect(previousRoute);

// In POST handler for Continue button:
const continueRoute = req.session.claim?.navigation?.screen14?.continue;
res.redirect(continueRoute);
```

### 2. Ground Persistence Logic

**Critical rules:**
1. Always initialize ALL 14 grounds to `false` before setting selected ones
2. This ensures deselected grounds are explicitly `false` (not undefined)
3. Pre-population uses `checked: value === true` (strict equality)

**Why this matters:**
- Enables correct pre-population on revisit
- Allows users to deselect previously selected grounds
- Tests explicitly verify deselection behavior

### 3. Title Mode Handling

**Current implementation:**
- Only `'additional'` mode tested (assured journey)
- Future enhancement: `'standard'` mode for other journeys

**Title logic:**
```javascript
const pageTitle = nav.titleMode === 'additional' 
  ? 'Additional grounds for possession' 
  : 'Grounds for possession';
```

### 4. Checkbox Grouping

**Two separate groups:**
1. Mandatory grounds (6 checkboxes) - Grounds 1, 3, 4, 5, 7, 8
2. Discretionary grounds (8 checkboxes) - Grounds 9, 10, 11, 12, 13, 14, 15, 16

**Note:** Both groups use the same `name="grounds"` so selections combine into a single array in `req.body.grounds`

### 5. Validation Error Pattern

**GOV.UK pattern requirements:**
- Error summary at top with role="alert" and tabindex="-1" (focus target)
- Error link href="#grounds" targets the first checkbox group
- Inline error message above checkbox groups
- Error styling on form group

**Error message:** "Select at least one ground for possession"

---

## Testing Notes

### Running Tests

```bash
cd prototype
npm test -- test/routes/groundsForPossession.test.js
```

**Expected results:**
- **Before implementation:** 43 failing, 2 passing (45 total)
- **After implementation:** 45 passing (0 failing)

### Test Coverage

- **Display tests:** Title, checkboxes, grouping (6 tests)
- **Selection tests:** One, multiple, all grounds (4 tests)
- **Validation tests:** Error messages, accessibility (7 tests)
- **Persistence tests:** Session storage, prefixed keys (6 tests)
- **Revisit tests:** Pre-population, modification (5 tests)
- **Navigation tests:** Previous, Continue, Cancel (9 tests)
- **Contract tests:** Setup, integrity (4 tests)
- **Accessibility tests:** Error summary, focus, labels (5 tests)

### Common Test Failures

1. **Missing route:** 404 errors → Create GET/POST routes in claims.js
2. **Wrong title:** Title mismatch → Check titleMode logic in GET handler
3. **Checkboxes not pre-checked:** → Verify `checked: value === true` logic
4. **Navigation redirects wrong:** → Check navigation contract usage
5. **Validation not working:** → Ensure error handling and redirect to self

---

## GOV.UK Component Usage

### govukCheckboxes

**For mandatory grounds:**
```javascript
{{ govukCheckboxes({
  name: "grounds",
  items: mandatoryGroundItems,
  errorMessage: fieldErrors.grounds and {
    text: fieldErrors.grounds
  } if fieldErrors.grounds
}) }}
```

**Items structure:**
```javascript
[
  { 
    value: 'mandatoryGround1', 
    text: 'Ground 1', 
    checked: true | false 
  },
  // ... more items
]
```

### govukErrorSummary

```javascript
{{ govukErrorSummary({
  titleText: "There is a problem",
  errorList: [
    { text: "Select at least one ground for possession", href: "#grounds" }
  ]
}) }}
```

### govukButton

```javascript
// Continue button (primary)
{{ govukButton({
  text: "Continue"
}) }}

// Previous button (secondary)
<button type="submit" name="action" value="previous" 
        class="govuk-button govuk-button--secondary">
  Previous
</button>

// Cancel button (secondary)
<button type="submit" name="action" value="cancel" 
        class="govuk-button govuk-button--secondary">
  Cancel
</button>
```

---

## Integration with Other Screens

### Entry Point: Screen 13.1.1 (Assured Additional Grounds Selection)

**Route:** `/claims/grounds-for-possession-assured-selection`

**When "Yes" selected:**
```javascript
// Optional: Pre-set navigation contract
req.session.claim.navigation.screen14 = {
  previous: '/claims/grounds-for-possession-assured-selection',
  continue: '/claims/reasons-for-possession',
  titleMode: 'additional'
};

res.redirect('/claims/grounds-for-possession');
```

### Exit Point: Screen 15 (Reasons for Possession)

**Route:** `/claims/reasons-for-possession`

**Screen 14 redirects here on Continue:**
```javascript
res.redirect(continueRoute);  // → '/claims/reasons-for-possession'
```

**Currently:** Placeholder route exists (created in this session)

---

## Troubleshooting

### Issue: Tests fail with 404 on route

**Cause:** Route not added to claims.js  
**Fix:** Add GET and POST handlers for `/claims/grounds-for-possession`

### Issue: Title shows "Grounds for possession" instead of "Additional..."

**Cause:** titleMode not set to 'additional'  
**Fix:** Verify navigation contract setup in GET handler

### Issue: Checkboxes not pre-checked on revisit

**Cause:** Checked logic not using strict equality  
**Fix:** Use `checked: additionalGrounds.mandatoryGround1 === true`

### Issue: Deselecting grounds doesn't work

**Cause:** Not initializing all grounds to false before setting selected ones  
**Fix:** Always initialize all 14 grounds to false, then set selected to true

### Issue: Navigation goes to wrong route

**Cause:** Navigation contract not being used  
**Fix:** Read from `req.session.claim.navigation.screen14.previous/continue`

### Issue: Validation error doesn't show

**Cause:** Not storing errors in session or not redirecting to self  
**Fix:**
```javascript
if (errors.length > 0) {
  req.session.errors = errors;
  return res.redirect('/claims/grounds-for-possession');
}
```

---

## Summary Checklist

**Before marking as complete:**

- [ ] GET route handles navigation contract setup conditionally
- [ ] GET route builds checkbox items with pre-population
- [ ] GET route determines title based on titleMode
- [ ] POST route validates at least one ground selected
- [ ] POST route handles Previous/Continue/Cancel actions
- [ ] POST route initializes all grounds to false
- [ ] POST route sets selected grounds to true
- [ ] POST route uses dynamic navigation from contract
- [ ] Template has error summary with proper aria
- [ ] Template has two checkbox groups (Mandatory/Discretionary)
- [ ] Template has all 14 ground checkboxes
- [ ] Template has Continue/Previous/Cancel buttons
- [ ] All 45 tests passing
- [ ] Lint passing
- [ ] No console errors or warnings

---

**Implementation guide created by Nigel (Tester Agent) on 2026-01-27.**  
**Ready to hand over to Claude (Developer Agent) for implementation.**
