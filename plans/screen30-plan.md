# Implementation Plan - Screen 30: Underlessee or Mortgagee

## Summary

Screen 30 captures whether there is an underlessee (subtenant) or mortgagee (mortgage lender) who has a legal right to claim relief against forfeiture. This is a simple yes/no question with no conditional reveal.

## Route

- **GET** `/claims/underlessee-or-mortgagee` - Render the page
- **POST** `/claims/underlessee-or-mortgagee` - Handle form submission

## Files to Create/Modify

### Create
- `prototype/src/views/pages/claims/underlessee-or-mortgagee.njk` - Template for Screen 30

### Modify
- `prototype/src/routes/claims.js` - Add GET/POST route handlers
- (Note: Screen 29's redirect already points to `/claims/check-answers` - need to update to `/claims/underlessee-or-mortgagee`)

## Implementation Steps

1. **Create the template** (`underlessee-or-mortgagee.njk`)
   - Extends `layouts/main.njk`
   - Import govukErrorSummary, govukRadios, govukButton macros
   - Display caption "Make a claim"
   - Display page heading "Underlessee or mortgagee entitled to claim relief against forfeiture"
   - Display case number
   - Display explanatory text
   - Display yes/no radio group with legend question
   - Display button group (Continue, Previous, Cancel)

2. **Add GET route handler** (`/claims/underlessee-or-mortgagee`)
   - Get session data: `session.claim.underlesseeOrMortgagee.hasUnderlesseeOrMortgagee`
   - Render template with session value for pre-population

3. **Add POST route handler** (`/claims/underlessee-or-mortgagee`)
   - Handle Cancel action: redirect to `/case-list`
   - Handle Previous action: redirect to `/claims/additional-reasons-for-possession`
   - Validate selection (required)
   - On error: re-render with error messages
   - On success: store in session and redirect to next screen

4. **Update Screen 29 redirect**
   - Change redirect from `/claims/check-answers` to `/claims/underlessee-or-mortgagee`

## Session Data

### Read
- `session.claim.underlesseeOrMortgagee.hasUnderlesseeOrMortgagee` - Pre-populate radio selection

### Write
- `session.claim.underlesseeOrMortgagee.hasUnderlesseeOrMortgagee` - Store 'yes' or 'no'

## Validation Rules

| Field | Rule | Error Message | Error Target |
|-------|------|---------------|--------------|
| hasUnderlesseeOrMortgagee | Required | "Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture" | #hasUnderlesseeOrMortgagee |

## Navigation

| Action | Destination |
|--------|-------------|
| Previous | `/claims/additional-reasons-for-possession` (Screen 29) |
| Continue (valid) | `/claims/check-answers` (placeholder for Screen 31 TBD) |
| Cancel | `/case-list` |

## Template Components

- `govukErrorSummary` - Error summary with tabindex="-1" for focus
- `govukRadios` - Radio group with:
  - name: `hasUnderlesseeOrMortgagee`
  - idPrefix: `hasUnderlesseeOrMortgagee`
  - Legend: "Is there an underlessee or mortgagee entitled to claim relief against forfeiture?"
  - Items: Yes/No
  - Error message support
- `govukButton` - Continue, Previous, Cancel buttons in button group

## Test Coverage

The test file (`prototype/test/routes/underlesseeOrMortgagee.test.js`) covers:
- AC-1: Page heading and explanatory text
- AC-2: Question and radio options
- AC-3: Required selection validation
- AC-4: Session persistence
- AC-5: Pre-selection on revisit
- AC-6: Previous navigation
- AC-7: Continue navigation
- AC-8: Cancel behaviour
- AC-9: Accessibility compliance

---

*Plan created: 2026-01-30*
