# Screen 13.2 Implementation Guide - Secure/Flexible Tenancy Grounds

**Date:** 2026-01-26  
**Author:** Nigel (Tester Agent)  
**For:** Claude (Developer Agent)  
**User Story:** `businessArtifacts/userstories/screen13.2.txt`  
**Design Reference:** `businessArtifacts/screen13.2.png`

---

## Overview

Screen 13.2 allows solicitors to select possession grounds for secure or flexible tenancies. It features 8 ground checkboxes with a conditional reveal: when Ground 1 is selected, a radio group appears requiring the user to specify whether it's for rent arrears or breach of tenancy.

**Complexity:** ⭐⭐⭐ Medium-High — Conditional reveal, multiple checkboxes, Ground 1 validation

---

## Changes Required

### 1. Replace placeholder route
**File:** `prototype/src/routes/claims.js` (or create separate route file)
**Route:** `/claims/grounds-for-possession-secure-flexible` (GET + POST)

### 2. Create template
**File:** `prototype/src/views/pages/claims/grounds-for-possession-secure-flexible.njk` (new file)

### 3. Create placeholder route
**File:** `prototype/src/views/pages/claims/rent-arrears-breach-of-tenency.njk` (temporary placeholder)

### 4. Add conditional reveal logic
**Note:** GOV.UK pattern for conditional radios within a checkbox item

---

## Key Implementation Notes (Q1-Q6)

**Q1: Complete Grounds List**
See `businessArtifacts/screen13.2.png` for exact labels and order.

**Q2: Ground 1 Label**
"Rent arrears or breach of the tenancy" (from screen13.2.png)

**Q3: Session Values**
- `ground1Type`: 'rentArrears' or 'breach' or null
- Use camelCase for all ground keys (ground2A not ground2a)

**Q4: Minimum Selection**
At least 1 ground must be selected (validation required)

**Q5: Next Route**
Redirect to `/claims/rent-arrears-breach-of-tenency` (note the typo "tenency" is intentional per Steve)

**Q6: Placeholder**
Create placeholder route for `/claims/rent-arrears-breach-of-tenency`

---

## Grounds List (from screen13.2.png)

### Discretionary Grounds

1. **Ground 1:** Rent arrears or breach of the tenancy
   - **Conditional:** "Rent arrears" / "Breach of tenancy" (radios)
2. **Ground 2:** Nuisance or annoyance
3. **Ground 2A:** Domestic violence
4. **Ground 3:** Deterioration of dwelling
5. **Ground 4:** Deterioration of furniture
6. **Ground 5:** False statement
7. **Ground 6:** Premium paid for assignment
8. **Ground 7:** Misconduct or conviction

### Mandatory Ground

9. **Ground 8:** Serious rent arrears

---

## Validation Rules

### Minimum Selection Validation
```javascript
function validateGrounds(body) {
  const hasAnyGround = body.ground1 || body.ground2 || body.ground2A || 
                        body.ground3 || body.ground4 || body.ground5 || 
                        body.ground6 || body.ground7 || body.ground8;
  
  if (!hasAnyGround) {
    return 'Select at least one ground for possession';
  }
  
  return null;
}
```

### Ground 1 Type Validation
```javascript
function validateGround1Type(body) {
  if (body.ground1 && !body.ground1Type) {
    return 'Select whether ground 1 is rent arrears or breach of tenancy';
  }
  
  return null;
}
```

---

## Session Structure

```javascript
session.claim.grounds.secureFlexible = {
  ground1: true,
  ground1Type: 'rentArrears',  // 'rentArrears' | 'breach' | null
  ground2: false,
  ground2A: false,             // Note: camelCase for 2A
  ground3: false,
  ground4: false,
  ground5: false,
  ground6: false,
  ground7: false,
  ground8: true
}
```

### Storage Notes
- All grounds stored as booleans
- ground1Type only populated when ground1 === true
- Use camelCase: ground2A (not ground2a or ground_2a)
- Set ground1Type to null when Ground 1 is deselected

---

## Route Handler Implementation

Add to `prototype/src/routes/claims.js`:

```javascript
// GET /claims/grounds-for-possession-secure-flexible
router.get('/claims/grounds-for-possession-secure-flexible', (req, res) => {
  const grounds = req.session.claim?.grounds?.secureFlexible || {};
  
  res.render('pages/claims/grounds-for-possession-secure-flexible', {
    ground1: grounds.ground1 || false,
    ground1Type: grounds.ground1Type || '',
    ground2: grounds.ground2 || false,
    ground2A: grounds.ground2A || false,
    ground3: grounds.ground3 || false,
    ground4: grounds.ground4 || false,
    ground5: grounds.ground5 || false,
    ground6: grounds.ground6 || false,
    ground7: grounds.ground7 || false,
    ground8: grounds.ground8 || false,
    errors: {}
  });
});

// POST /claims/grounds-for-possession-secure-flexible
router.post('/claims/grounds-for-possession-secure-flexible', (req, res) => {
  const {
    ground1, ground1Type, ground2, ground2A, ground3,
    ground4, ground5, ground6, ground7, ground8
  } = req.body;
  
  const errors = {};
  
  // Validate: at least one ground selected
  const groundsError = validateGrounds(req.body);
  if (groundsError) {
    errors.grounds = { text: groundsError };
  }
  
  // Validate: Ground 1 type required when Ground 1 selected
  const ground1TypeError = validateGround1Type(req.body);
  if (ground1TypeError) {
    errors.ground1Type = { text: ground1TypeError };
  }
  
  // If validation errors, re-render with errors
  if (Object.keys(errors).length > 0) {
    return res.status(400).render('pages/claims/grounds-for-possession-secure-flexible', {
      ground1: !!ground1,
      ground1Type: ground1Type || '',
      ground2: !!ground2,
      ground2A: !!ground2A,
      ground3: !!ground3,
      ground4: !!ground4,
      ground5: !!ground5,
      ground6: !!ground6,
      ground7: !!ground7,
      ground8: !!ground8,
      errors,
      errorList: Object.entries(errors).map(([field, error]) => ({
        text: error.text,
        href: `#${field}`
      }))
    });
  }
  
  // Store in session
  if (!req.session.claim) req.session.claim = {};
  if (!req.session.claim.grounds) req.session.claim.grounds = {};
  
  req.session.claim.grounds.secureFlexible = {
    ground1: !!ground1,
    ground1Type: ground1 ? (ground1Type || null) : null,
    ground2: !!ground2,
    ground2A: !!ground2A,
    ground3: !!ground3,
    ground4: !!ground4,
    ground5: !!ground5,
    ground6: !!ground6,
    ground7: !!ground7,
    ground8: !!ground8
  };
  
  // Redirect to next screen
  res.redirect('/claims/rent-arrears-breach-of-tenency');
});

// Validation helpers
function validateGrounds(body) {
  const hasAnyGround = body.ground1 || body.ground2 || body.ground2A || 
                        body.ground3 || body.ground4 || body.ground5 || 
                        body.ground6 || body.ground7 || body.ground8;
  
  if (!hasAnyGround) {
    return 'Select at least one ground for possession';
  }
  
  return null;
}

function validateGround1Type(body) {
  if (body.ground1 && !body.ground1Type) {
    return 'Select whether ground 1 is rent arrears or breach of tenancy';
  }
  
  return null;
}
```

---

## Template Implementation

Create `prototype/src/views/pages/claims/grounds-for-possession-secure-flexible.njk`:

```jinja
{% extends "layouts/main.njk" %}

{% block pageTitle %}
  {% if errorList %}Error: {% endif %}Grounds for possession - Possession claims
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      
      {% if errorList %}
        {{ govukErrorSummary({
          titleText: "There is a problem",
          errorList: errorList,
          attributes: {
            tabindex: "-1"
          }
        }) }}
      {% endif %}
      
      <h1 class="govuk-heading-xl">Grounds for possession</h1>
      
      <form method="post" action="/claims/grounds-for-possession-secure-flexible">
        
        {# Grounds checkboxes with Ground 1 conditional #}
        {{ govukCheckboxes({
          name: "grounds",
          fieldset: {
            legend: {
              text: "Select all grounds that apply",
              classes: "govuk-fieldset__legend--m"
            }
          },
          errorMessage: errors.grounds if errors.grounds,
          items: [
            {
              name: "ground1",
              value: "true",
              text: "Rent arrears or breach of the tenancy (Ground 1)",
              checked: ground1,
              conditional: {
                html: govukRadios({
                  name: "ground1Type",
                  fieldset: {
                    legend: {
                      text: "Is this for:",
                      classes: "govuk-fieldset__legend--s"
                    }
                  },
                  items: [
                    {
                      value: "rentArrears",
                      text: "Rent arrears",
                      checked: ground1Type == 'rentArrears'
                    },
                    {
                      value: "breach",
                      text: "Breach of tenancy",
                      checked: ground1Type == 'breach'
                    }
                  ],
                  errorMessage: errors.ground1Type if errors.ground1Type
                })
              }
            },
            {
              name: "ground2",
              value: "true",
              text: "Nuisance or annoyance (Ground 2)",
              checked: ground2
            },
            {
              name: "ground2A",
              value: "true",
              text: "Domestic violence (Ground 2A)",
              checked: ground2A
            },
            {
              name: "ground3",
              value: "true",
              text: "Deterioration of dwelling (Ground 3)",
              checked: ground3
            },
            {
              name: "ground4",
              value: "true",
              text: "Deterioration of furniture (Ground 4)",
              checked: ground4
            },
            {
              name: "ground5",
              value: "true",
              text: "False statement (Ground 5)",
              checked: ground5
            },
            {
              name: "ground6",
              value: "true",
              text: "Premium paid for assignment (Ground 6)",
              checked: ground6
            },
            {
              name: "ground7",
              value: "true",
              text: "Misconduct or conviction (Ground 7)",
              checked: ground7
            },
            {
              name: "ground8",
              value: "true",
              text: "Serious rent arrears (Ground 8)",
              checked: ground8
            }
          ]
        }) }}
        
        {# Navigation buttons #}
        <div class="govuk-button-group">
          {{ govukButton({
            text: "Continue"
          }) }}
          
          <a class="govuk-link" href="/claims/tenancy">Previous</a>
          <a class="govuk-link" href="/case-list">Cancel</a>
        </div>
        
      </form>
      
    </div>
  </div>
{% endblock %}
```

---

## Placeholder Route

Create `prototype/src/views/pages/claims/rent-arrears-breach-of-tenency.njk`:

```jinja
{% extends "layouts/main.njk" %}

{% block pageTitle %}
  Rent Arrears / Breach of Tenency - Possession claims
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-xl">Placeholder: Rent Arrears / Breach of Tenency</h1>
      <p class="govuk-body">This is a placeholder for the next screen after secure/flexible grounds.</p>
      <p class="govuk-body">
        <a href="/claims/grounds-for-possession-secure-flexible" class="govuk-link">Back to Grounds</a>
      </p>
    </div>
  </div>
{% endblock %}
```

Add GET route in `prototype/src/routes/claims.js`:
```javascript
router.get('/claims/rent-arrears-breach-of-tenency', (req, res) => {
  res.render('pages/claims/rent-arrears-breach-of-tenency');
});
```

---

## GOV.UK Component Notes

### Conditional Reveal Pattern
- Use `conditional` property in checkbox item
- Conditional contains nested `govukRadios` component
- GOV.UK Frontend JavaScript handles show/hide
- Conditional is initially hidden if parent checkbox not checked

### Checkbox with Conditional Example
```javascript
{
  name: "ground1",
  value: "true",
  text: "Rent arrears or breach of the tenancy (Ground 1)",
  checked: ground1,
  conditional: {
    html: govukRadios({...})  // Nested radios
  }
}
```

### Error Patterns
- Checkbox group error: Links to first checkbox (or fieldset)
- Radio error (Ground 1 type): Links to #ground1Type
- Error summary at top with `tabindex="-1"`
- Inline errors on both checkbox group and conditional radios

---

## Testing Notes

### Running Tests
```bash
cd prototype
npm test -- test/routes/secureFlexibleGrounds.test.js
```

### Expected Results
- **Total tests:** 71
- **Currently passing:** 8 (navigation links, some structure tests)
- **Currently failing:** 63 (expected - no implementation yet)
- **After implementation:** All 71 tests should PASS

### Test Coverage
- Display: 11 tests
- Multiple selection: 4 tests
- Conditional reveal: 6 tests
- Ground 1 validation: 6 tests
- Preservation: 4 tests
- Session persistence: 10 tests
- Routing: 3 tests
- Navigation: 6 tests
- Error handling: 7 tests
- Accessibility: 7 tests
- Edge cases: 7 tests

---

## Navigation Flow

```
Previous: /claims/tenancy (Screen 12)
  ↓
Current: /claims/grounds-for-possession-secure-flexible (Screen 13.2)
  ↓
Next: /claims/rent-arrears-breach-of-tenency (Screen 13.x - placeholder)

Cancel: /case-list
```

---

## Common Pitfalls

### ❌ Don't Do This
```javascript
// DON'T store ground2A as ground2a (wrong case)
req.session.claim.grounds.secureFlexible.ground2a = true;  // Wrong!

// DON'T forget to validate minimum selection
// (User could submit with no grounds)

// DON'T leave ground1Type when Ground 1 deselected
if (!ground1) {
  grounds.ground1Type = 'rentArrears';  // Wrong! Should be null
}
```

### ✅ Do This
```javascript
// DO use camelCase for ground2A
req.session.claim.grounds.secureFlexible.ground2A = true;  // Correct!

// DO validate at least one ground
if (!hasAnyGround) {
  errors.grounds = { text: 'Select at least one ground for possession' };
}

// DO clear ground1Type when Ground 1 not selected
ground1Type: ground1 ? (ground1Type || null) : null  // Correct!
```

---

## Acceptance Criteria Checklist

When implementing, ensure:

- [x] AC-1: All 8 grounds displayed as checkboxes with correct labels
- [x] AC-2: Multiple selection allowed, at least 1 required
- [x] AC-3: Ground 1 checkbox reveals conditional radios
- [x] AC-4: Ground 1 sub-option required when Ground 1 selected
- [x] AC-5: Ground 1 + sub-option preserved on revisit
- [x] AC-6: Session structure correct (secureFlexible object with all flags)
- [x] AC-7: Redirect to /claims/rent-arrears-breach-of-tenency
- [x] AC-8: Previous → /claims/tenancy, Cancel → /case-list, data preserved
- [x] AC-9: GOV.UK error patterns (summary, inline, focus)
- [x] AC-10: Accessibility (keyboard, labels, ARIA, conditional announcements)

---

## Files to Create/Modify

### New Files (2)
1. `prototype/src/views/pages/claims/grounds-for-possession-secure-flexible.njk`
2. `prototype/src/views/pages/claims/rent-arrears-breach-of-tenency.njk` (placeholder)

### Modified Files (1)
1. `prototype/src/routes/claims.js` — Add GET/POST handlers + placeholder

### Test Files (already created)
1. `prototype/test/routes/secureFlexibleGrounds.test.js` — 71 tests
2. `prototype/test/artifacts/screen13.2/` — 4 artifact files

---

## Summary

Screen 13.2 is a **medium-high complexity** screen that:
- Displays 8 ground checkboxes (9 including Ground 2A)
- Uses conditional reveal for Ground 1 sub-option
- Validates minimum selection (at least 1 ground)
- Validates Ground 1 type when Ground 1 selected
- Stores all flags in `session.claim.grounds.secureFlexible`
- Uses GOV.UK checkboxes with nested radios pattern

**Key Challenge:** Conditional reveal pattern + Ground 1 type validation

**Ready for implementation!** ✅

---

**Questions?** Refer to test artifacts in `prototype/test/artifacts/screen13.2/` or ask Steve.
