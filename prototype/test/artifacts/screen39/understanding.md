# Screen 39: Pay Claim Fee - Understanding

## Summary

Screen 39 is the FINAL screen in the claims journey. The solicitor arrives here after submitting their claim on Screen 38 (Check Your Answers). This is a confirmation/payment redirect page that displays the case number and provides options to pay the claim fee or return to the case list. No form inputs exist on this page - only links and buttons.

## Q1-Q6 Clarification Pattern

### Q1: What is the primary purpose of this screen?
To confirm claim submission and direct the solicitor to pay the claim fee. This is a read-only landing page providing payment options.

### Q2: What data is captured on this screen?
None. This is a read-only page with no form inputs.

### Q3: What is the entry point to this screen?
Screen 38 (Check Your Answers) - after clicking "Submit and pay" button.

### Q4: What are the exit points from this screen?
1. "Pay £404 claim fee" button -> `/case-list` (simulates payment redirect)
2. "Pay the claim fee" link -> `/case-list` (simulates payment redirect)
3. "Close and return to case details" button -> `/case-list`

### Q5: What validation is required?
None. No form inputs exist.

### Q6: What session data is read/written?
- Read: Case number (may be hardcoded for prototype)
- Write: None

## Key Behaviours

1. **Display Requirements**
   - Page heading: "Pay claim fee"
   - Case number displayed (e.g., "Case number: 1234-5678-9101-1213")
   - Primary payment button: "Pay £404 claim fee" (styled as GOV.UK start button)
   - Section heading: "Make a payment"
   - Instructional paragraph with embedded payment link
   - Secondary button: "Close and return to case details"

2. **Navigation**
   - All payment links/buttons redirect to `/case-list` (prototype behaviour)
   - No Previous button (claim has been submitted)
   - No Cancel link (claim has been submitted)

3. **Button Styling**
   - Primary payment button: Start button (large, green, with arrow)
   - Close and return button: Secondary button (grey)

## Initial Assumptions

1. The claim fee is fixed at £404 for the prototype
2. The case number format follows "1234-5678-9101-1213" pattern
3. The "Pay £404 claim fee" button uses GOV.UK start button pattern (isStartButton: true)
4. The "Close and return to case details" button is secondary styled
5. No Previous button because the claim has already been submitted
6. No Cancel link because the claim has already been submitted
7. The page has no form elements that accept user input
8. All three navigation options (button, link, close button) go to /case-list
9. The "Make a payment" heading is an h2 element
10. The payment instruction text appears between the heading and close button
11. This page uses GET-only routing (no POST handler required)
12. The case number can be hardcoded for the prototype

## Out of Scope (per user story)

- Actual payment integration (GOV.UK Pay)
- Payment confirmation or receipt page
- Error handling for failed payments
- Payment status tracking
- Email notifications about payment
- Dynamic calculation of claim fee
- Storing payment status in session
- Displaying different content based on payment status
