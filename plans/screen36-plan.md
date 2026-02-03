# Screen 36: Completing Your Claim - Implementation Plan

## Summary

Screen 36 captures the user's preference for how to complete their claim - either submit and pay now, or save as a draft for later. This is a decision point in the claim journey that allows solicitors to choose the workflow that best fits their current needs.

## Route Configuration

- **GET** `/claims/completing-your-claim` - Render the completing your claim page
- **POST** `/claims/completing-your-claim` - Handle form submission

## Files to Create/Modify

### 1. New Template
- **Create**: `prototype/src/views/pages/claims/completing-your-claim.njk`

### 2. Routes
- **Modify**: `prototype/src/routes/claims.js` - Add GET and POST handlers

### 3. Validation
- **Modify**: `prototype/src/services/claimService.js` - Add validation case for 'completing-your-claim'

## Implementation Steps

### Step 1: Add Validation Logic to claimService.js

Add new case to `validateStep()` switch statement:

```javascript
case 'completing-your-claim': {
  if (!data.completionPreference) {
    errors.push({
      field: 'completionPreference',
      message: 'Select what you would like to do next',
      href: '#completionPreference'
    });
  }
  break;
}
```

### Step 2: Add GET Route Handler

```javascript
// GET /claims/completing-your-claim - Screen 36
router.get('/completing-your-claim', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const completionPreferenceData = claim.completionPreference || {};
  const completionPreference = completionPreferenceData.preference || null;
  const caseNumber = claim.caseNumber || null;

  res.render('pages/claims/completing-your-claim', {
    pageTitle: 'Completing your claim',
    completionPreference,
    caseNumber,
    errors: {},
    errorList: []
  });
});
```

### Step 3: Add POST Route Handler

```javascript
// POST /claims/completing-your-claim - Screen 36
router.post('/completing-your-claim', (req, res) => {
  const { completionPreference, action } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/language-used');
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  if (!completionPreference) {
    errors.completionPreference = { text: 'Select what you would like to do next' };
    errorList.push({ text: 'Select what you would like to do next', href: '#completionPreference' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    const caseNumber = claim.caseNumber || null;

    return res.status(200).render('pages/claims/completing-your-claim', {
      pageTitle: 'Completing your claim',
      completionPreference: completionPreference || null,
      caseNumber,
      errors,
      errorList
    });
  }

  // Store in session
  claimService.updateClaim(req.session, 'completionPreference', { preference: completionPreference });

  // Redirect to Screen 37
  res.redirect('/claims/statement-of-truth');
});
```

### Step 4: Create Template

Based on `language-used.njk` pattern with modifications for this screen's content.

## Session Data Structure

```javascript
req.session.claimDraft.completionPreference = {
  preference: 'submit-now' | 'save-for-later' | null
}
```

## Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| completionPreference | Required | "Select what you would like to do next" |

## Template Components

- Caption: "Make a claim"
- Page heading: "Completing your claim"
- Case number display
- Explanatory text paragraph
- Bulleted list with two options
- Radio buttons (name="completionPreference"):
  - "Submit and pay for my claim now" (value: submit-now)
  - "Save it for later" (value: save-for-later)
- Button group: Continue, Previous (secondary), Cancel link
- GOV.UK Error Summary (when validation fails)

## Navigation

| Action | Destination |
|--------|-------------|
| Previous | `/claims/language-used` (Screen 35) |
| Continue (valid) | `/claims/statement-of-truth` (Screen 37) |
| Cancel | `/case-list` |

## Definition of Done

- [ ] GET /claims/completing-your-claim returns 200 with correct content
- [ ] POST with valid selection redirects to /claims/statement-of-truth
- [ ] POST without selection shows validation error
- [ ] Previous button redirects to /claims/language-used
- [ ] Cancel redirects to /case-list
- [ ] Page title prefixed with "Error:" on validation failure
- [ ] All 27 tests in completingYourClaim.test.js passing
