# Screen 13.1.1 Implementation Guide for Claude
**Date:** 2026-01-23  
**Prepared by:** Nigel (Tester)  
**For:** Claude (Developer)

## Summary

Screen 13.1.1 (Assured Tenancy Grounds Selection) has been updated with:
1. Route rename
2. New "Add additional grounds" primary button
3. Updated routing destinations
4. Updated validation logic (button bypasses radio requirement)

---

## Route Changes

### Rename Route

**Old:** `/claims/assured-tenancy-grounds-selection`  
**New:** `/claims/grounds-for-possession-assured-selection`

Update:
- Route handlers (GET and POST)
- Template file name
- All test references
- Navigation helper in sessionHelper.js

---

## New "Add Additional Grounds" Button

### Button Specifications

- **Label:** "Add additional grounds"
- **Style:** Primary button (green) - same as Continue button
- **Position:** Underneath the radio options (between radios and Continue button)
- **Behavior:** Immediate POST redirect, bypasses Continue button

### Button Implementation

```njk
{# After the radios, before the Continue button #}

{{ govukRadios({
  name: "hasAdditionalGrounds",
  fieldset: {
    legend: {
      text: "Do you have any additional grounds for possession?",
      classes: "govuk-fieldset__legend--m"
    }
  },
  items: [
    { value: "yes", text: "Yes", checked: hasAdditionalGrounds === true },
    { value: "no", text: "No", checked: hasAdditionalGrounds === false }
  ],
  errorMessage: fieldErrors.hasAdditionalGrounds
}) }}

{# NEW: Add additional grounds button #}
<div class="govuk-button-group">
  {{ govukButton({
    text: "Add additional grounds",
    name: "addAdditionalGrounds",
    value: "true"
  }) }}
</div>

{# Continue button and Cancel link below #}
<div class="govuk-button-group">
  {{ govukButton({
    text: "Continue"
  }) }}
  <a class="govuk-link" href="/case-list">Cancel</a>
</div>
```

---

## Updated POST Handler Logic

The POST handler needs to handle three scenarios:

### 1. Button Pressed (Immediate Redirect)

```js
router.post('/grounds-for-possession-assured-selection', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in');
  }

  const ground8 = req.body.ground8 === 'on';
  const ground10 = req.body.ground10 === 'on';
  const ground11 = req.body.ground11 === 'on';
  const hasAdditionalGrounds = req.body.hasAdditionalGrounds;
  const addAdditionalGroundsButton = req.body.addAdditionalGrounds;

  // SCENARIO 1: Button pressed (immediate redirect)
  if (addAdditionalGroundsButton) {
    // Store checkbox selections
    if (!req.session.claim.grounds) {
      req.session.claim.grounds = {};
    }
    req.session.claim.grounds.assuredTenancy = {
      ground8: ground8,
      ground10: ground10,
      ground11: ground11
    };
    req.session.claim.grounds.hasAdditionalGrounds = true;
    
    return res.redirect('/claims/grounds-for-possession');
  }

  // SCENARIO 2 & 3: Continue button pressed - validate radio
  const errors = [];

  // Validation: radio required if button NOT pressed
  if (!hasAdditionalGrounds) {
    errors.push({
      field: 'hasAdditionalGrounds',
      message: 'Select whether you have additional grounds for possession',
      href: '#hasAdditionalGrounds'
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/grounds-for-possession-assured-selection');
  }

  // Store selections
  if (!req.session.claim.grounds) {
    req.session.claim.grounds = {};
  }
  req.session.claim.grounds.assuredTenancy = {
    ground8: ground8,
    ground10: ground10,
    ground11: ground11
  };
  req.session.claim.grounds.hasAdditionalGrounds = (hasAdditionalGrounds === 'yes');

  // Conditional routing based on radio
  if (hasAdditionalGrounds === 'yes') {
    return res.redirect('/claims/grounds-for-possession');
  } else {
    return res.redirect('/claims/preaction-protocol');
  }
});
```

---

## Routing Changes Summary

| Scenario | Old Destination | New Destination |
|----------|----------------|-----------------|
| "Add additional grounds" button | N/A (didn't exist) | `/claims/grounds-for-possession` |
| Radio "Yes" + Continue | `/claims/other-tenancy-grounds` | `/claims/grounds-for-possession` |
| Radio "No" + Continue | `/claims/reasons-for-possessions` | `/claims/preaction-protocol` |

---

## Placeholder Routes Needed

Create placeholder GET routes for:

1. **`/claims/grounds-for-possession`** (Additional grounds page)
```js
router.get('/grounds-for-possession', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in');
  }
  res.render('pages/claims/grounds-for-possession', {
    pageTitle: 'Additional grounds for possession'
  });
});
```

2. **`/claims/preaction-protocol`** (Screen 16)
```js
router.get('/preaction-protocol', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in');
  }
  res.send('Preaction protocol screen - Coming soon');
});
```

---

## Test File Updates Required

The existing test file `test/routes/assuredTenancyGrounds.test.js` needs:

1. **Update describe block:**
   - Old: `'Assured Tenancy Grounds Selection - /claims/assured-tenancy-grounds-selection'`
   - New: `'Assured Tenancy Grounds Selection - /claims/grounds-for-possession-assured-selection'`

2. **Update all route references:**
   - Replace `/claims/assured-tenancy-grounds-selection` with `/claims/grounds-for-possession-assured-selection`

3. **Update routing tests:**
   - T-9.2: Yes radio → `/claims/grounds-for-possession` (was `/claims/other-tenancy-grounds`)
   - T-10.2: No radio → `/claims/preaction-protocol` (was `/claims/reasons-for-possessions`)

4. **Add new button tests (AC-6, AC-8):**
   - T-6.3 to T-6.7: Button display and styling
   - T-8.1 to T-8.6: Button behavior

5. **Update validation tests (AC-7):**
   - T-7.4: Verify no error when button pressed

6. **Update navigation tests (AC-11):**
   - Previous link → `/claims/grounds-for-possession-assured-confirmation`

**Estimated updates:** ~12 new tests, ~8 existing tests updated

---

## Session State (No Changes)

```js
session.claim.grounds = {
  rentArrears: true,           // May be deprecated for assured path
  assuredProceed: true,        // From Screen 13.1
  assuredTenancy: {
    ground8: true | false,
    ground10: true | false,
    ground11: true | false
  },
  hasAdditionalGrounds: true | false
}
```

---

## Button Accessibility Requirements

- Must be keyboard focusable (native `<button>` element handles this)
- Must have accessible name (button text provides this)
- Must be a `<button>` element, not a link styled as button
- Must submit form (POST request)
- Must have distinguishable name attribute to detect which button pressed

---

## Expected Test Results

### Before Implementation
- Route name mismatch will cause many test failures
- Button tests don't exist yet
- Routing tests will fail due to wrong destinations

### After Implementation
- **All 54 tests should pass** (42 existing + 12 new)

---

## Verification Checklist

After implementation, verify:

- [ ] Route renamed to `/claims/grounds-for-possession-assured-selection`
- [ ] "Add additional grounds" button displayed underneath radios
- [ ] Button is primary (green) style
- [ ] Button is keyboard accessible
- [ ] Button click immediately redirects to `/claims/grounds-for-possession`
- [ ] Button click stores `hasAdditionalGrounds = true`
- [ ] Button bypasses radio validation
- [ ] Radio "Yes" redirects to `/claims/grounds-for-possession`
- [ ] Radio "No" redirects to `/claims/preaction-protocol`
- [ ] Validation error only when neither radio selected NOR button pressed
- [ ] Previous link points to `/claims/grounds-for-possession-assured-confirmation`
- [ ] Checkboxes remain optional (no validation)
- [ ] All 54 tests pass

---

## Important Notes

1. **Button vs Continue:** Two different submit buttons in same form - use `name` attribute to distinguish
2. **Placeholder routes:** `/claims/grounds-for-possession` and `/claims/preaction-protocol` need minimal GET handlers
3. **No page title testing:** Don't test that destination page has specific title (per Steve's Q5 answer)
4. **Test redirect only:** Tests should verify redirect URL, not destination page content

---

## Questions?

If anything is unclear, ask Steve for clarification before proceeding.

Good luck, Claude! 🚀
