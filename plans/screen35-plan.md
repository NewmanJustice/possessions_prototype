# Implementation Plan - Screen 35: Language Used

## Summary

Screen 35 captures which language(s) the user used to complete the service (English, Welsh, or both). This information is used to ensure claims completed wholly or partially in Welsh can be processed correctly by the Welsh Language Unit.

## Route Configuration

- **GET** `/claims/language-used` - Display the language selection form
- **POST** `/claims/language-used` - Handle form submission

## Files to Create/Modify

### Files to Create
1. `prototype/src/views/pages/claims/language-used.njk` - Template for the language used screen

### Files to Modify
1. `prototype/src/routes/claims.js` - Add GET and POST route handlers

## Session Data Structure

```javascript
session.claim.languageUsed = {
  language: 'english' | 'welsh' | 'english-and-welsh' | null
}
```

## Implementation Steps

### Step 1: Create Template

Create `language-used.njk` following the pattern from `applications.njk`:
- Error summary (conditionally displayed)
- Caption: "Make a claim"
- Page heading: "Language used"
- Case number display
- Question legend: "Which language did you use to complete this service?"
- Hint text about Welsh questions
- Radio buttons (English, Welsh, English and Welsh)
- Continue/Previous/Cancel buttons

### Step 2: Add GET Route Handler

Add to `claims.js` after Screen 34 routes (after line 2857):
```javascript
// GET /claims/language-used - Screen 35
router.get('/language-used', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const languageUsedData = claim.languageUsed || {};
  const language = languageUsedData.language || null;
  const caseNumber = claim.caseNumber || null;

  res.render('pages/claims/language-used', {
    pageTitle: 'Language used',
    language,
    caseNumber,
    errors: {},
    errorList: []
  });
});
```

### Step 3: Add POST Route Handler

```javascript
// POST /claims/language-used - Screen 35
router.post('/language-used', (req, res) => {
  const { language, action } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/applications');
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  if (!language) {
    errors.language = { text: 'Select which language you used to complete this service' };
    errorList.push({ text: 'Select which language you used to complete this service', href: '#language' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    const caseNumber = claim.caseNumber || null;

    return res.status(200).render('pages/claims/language-used', {
      pageTitle: 'Language used',
      language: language || null,
      caseNumber,
      errors,
      errorList
    });
  }

  // Store in session
  claimService.updateClaim(req.session, 'languageUsed', { language });

  // Redirect to Screen 36
  res.redirect('/claims/completing-your-claim');
});
```

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| language | Required | "Select which language you used to complete this service" |

## Template Components

- `govukErrorSummary` - For validation errors
- `govukRadios` - For language selection
- `govukButton` - For Continue, Previous, Cancel actions

### Radio Configuration

```javascript
{
  name: 'language',
  idPrefix: 'language',
  fieldset: {
    legend: {
      text: 'Which language did you use to complete this service?',
      classes: 'govuk-fieldset__legend--m'
    }
  },
  hint: {
    text: "If someone else helped you to answer a question in this service, ask them if they answered any questions in Welsh. We'll use this to make sure your claim is processed correctly"
  },
  items: [
    { value: 'english', text: 'English' },
    { value: 'welsh', text: 'Welsh' },
    { value: 'english-and-welsh', text: 'English and Welsh' }
  ]
}
```

## Navigation

| Action | Destination |
|--------|-------------|
| Previous | `/claims/applications` (Screen 34) |
| Continue (valid) | `/claims/completing-your-claim` (Screen 36) |
| Cancel | `/case-list` |

## Error State

When validation fails:
- Page title prefixed with "Error: "
- Error summary displayed at top with `tabindex="-1"` for focus
- Inline error on radio group
- Previous selection preserved in form

## Definition of Done

- [x] 29 tests passing in `languageUsed.test.js`
- [x] Template displays all required content
- [x] Validation works correctly
- [x] Session persistence works
- [x] Navigation works correctly (Previous, Continue, Cancel)
- [x] Error state displays correctly
- [ ] Lint passes (pre-existing ESLint config issue - not related to this implementation)

## Test Summary

The test file contains 29 tests covering:
- AC-1: Page heading, caption, and case number display (3 tests)
- AC-2: Question and hint text display (2 tests)
- AC-3: Radio options display (5 tests)
- AC-4: Required validation (3 tests)
- AC-5: Persist language selection (3 tests)
- AC-6: Preserve selection on revisit (4 tests)
- AC-7: Previous navigation (1 test)
- AC-8: Continue navigation (3 tests)
- AC-9: Cancel behaviour (1 test)
- AC-10: Accessibility compliance (3 tests)
- AC-11: Page title error state (1 test)
