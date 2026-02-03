# Screen 36: Completing Your Claim - Understanding

## Summary

Screen 36 is a decision point where the solicitor chooses whether to submit and pay for their claim now, or save it as a draft for later completion. This screen captures workflow preference, allowing users to control the timing of their submission.

## Key Behaviours

1. **Display Requirements**
   - Page heading: "Completing your claim"
   - Caption: "Make a claim"
   - Case number displayed
   - Explanatory text explaining the two options
   - Bulleted list describing each option's workflow
   - Question legend: "What would you like to do next?"
   - Two radio options with no default selection

2. **Radio Options**
   - "Submit and pay for my claim now" (value: `submit-now`)
   - "Save it for later" (value: `save-for-later`)

3. **Validation**
   - Selection is mandatory
   - Error message: "Select what you would like to do next"

4. **Data Persistence**
   - Session field: `session.claim.completionPreference.preference`
   - Values: `'submit-now'` | `'save-for-later'` | `null`

5. **Navigation**
   - Previous: `/claims/language-used` (Screen 35)
   - Continue: `/claims/statement-of-truth` (Screen 37)
   - Cancel: `/case-list`

## Initial Assumptions

1. Both radio options route to the same next screen (`/claims/statement-of-truth`) in the prototype
2. The form field name is `completionPreference` (to match session structure)
3. Case number display follows existing pattern (e.g., "1234-5678-9101-1213")
4. Previous navigation preserves entered data in session
5. Cancel preserves claim draft but returns to case list
6. Error summary follows GOV.UK patterns with focus management

## Out of Scope (per user story)

- Branching journey based on selection (prototype only)
- Actual save-as-draft persistence beyond session
- Payment processing integration
- Email notifications about saved drafts
