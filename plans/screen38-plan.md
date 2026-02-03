# Screen 38: Check Your Answers - Implementation Plan

## Overview

Screen 38 is the "Check Your Answers" summary page where solicitors review all information before submitting and paying for their possession claim. This is a read-only page with hardcoded illustrative data for the prototype.

## Understanding

### User Story Summary
As a solicitor, I want to review a summary of all the information I have provided throughout the claim journey so that I can verify the details are correct before submitting and paying for my possession claim.

### Key Requirements
1. **Route**: `/claims/check-your-answers` (GET and POST)
2. **Page heading**: "Check your answers" (NO caption)
3. **Case number**: Display case number (e.g., "1234-5678-9101-1213")
4. **Summary list format**: GOV.UK summary list with dl/dt/dd semantics
5. **Content sections**:
   - Property address
   - Claimant details
   - Defendant details
   - Tenancy information
   - Grounds for possession
   - Rent arrears details
   - Applications
   - Statement of truth
6. **Change links**: Each row has a "Change" link (non-functional, illustrative only)
7. **Navigation**:
   - Previous: `/claims/statement-of-truth`
   - Submit and pay: `/claims/pay-claim-fee`
   - Cancel: `/case-list`
8. **No validation**: Read-only page with no form inputs

## Impact Analysis

### Files to Modify
1. `/prototype/src/routes/claims.js` - Add GET and POST handlers

### Files to Create
1. `/prototype/src/views/pages/claims/check-your-answers.njk` - Template

### Dependencies
- Statement of truth POST handler already redirects to `/claims/check-your-answers`
- `navigateToCheckYourAnswers` helper already exists in sessionHelper.js

## Implementation Plan

### Step 1: Add Route Handlers to claims.js

Add after the statement-of-truth routes (around line 3066):

```javascript
// ============================================================================
// Screen 38: Check Your Answers
// ============================================================================
// GET /claims/check-your-answers
router.get('/check-your-answers', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};

  res.render('pages/claims/check-your-answers', {
    pageTitle: 'Check your answers',
    caseNumber: claim.caseNumber || '1234-5678-9101-1213'
  });
});

// POST /claims/check-your-answers
router.post('/check-your-answers', (req, res) => {
  const { action } = req.body;

  // Handle Previous
  if (action === 'previous') {
    return res.redirect('/claims/statement-of-truth');
  }

  // Handle Cancel
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Default: Submit and pay - redirect to payment
  res.redirect('/claims/pay-claim-fee');
});
```

### Step 2: Create Template

Create `/prototype/src/views/pages/claims/check-your-answers.njk` with:
- Page heading: "Check your answers"
- Case number display
- GOV.UK Summary List component with hardcoded data
- Form with Previous, Submit and pay buttons
- Cancel link

### Step 3: Summary List Content

Use govukSummaryList macro with hardcoded illustrative data:
- Property address: "10 Garden Drive, Luton, Bedfordshire, LU1 1AB"
- Claimant: "A neighbourhood social housing"
- Defendant: "Billy"
- Tenancy: "Secure tenancy", "04/03/2015"
- Grounds: "Ground 10, Ground 11, Ground 12"
- Rent: "625", "Weekly"
- Arrears: "3,000"
- Statement of truth: "Claimant"

All Change links should have:
- href="#" (non-functional)
- visuallyHiddenText for accessibility

## Test Verification

Tests to satisfy (26 tests total):
- T-1.1: Page heading "Check your answers"
- T-1.2: Case number display
- T-2.1, T-2.2, T-2.3: GOV.UK summary list format (dl/dt/dd, classes)
- T-3.x: Property address section
- T-4.x: Claimant details section
- T-5.x: Defendant details section
- T-6.x: Tenancy information section
- T-7.x: Grounds for possession section
- T-8.x: Rent arrears section
- T-9.x: Applications section
- T-10.x: Statement of truth section
- T-11.x: Multiple Change links
- T-12.1: Illustrative data values
- T-13.1: Previous navigation to /claims/statement-of-truth
- T-14.1: Submit and pay navigation to /claims/pay-claim-fee
- T-14.2: Submit and pay button text
- T-15.1: Cancel navigation to /case-list
- T-16.x: Accessibility (dl/dt/dd, visually hidden text, form elements)

## Risk Assessment

- **Low risk**: Simple read-only page with no validation
- **Dependency**: statement-of-truth POST already redirects to check-your-answers
- **Dependency**: pay-claim-fee route may not exist yet (just needs redirect)

## Implementation Notes

1. No caption on this page (unlike other claim pages)
2. Submit and pay button should be green primary button
3. Previous button as secondary button
4. Cancel as a link (not button)
5. All Change links are non-functional (href="#")
6. Summary data is hardcoded for prototype
