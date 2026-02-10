# Screen 12 Implementation Guide for Claude
**Date:** 2026-01-23  
**Prepared by:** Nigel (Tester)  
**For:** Claude (Developer)

## Summary

Screen 12 (Tenancy or Licence Details) has been updated with new acceptance criteria (AC-13 through AC-16) that introduce **grounds model determination** and **conditional routing** based on tenancy type.

Additionally, **route names have changed** across the grounds journey to follow a consistent naming convention.

---

## Route Name Changes (BREAKING CHANGES)

### Routes to Rename

| Old Route | New Route | Screen |
|-----------|-----------|--------|
| `/claims/grounds` | `/claims/grounds-for-possession-assured` | 13.1 |
| `/claims/assured-tenancy-grounds-selection` | `/claims/grounds-for-possession-assured-selection` | 13.1.1 |

### New Routes to Create (Placeholders)

| Route | groundsModel | Screen | Status |
|-------|--------------|--------|--------|
| `/claims/grounds-for-possession-secure-flexible` | SECURE_LIKE | 13.2 | Not yet implemented |
| `/claims/grounds-for-possession-intro-demoted-other` | OTHER_UNSUPPORTED | 13.3 | Not yet implemented |

**Action Required:**
1. Rename existing route handlers and templates
2. Create placeholder GET routes for the new screens (simple "Coming soon" pages)
3. Update all navigation helpers and tests to use new route names

---

## Implementation Changes for Screen 12

### 1. Add groundsModel Determination Function

Add this helper function to `src/routes/claims.js`:

```js
/**
 * Determines the grounds model based on tenancy type
 * @param {string} tenancyType - The selected tenancy type
 * @returns {string} groundsModel - One of: ASSURED, SECURE_LIKE, OTHER_UNSUPPORTED
 */
function determineGroundsModel(tenancyType) {
  const mapping = {
    'assured-tenancy': 'ASSURED',
    'secure-tenancy': 'SECURE_LIKE',
    'introductory-tenancy': 'SECURE_LIKE',
    'flexible-tenancy': 'SECURE_LIKE',
    'demoted-tenancy': 'OTHER_UNSUPPORTED',
    'other': 'OTHER_UNSUPPORTED'
  };
  return mapping[tenancyType] || 'OTHER_UNSUPPORTED';
}
```

### 2. Update POST /tenancy Handler

Modify the POST handler to:
1. Determine groundsModel
2. Clear incompatible grounds data if groundsModel changes
3. Store groundsModel in session
4. Conditionally route based on groundsModel

#### Add After Validation, Before Saving to Session:

```js
// Determine groundsModel from tenancy type
const groundsModel = determineGroundsModel(tenancyType);

// Check if groundsModel changed from previous visit
const previousGroundsModel = req.session.claim?.tenancy?.groundsModel;
if (previousGroundsModel && previousGroundsModel !== groundsModel) {
  // Clear incompatible grounds data
  if (req.session.claim.grounds) {
    // From ASSURED to non-ASSURED: clear assured-specific data
    if (previousGroundsModel === 'ASSURED' && groundsModel !== 'ASSURED') {
      delete req.session.claim.grounds.assuredTenancy;
      delete req.session.claim.grounds.rentArrears;
      delete req.session.claim.grounds.hasAdditionalGrounds;
    }
    
    // From SECURE_LIKE to non-SECURE_LIKE: clear secure-specific data
    if (previousGroundsModel === 'SECURE_LIKE' && groundsModel !== 'SECURE_LIKE') {
      delete req.session.claim.grounds.secureTenancy;
      // Add any other secure-specific fields when implemented
    }
    
    // To OTHER_UNSUPPORTED: clear all grounds
    if (groundsModel === 'OTHER_UNSUPPORTED') {
      delete req.session.claim.grounds;
    }
  }
}
```

#### Update Session Storage:

```js
// Save tenancy details to session (including groundsModel)
req.session.claim.tenancy = {
  type: tenancyType,
  otherTypeDetails: tenancyType === 'other' ? (otherTypeDetails || null) : null,
  startDate: startDate || null,
  documents: req.session.claim.tenancy?.documents || [],
  groundsModel: groundsModel  // ← NEW FIELD
};
```

#### Update Redirect Logic:

Replace the existing hardcoded redirect with conditional routing:

```js
// Conditional routing based on groundsModel
let nextRoute;
if (groundsModel === 'ASSURED') {
  nextRoute = '/claims/grounds-for-possession-assured';
} else if (groundsModel === 'SECURE_LIKE') {
  nextRoute = '/claims/grounds-for-possession-secure-flexible';
} else if (groundsModel === 'OTHER_UNSUPPORTED') {
  nextRoute = '/claims/grounds-for-possession-intro-demoted-other';
}

return res.redirect(nextRoute);
```

---

## Test Updates Required

### Files to Update

1. **`test/routes/tenancy.test.js`** ✅ Already updated by Nigel
   - Added 15 new tests (T-13.1, T-13.2, T-15.1 to T-15.6, T-16.1 to T-16.5, T-R.1 to T-R.3)
   - Removed T-6.5 (old redirect test)
   - Updated T-X.5 to use new route name

2. **`test/routes/grounds.test.js`** ⚠️ Needs updating
   - Update all references to `/claims/grounds` → `/claims/grounds-for-possession-assured`
   - Update navigation helpers

3. **`test/routes/assuredTenancyGrounds.test.js`** ⚠️ Needs updating
   - Update all references to `/claims/assured-tenancy-grounds-selection` → `/claims/grounds-for-possession-assured-selection`
   - Update navigation helpers

4. **`test/helpers/sessionHelper.js`** ⚠️ Needs updating
   - Update `navigateToGrounds()` to use `/claims/grounds-for-possession-assured`
   - Update `navigateToAssuredTenancyGrounds()` to use `/claims/grounds-for-possession-assured-selection`

5. **Other test files** ⚠️ Check for references
   - Search entire test directory for `/claims/grounds` and update as needed

---

## Route Handler Updates

### 1. Rename Existing Handlers

**File: `src/routes/claims.js`**

```js
// OLD:
router.get('/grounds', (req, res) => { ... });
router.post('/grounds', (req, res) => { ... });

// NEW:
router.get('/grounds-for-possession-assured', (req, res) => { ... });
router.post('/grounds-for-possession-assured', (req, res) => { ... });
```

```js
// OLD:
router.get('/assured-tenancy-grounds-selection', (req, res) => { ... });
router.post('/assured-tenancy-grounds-selection', (req, res) => { ... });

// NEW:
router.get('/grounds-for-possession-assured-selection', (req, res) => { ... });
router.post('/grounds-for-possession-assured-selection', (req, res) => { ... });
```

### 2. Update Previous/Next Links in Handlers

**In `/grounds-for-possession-assured` handler:**
- Previous link should point to `/claims/tenancy`
- Next routes based on "Do you have rent arrears?":
  - Yes → `/claims/grounds-for-possession-assured-selection`
  - No → (future implementation)

**In `/grounds-for-possession-assured-selection` handler:**
- Previous link should point to `/claims/grounds-for-possession-assured`
- Next routes based on "Do you have any other grounds?":
  - Yes → (future implementation)
  - No → `/claims/reasons-for-possessions`

### 3. Create Placeholder Routes

Add these placeholder routes for testing:

```js
// Placeholder for SECURE_LIKE journey
router.get('/grounds-for-possession-secure-flexible', (req, res) => {
  res.send('Secure/Flexible tenancy grounds screen - Coming soon');
});

// Placeholder for OTHER_UNSUPPORTED journey
router.get('/grounds-for-possession-intro-demoted-other', (req, res) => {
  res.send('Introductory/Demoted/Other tenancy grounds screen - Coming soon');
});
```

---

## Template Updates

### 1. Rename Template Files

```bash
# OLD → NEW
src/views/pages/claims/grounds.njk 
  → src/views/pages/claims/grounds-for-possession-assured.njk

src/views/pages/claims/assured-tenancy-grounds-selection.njk
  → src/views/pages/claims/grounds-for-possession-assured-selection.njk
```

### 2. Update Form Action Attributes

**In renamed templates:**

```njk
{# OLD #}
<form action="/claims/grounds" method="post">

{# NEW #}
<form action="/claims/grounds-for-possession-assured" method="post">
```

### 3. Update Previous Links

Ensure Previous links use correct routes throughout the journey.

---

## Navigation Helper Updates

**File: `test/helpers/sessionHelper.js`**

Update these functions:

```js
// OLD:
async function navigateToGrounds(testSession) {
  await navigateToTenancy(testSession);
  await testSession
    .post('/claims/tenancy')
    .send({ tenancyType: 'assured-tenancy' });
  return await testSession.get('/claims/grounds');
}

// NEW:
async function navigateToGrounds(testSession) {
  await navigateToTenancy(testSession);
  await testSession
    .post('/claims/tenancy')
    .send({ tenancyType: 'assured-tenancy' });
  return await testSession.get('/claims/grounds-for-possession-assured');
}
```

```js
// OLD:
async function navigateToAssuredTenancyGrounds(testSession) {
  await navigateToGrounds(testSession);
  await testSession
    .post('/claims/grounds')
    .send({ rentArrears: 'yes' });
  return await testSession.get('/claims/assured-tenancy-grounds-selection');
}

// NEW:
async function navigateToAssuredTenancyGrounds(testSession) {
  await navigateToGrounds(testSession);
  await testSession
    .post('/claims/grounds-for-possession-assured')
    .send({ rentArrears: 'yes' });
  return await testSession.get('/claims/grounds-for-possession-assured-selection');
}
```

---

## Expected Test Results After Implementation

### Before Implementation (Expected Failures)
- ~15 tests will fail in `test/routes/tenancy.test.js` (new tests for groundsModel)
- Multiple tests will fail across other files due to route renames

### After Implementation (Expected Passes)
- All 84 tests in `test/routes/tenancy.test.js` should pass
- All tests in `test/routes/grounds.test.js` should pass (after updates)
- All tests in `test/routes/assuredTenancyGrounds.test.js` should pass (after updates)

**Total new test count:** ~84 tests in tenancy.test.js (was 68)

---

## Verification Checklist

After implementation, verify:

- [ ] `determineGroundsModel()` function exists and maps all 6 tenancy types correctly
- [ ] `groundsModel` is stored in `session.claim.tenancy.groundsModel`
- [ ] State clearing logic clears incompatible grounds when groundsModel changes
- [ ] Conditional routing works for all 3 groundsModel values
- [ ] All route names updated to new convention
- [ ] All templates renamed and form actions updated
- [ ] All navigation helpers updated
- [ ] Placeholder routes exist for SECURE_LIKE and OTHER_UNSUPPORTED
- [ ] All tests pass (84 in tenancy.test.js, 17 in grounds.test.js, 42 in assuredTenancyGrounds.test.js)
- [ ] No references to old route names remain in codebase

---

## Search & Replace Guide

To help update all route references:

```bash
# Find all references to old routes
grep -r "/claims/grounds" src/ test/ --exclude-dir=node_modules
grep -r "assured-tenancy-grounds-selection" src/ test/ --exclude-dir=node_modules

# After manual review, update:
# /claims/grounds → /claims/grounds-for-possession-assured
# /claims/assured-tenancy-grounds-selection → /claims/grounds-for-possession-assured-selection
```

---

## Summary of Changes

**New Files:**
- None (placeholders are inline in routes)

**Updated Files:**
- `src/routes/claims.js` - Add groundsModel logic, rename routes, add placeholders
- `src/views/pages/claims/grounds.njk` → `grounds-for-possession-assured.njk`
- `src/views/pages/claims/assured-tenancy-grounds-selection.njk` → `grounds-for-possession-assured-selection.njk`
- `test/routes/tenancy.test.js` - ✅ Already updated
- `test/routes/grounds.test.js` - Update route names
- `test/routes/assuredTenancyGrounds.test.js` - Update route names
- `test/helpers/sessionHelper.js` - Update navigation helpers

**Test Artifacts Updated:**
- ✅ `test/artifacts/screen12/understanding.md`
- ✅ `test/artifacts/screen12/test-plan.md`
- ✅ `test/artifacts/screen12/test-matrix.md`
- ✅ `test/artifacts/screen12/traceability.md`

---

## Questions?

If anything is unclear, ask Steve for clarification before proceeding.

Good luck, Claude! 🚀
