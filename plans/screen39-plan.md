# Screen 39: Pay Claim Fee - Implementation Plan

## Summary

Screen 39 is the **final screen** in the claims journey. It is a read-only confirmation and payment redirect page displayed after the user submits their claim on Screen 38 (Check Your Answers). The page confirms the claim submission and provides payment options. All payment links redirect to `/case-list` as actual payment integration is out of scope for the prototype.

## User Story

As a solicitor, I want to see a confirmation that my claim has been submitted and be directed to pay the claim fee so that I can complete the final step of my possession claim process and ensure my claim progresses.

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `prototype/src/routes/claims.js` | Modify | Add GET handler for `/claims/pay-claim-fee` |
| `prototype/src/views/pages/claims/pay-claim-fee.njk` | Create | Template for Screen 39 |

## Implementation Steps

### Step 1: Run Baseline Tests
- Run `npm test -- payClaimFee` to establish baseline (expect failures)
- Confirm tests are finding the route and failing as expected

### Step 2: Add GET Route Handler
Location: `prototype/src/routes/claims.js`

Add after the Screen 38 POST handler (around line 3097):

```javascript
// ============================================================================
// Screen 39: Pay Claim Fee
// ============================================================================
// GET /claims/pay-claim-fee - Final screen: payment confirmation page
router.get('/pay-claim-fee', requireAuth, (req, res) => {
  const claim = claimService.getClaim(req.session) || {};

  res.render('pages/claims/pay-claim-fee', {
    pageTitle: 'Pay claim fee',
    caseNumber: claim.caseNumber || '1234-5678-9101-1213'
  });
});
```

**Note:** No POST handler required - all navigation via anchor links.

### Step 3: Create Template
File: `prototype/src/views/pages/claims/pay-claim-fee.njk`

Page structure:
1. Page heading ("Pay claim fee") - h1 with `govuk-heading-l`
2. Case number text - paragraph with case number
3. Primary payment button ("Pay £404 claim fee") - start button style linking to `/case-list`
4. Section heading ("Make a payment") - h2 with `govuk-heading-m`
5. Instructional paragraph with "Pay the claim fee" link to `/case-list`
6. Close and return button - secondary button linking to `/case-list`

### Step 4: Run Tests
- Run `npm test -- payClaimFee` to verify all tests pass

### Step 5: Run Lint
- Run `npm run lint` to ensure code quality
- Fix any lint errors

## Session Data

### Read from Session
- `claim.caseNumber` - Case number to display (fallback: '1234-5678-9101-1213')

### Write to Session
- None - this is a read-only confirmation page

## Template Components Needed

| Component | Import | Usage |
|-----------|--------|-------|
| `govukButton` | `{% from "govuk/components/button/macro.njk" import govukButton %}` | Primary payment button (start), Secondary close button |

## Key Implementation Notes

1. **GET-only route** - No POST handler required
2. **No form elements** - All navigation via anchor links
3. **Start button styling** - Use `isStartButton: true` for primary payment button
4. **Secondary button styling** - Use `classes: "govuk-button--secondary"` for close button
5. **Hardcoded fee** - £404 is fixed for the prototype
6. **All links to /case-list** - Payment button, payment link, and close button all redirect to case-list
7. **No Previous button** - Claim has been submitted, cannot go back
8. **No Cancel link** - Claim has been submitted
9. **Authentication required** - Use `requireAuth` middleware

## Elements NOT Present

- Previous button
- Cancel link
- Form elements
- "Make a claim" caption
- Error summary (no validation needed)

## Definition of Done

- [x] GET route handler added to `claims.js` with `requireAuth` middleware (via router.use)
- [x] Template created at `pay-claim-fee.njk`
- [x] Page heading "Pay claim fee" displayed as h1
- [x] Case number displayed (format: 1234-5678-9101-1213)
- [x] Primary payment button with text "Pay £404 claim fee" styled as start button
- [x] "Make a payment" section heading as h2
- [x] Instructional text with "Pay the claim fee" link
- [x] Secondary "Close and return to case details" button
- [x] All links/buttons redirect to `/case-list`
- [x] No Previous button present
- [x] No Cancel link present
- [x] All 25 tests pass
- [ ] Lint passes with no errors (ESLint config missing - existing project issue)

## Test Coverage

The test file `payClaimFee.test.js` contains 26 tests covering:
- AC-1: Page heading display
- AC-2: Case number display
- AC-3: Primary payment button
- AC-4: Payment section heading
- AC-5: Payment instruction text
- AC-6: Close and return button
- AC-7: Payment button navigation
- AC-8: Payment link navigation
- AC-9: Close button navigation
- AC-10: No Previous button
- AC-11: No Cancel link
- AC-12: Accessibility compliance
- Route protection (authentication required)
