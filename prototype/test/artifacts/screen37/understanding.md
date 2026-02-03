# Screen 37: Statement of Truth - Understanding

## Summary

Screen 37 is a critical legal step where the solicitor acknowledges the statement of truth and identifies who is completing the statement. The statement warns about contempt of court proceedings for false statements. This is required by Civil Procedure Rules and creates a verified record of legal responsibility for claim accuracy.

## Key Behaviours

1. **Display Requirements**
   - Page heading: "Statement of truth"
   - Case number displayed (e.g., "Case number: 1234-5678-9101-1213")
   - Statement of truth text about contempt of court proceedings
   - Question legend (bold): "Completed by"
   - Two radio options with no default selection
   - Note: This screen does NOT include the "Make a claim" caption

2. **Radio Options**
   - "Claimant" (value: `claimant`)
   - "Claimant's legal representative (as defined by CPR 2.3 (1))" (value: `legal-representative`)

3. **Validation**
   - Selection is mandatory
   - Error message: "Select who completed this statement"

4. **Data Persistence**
   - Session field: `session.claim.statementOfTruth.completedBy`
   - Values: `'claimant'` | `'legal-representative'` | `null`

5. **Navigation**
   - Previous: `/claims/completing-your-claim` (Screen 36)
   - Continue: `/claims/check-your-answers` (Screen 38)
   - Cancel: `/case-list`

## Initial Assumptions

1. The two radio options are mutually exclusive (single selection only)
2. Session field value uses lowercase kebab-case (`'claimant'` and `'legal-representative'`)
3. The error message follows GOV.UK pattern for required radio selections
4. Case number display follows existing pattern used on other screens
5. Previous destination is always Screen 36 regardless of prior selections
6. Continue destination is always Screen 38 regardless of which option is selected
7. The form field name is `completedBy` to match session structure
8. Proceeding past this screen constitutes implicit acknowledgement of the statement

## Out of Scope (per user story)

- Capturing an actual signature or electronic signature
- Recording a timestamp of when the statement was acknowledged
- Conditional content based on who completes the statement
- Additional fields for legal representative details (name, firm, etc.)
- Different statement text based on the "completed by" selection
- Integration with CPR validation systems
