# Screen 38: Check Your Answers - Understanding

## Summary

Screen 38 is a read-only summary page that allows the solicitor to review all information provided throughout the claim journey before final submission and payment. This is the final review step where the user can verify claim details are correct. The page displays hardcoded/illustrative summary data in GOV.UK summary list format. Change links are present for illustration purposes but are non-functional in the prototype.

## Key Behaviours

1. **Display Requirements**
   - Page heading: "Check your answers"
   - Case number displayed (e.g., "Case number: 1234-5678-9101-1213")
   - GOV.UK summary list with questions, answers, and Change links
   - No form inputs (read-only page)
   - No validation required

2. **Summary List Sections**
   - Property address
   - Claimant details
   - Defendant details
   - Tenancy information
   - Grounds for possession
   - Rent arrears
   - Applications
   - Statement of truth

3. **Summary List Format (per row)**
   - Question/label (left column)
   - Answer value (middle column)
   - "Change" link (right column, right-aligned)

4. **Data Display**
   - Summary data can be hardcoded for prototype
   - Does not need to be dynamically populated from session
   - Illustrative values representing a typical completed claim

5. **Navigation**
   - Previous: `/claims/statement-of-truth` (Screen 37)
   - Submit and pay: `/claims/pay-claim-fee` (Screen 39) - green primary button
   - Cancel: `/case-list`

## Initial Assumptions

1. The summary list uses GOV.UK summary list component pattern (dl/dt/dd elements)
2. Change links include visually hidden text for accessibility (e.g., "Change property address")
3. Change links have href="#" or are non-functional (prototype only)
4. Button text is "Submit and pay" (not "Continue")
5. The page does NOT have the "Make a claim" caption
6. All questions from the journey are displayed regardless of user's actual path
7. Multi-line answers (addresses) are formatted appropriately
8. File upload answers display illustrative filenames
9. No session data is written by this page
10. The Previous button appears before Submit and pay button
11. Cancel link appears after the buttons

## Out of Scope (per user story)

- Functional "Change" links that navigate back to specific questions
- Dynamic population of summary data from session
- Validation of any kind (read-only summary page)
- Editing answers inline on this page
- Conditional display of sections based on journey path taken
- Printing or downloading the summary
- Saving the summary as a PDF
