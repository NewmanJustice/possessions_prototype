# Screen 26b Implementation Plan

## Screen 26b: Reasons for requesting a suspension order

---

## Summary

**Screen Title:** Reasons for requesting a suspension order

**Purpose:** Allow solicitors to provide optional free-text reasons for requesting a suspension of the right to buy. This context helps the court understand why this alternative to possession is being sought.

**Route:**
- `GET /claims/reasons-for-suspension` - Display form
- `POST /claims/reasons-for-suspension` - Process form submission

**Navigation Flow:**
- **Entry:** From `/claims/alternative-to-possession` (Screen 26) after selecting "Suspension of right to buy"
- **Exit (Continue):** To `/claims/claiming-costs` (Screen 28)
- **Exit (Previous):** Back to `/claims/alternative-to-possession` (Screen 26)
- **Exit (Cancel):** To `/case-list`

---

## Understanding

### Key Behaviours from User Story

1. **Optional Field:** Users are not required to enter reasons - empty submission is valid
2. **Single Text Area:** One text input field for free-text reasons
3. **Character Limit:** Maximum 950 characters when text is provided
4. **Validation Error:** Display GOV.UK error pattern (summary + inline error) if over 950 chars
5. **Pre-population:** Previously entered reasons are preserved when user revisits
6. **Session Persistence:** Reasons stored as `session.claim.suspensionOrder.reasons` (string or null)
7. **Navigation Flexibility:** Previous button skips validation and returns to Screen 26
8. **Cancel Action:** Discards form input and returns to case-list

### Test Coverage

- **Total Tests:** 29 executable test cases (organized into 10 acceptance criteria suites)
- **Test File:** `prototype/test/routes/reasonsForSuspension.test.js` (already exists)
- **Key Coverage Areas:**
  - Page rendering and content (AC-1)
  - Textarea display with proper attributes (AC-2)
  - Optional field acceptance (AC-3)
  - Character limit validation at boundary (AC-4)
  - Session persistence and data handling (AC-5)
  - Pre-population on revisit (AC-6)
  - Navigation (Previous, Continue, Cancel) (AC-7, AC-8, AC-9)
  - Accessibility compliance (AC-10)

---

## Files to Create/Modify

### 1. Route Handler
**File:** `/workspaces/possessions_prototype/prototype/src/routes/claims.js`

**Description:** Add GET and POST route handlers for `/claims/reasons-for-suspension`

**Changes:**
- Add route section header for Screen 26b
- Implement `GET /claims/reasons-for-suspension` to display form with pre-populated data
- Implement `POST /claims/reasons-for-suspension` to handle form submission
- Include validation logic for character limit (950 chars max)
- Handle navigation actions (previous, continue, cancel)
- Persist data to `session.claim.suspensionOrder.reasons`

### 2. Template
**File:** `/workspaces/possessions_prototype/prototype/src/views/pages/claims/reasons-for-suspension.njk`

**Description:** Create Nunjucks template for the form page

**Changes:**
- Create new file (does not exist yet)
- Display page heading: "Reasons for requesting a suspension order"
- Display guidance text explaining purpose
- Render GOV.UK error summary (conditional on validation errors)
- Render textarea with:
  - Name: `reasons`
  - ID: `reasons`
  - Label: "Explain the reasons for requesting a suspension order"
  - Max length: 950 characters
  - Pre-populated with session data
  - Inline error message (if validation failed)
- Render button group with Previous, Continue, and Cancel buttons

**Note:** Consider using `govukCharacterCount` component for better UX (live character counter)

---

## Implementation Steps

### Step 1: Create Route Handler Structure
1. Identify insertion point in `/prototype/src/routes/claims.js` (after Screen 29 handlers)
2. Add section header comment: `// ============================================================================ // Screen 26b: Reasons for requesting a suspension order // ============================================================================`
3. Create validation function `validateReasonsForSuspension(body)` to:
   - Check if `reasons` field exists and exceeds 950 characters
   - Return errors array with proper structure (field, href, text)
   - Return empty array if validation passes

### Step 2: Implement GET Handler
1. Extract `suspensionOrder` object from session (or create empty object)
2. Extract `reasons` value from `suspensionOrder.reasons` (or empty string if not set)
3. Render template with:
   - `reasons: value` (for textarea pre-population)
   - `errors: []` (no errors on initial page load)
   - Standard page properties (pageTitle, etc.)

### Step 3: Implement POST Handler - Navigation Logic
1. Handle Previous action: check `req.body.action === 'previous'`
   - Redirect to `/claims/alternative-to-possession` (no validation)
2. Handle Cancel action: check `req.body.action === 'cancel'`
   - Redirect to `/case-list` (no validation)
3. Handle Continue action: default path for form submission
   - Execute validation (next steps)

### Step 4: Implement POST Handler - Validation
1. Call `validateReasonsForSuspension(req.body)`
2. If errors exist:
   - Status 200 (not a redirect)
   - Re-render template with:
     - Errors array from validation
     - Original form values (preserve user input)
3. If no errors:
   - Continue to session update (next step)

### Step 5: Implement POST Handler - Session Persistence
1. Ensure `req.session.claim.suspensionOrder` object exists (create if needed)
2. Extract and trim input: `const reasons = req.body.reasons?.trim() || null;`
   - If empty or whitespace-only, store as `null`
   - Otherwise, store trimmed string
3. Update session: `req.session.claim.suspensionOrder.reasons = reasons;`
4. Redirect to `/claims/claiming-costs`

### Step 6: Create Template File
1. Create `/prototype/src/views/pages/claims/reasons-for-suspension.njk`
2. Extend main layout
3. Set page title in block
4. Add error summary (conditional)
5. Add heading and guidance paragraph
6. Create form with POST method to `/claims/reasons-for-suspension`
7. Add textarea field (using govukCharacterCount or govukTextarea)
8. Add button group with Previous, Continue, Cancel buttons

### Step 7: Verify Session Helper
1. Confirm `navigateToReasonsForSuspension` function exists in sessionHelper
2. Function should navigate through entire flow up to Screen 26b
3. No changes needed if already implemented

### Step 8: Run Test Suite
1. Execute: `npm test -- --grep "Screen 26b"`
2. Verify all 29 tests pass
3. Check eslint compliance: `npm run lint`
4. Verify no skipped tests

---

## Session Data

### Session Keys to Read

**On GET request:**
```javascript
req.session.claim?.suspensionOrder?.reasons
```

### Session Keys to Write

**On successful POST (after validation):**
```javascript
req.session.claim.suspensionOrder.reasons = value
// Where value is:
//   - null (if input is empty or whitespace only)
//   - string (if valid text provided)
```

### Session Object Structure

```javascript
session.claim.suspensionOrder = {
  // ... existing fields from Screen 26a (if any)
  reasons: string | null
}
```

**Important:** Use object merge/spread to preserve any existing `suspensionOrder` data from Screen 26a

---

## Validation Rules

### Character Limit Validation

| Field | Rule | Error Message | Error Field | Error Link |
|-------|------|---------------|-------------|-----------|
| reasons | Max 950 characters | "Enter 950 characters or fewer" | reasons | #reasons |

### Validation Conditions

1. **Required:** No - field is optional
2. **Boundary:**
   - 949 characters: ✓ Accepted
   - 950 characters: ✓ Accepted (exactly at limit)
   - 951 characters: ✗ Rejected (over limit)
3. **Empty Submission:** ✓ Accepted (no error)
4. **Whitespace Only:** Treated as empty (converted to null)

### Validation Logic Implementation

```javascript
function validateReasonsForSuspension(body) {
  const errors = [];

  // Check max length (only if text is provided)
  if (body.reasons && body.reasons.length > 950) {
    errors.push({
      field: 'reasons',
      href: '#reasons',
      text: 'Enter 950 characters or fewer'
    });
  }

  return errors;
}
```

---

## Template Components

### GOV.UK Components Required

1. **Error Summary** (`govukErrorSummary`)
   - Display on validation failure only
   - Title: "There is a problem"
   - tabindex: "-1" for focus management

2. **Character Count Textarea** (`govukCharacterCount`)
   - Name: `reasons`
   - ID: `reasons`
   - Max length: 950
   - Label: "Explain the reasons for requesting a suspension order"
   - Show character count (optional but recommended)

   **OR**

   **Textarea** (`govukTextarea`) if character count unavailable
   - Name: `reasons`
   - ID: `reasons`
   - Maxlength attribute: 950
   - Label: "Explain the reasons for requesting a suspension order"

3. **Button Group** (`govukButton`)
   - Continue button (primary, name: "action", value: "continue")
   - Previous button (secondary, name: "action", value: "previous")
   - Cancel button (secondary, name: "action", value: "cancel")

### Error Handling

- **Inline Error:** Display error message with textarea (integrated into govukCharacterCount/govukTextarea)
- **Error Link:** Error summary links to `#reasons` for focus management
- **Pre-population:** Textarea value set from session data
- **Error Preservation:** User input preserved when validation fails

---

## Risks / Questions

### Identified Risks

1. **Session Namespace Collision:** Must not overwrite existing `suspensionOrder` data from Screen 26a
   - **Mitigation:** Use object spread/merge when updating session
   - **Verification:** Test that existing suspensionOrder fields are preserved

2. **Character Count Boundary:** Off-by-one errors at 950-character boundary
   - **Mitigation:** Explicit tests for 949, 950, 951 characters
   - **Status:** Tests already exist in test file

3. **Navigation Path Clarity:** User story mentions Screen 26, but flow suggests Screen 26a as predecessor
   - **Status:** Implementation follows user story (Previous → Screen 26)
   - **Flag:** Verify navigation with Steve if user encounters flow issues

4. **Empty vs Null Storage:** Confusion between empty string and null
   - **Mitigation:** Explicit logic to convert empty strings to null
   - **Verification:** Test case AC-5 validates this

### Questions for Steve/Nigel

1. Should character count component display live character counter? (currently implemented as regular textarea)
2. Is the 950-character limit confirmed (not 1000 like some other screens)?
3. Should we trim whitespace from input before validation?
4. Is previous navigation destination definitely Screen 26 (alternative-to-possession)?

---

## Definition of Done

### Acceptance Criteria Met

- [ ] All 29 tests passing: `npm test -- --grep "Screen 26b"`
- [ ] ESLint passing: `npm run lint`
- [ ] Route accessible at `GET /claims/reasons-for-suspension`
- [ ] Route accepts POST at `/claims/reasons-for-suspension`
- [ ] Form displays with heading and guidance text
- [ ] Textarea pre-populated with previously saved data
- [ ] Optional field accepts empty submission
- [ ] Character limit validation enforced at 950 characters
- [ ] GOV.UK error pattern implemented (summary + inline)
- [ ] Session data persisted correctly (`session.claim.suspensionOrder.reasons`)
- [ ] Previous button navigates to Screen 26 without validation
- [ ] Continue button navigates to Screen 28 on success
- [ ] Cancel button navigates to case-list
- [ ] Accessibility compliance: error summary focus management working
- [ ] No skipped tests
- [ ] Code follows project conventions and patterns

### Testing Checklist

- [ ] AC-1: Page heading and guidance displayed correctly
- [ ] AC-2: Textarea with proper name and id attributes
- [ ] AC-3: Optional field behavior (empty submission accepted)
- [ ] AC-4: Character limit validation (950 max)
- [ ] AC-5: Session persistence (reasons stored as string or null)
- [ ] AC-6: Pre-population on revisit
- [ ] AC-7: Previous navigation without validation
- [ ] AC-8: Continue navigation with validation
- [ ] AC-9: Cancel navigation
- [ ] AC-10: Accessibility compliance (error summary, focus, labels)

### Quality Checklist

- [ ] No console errors in test output
- [ ] No linting warnings
- [ ] Code is readable and well-commented
- [ ] Follows existing project patterns and conventions
- [ ] Handles edge cases gracefully
- [ ] Proper error handling and validation

---

## Implementation Notes

### Pattern Adherence

- Follow the pattern used in Screen 29 (`additional-reasons-for-possession`)
- Use same error handling approach as other textarea screens
- Maintain consistent navigation button structure
- Use existing govuk-frontend components

### Key Implementation Details

1. **Optional Field:** Do not add "required" validation - empty submission must be valid
2. **Null Storage:** Store `null` when field is empty, not empty string
3. **Preserve Data:** Use object spread/merge to avoid overwriting other `suspensionOrder` fields
4. **Character Count:** Use GOV.UK character count component for better UX (if available)
5. **Simple Screen:** This is intentionally simple - single textarea, one validation rule, no conditional reveals

### Estimated Effort

- Route handler implementation: ~30 minutes
- Template creation: ~20 minutes
- Testing and debugging: ~20 minutes
- **Total:** ~70 minutes

---

*Plan created by Claude (Developer Agent) on 2026-02-02 for Screen 26b implementation*
