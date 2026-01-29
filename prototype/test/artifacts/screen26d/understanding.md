# Screen 26d — Statement of express terms

## Understanding

### Summary
This screen captures confirmation of whether a statement of express terms has been served on defendants for a demotion of tenancy. It is a conditional reveal form with optional details capture. The legal basis is the statutory requirement under Housing Act 1985 (section 82A) and Housing Act 1996 (section 143A) for demotion orders.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/select-housing-act-demotion` (Screen 26c) after selecting a Housing Act
2. Page displays heading "Statement of express terms"
3. User sees question "Have you served the defendants with a statement of the express terms which will apply to the demoted tenancy?"
4. User sees two radio button options: Yes, No
5. If user selects Yes:
   - Text area is revealed with label "Provide details of how you served the statement"
   - Details text area is optional (no required indicator)
   - User may optionally enter service details
6. If user selects No:
   - Text area remains hidden
   - Any previously entered details are retained in session
7. User clicks Continue
8. Selection and optional details stored in `session.claim.demotionOrder`
9. User redirected to `/claims/claiming-costs` (Screen 28)

### Input Variations
- **Service confirmation:** Yes or No (required)
- **Service details:** Optional text when Yes is selected (up to reasonable length, e.g. 2000 chars)
- **Revisit scenarios:**
  - Return after selecting Yes with details (pre-population)
  - Return after selecting Yes without details (pre-population, text area shown)
  - Return after selecting No (text area hidden, session data preserved)
- **Navigation:** Previous returns to Screen 26c, Cancel returns to case-list

### Constraints

#### Business Rules
- **Single choice required:** User must select Yes or No before continuing
- **Details optional:** If Yes is selected, details text area is revealed but optional to complete
- **Hidden on No:** Details field is hidden when No is selected, but session data preserved
- **Conditional visibility:** Text area only visible when Yes is selected
- **No validation of content:** The details text is not validated for legal sufficiency or format

#### Validation Rules
- **Selection required:** Must choose Yes or No
- **Error message:** "Select yes if you have served the statement of express terms"
- **Details never required:** Form submits successfully whether details are entered or not
- **GOV.UK error pattern:** Error summary at top, inline error on radio group, focus management

#### Session Structure
```javascript
session.claim.demotionOrder = {
  housingAct: 'housing-act-1985-section-82a' | 'housing-act-1996-section-143a',
  statementOfExpressTerms: 'yes' | 'no' | null,
  statementOfExpressTermsDetails: 'text' | null
}
```

**Storage rules:**
- `statementOfExpressTerms` stored as 'yes' or 'no' string
- `statementOfExpressTermsDetails` stores textarea content or null
- Both fields preserve across revisits (including partial entries when No is selected)
- Details field retains text even if user switches from Yes to No back to Yes

#### Navigation Rules
- **Previous:** `/claims/select-housing-act-demotion` (Screen 26c)
- **Continue:** `/claims/claiming-costs` (Screen 28) — only if validation passes
- **Cancel:** `/case-list` — preserves draft in session

### Initial Assumptions

1. **Form field names:** `expressTermsServed` for radio group, `expressTermsDetails` for textarea
2. **Radio values:** 'yes' and 'no' (lowercase strings)
3. **Pre-population:** Radio pre-selected and details textarea shown/hidden based on session data on revisit
4. **Error focus:** Focus moves to error summary on validation failure
5. **Textarea attributes:** Multi-line textarea (rows=5 or similar), reasonable character limit (e.g. 2000)
6. **Details label:** "Provide details of how you served the statement" (or similar, exact wording from design)
7. **Screen 26c exists:** User must have come from Screen 26c (prerequisite, no validation needed)
8. **Screen 28 exists:** Continue route to Screen 28 (claiming-costs)

### Clarifications Needed (Q1-Q8)

**Q1 - Form field names:** What should the radio and textarea field names be?
- **Proposed:** `expressTermsServed` (radio) and `expressTermsDetails` (textarea)
- **Status:** Awaiting confirmation from implementation guide

**Q2 - Radio option values:** What values should be stored in session?
- **Proposed:** 'yes' and 'no' (lowercase strings, as per user story)
- **Status:** Matches user story session structure

**Q3 - Details label exact wording:** What exact text should appear above the textarea?
- **Proposed:** "Provide details of how you served the statement"
- **Status:** Awaiting confirmation from design/user story

**Q4 - Textarea character limit:** Should there be a maximum length on details entry?
- **Proposed:** 2000 characters (reasonable limit for service method description)
- **Status:** Awaiting acceptance criteria clarification

**Q5 - Details persistence across Yes/No toggle:** Should details text survive if user toggles to No and back to Yes?
- **Proposed:** Yes, preserve text in session even when No is selected (standard pattern for conditional reveals)
- **Status:** Awaiting confirmation

**Q6 - Pre-population on empty details:** If user previously selected Yes but entered no details, should text area be shown/empty on revisit?
- **Proposed:** Yes, show empty textarea (matches user's previous Yes selection)
- **Status:** Awaiting confirmation

**Q7 - Error message wording:** Confirm exact error message text?
- **Proposed:** "Select yes if you have served the statement of express terms" (from AC-4)
- **Status:** Confirmed in user story

**Q8 - Screen 28 status:** Is `/claims/claiming-costs` (Screen 28) implemented or placeholder?
- **Proposed:** Create placeholder route if not yet implemented
- **Status:** Awaiting confirmation

### Out of Scope
- Validation of the legal sufficiency of the statement
- Collection or upload of the actual statement document
- Verification of statutory compliance with Housing Act requirements
- Service evidence collection (e.g. proof of delivery)
- Content or format validation of the details text
- Legal assessment of service methods

### Relationship to Other Screens
- **Screen 26c** (Housing Act Demotion): Previous screen, provides Housing Act context
- **Screen 26** (Alternative to Possession): Indirect upstream (entry point for demotion path)
- **Screen 28** (Claiming Costs): Next screen after successful submission
- **Case list:** Cancel destination

### Differences from Related Screens
This screen is part of the demotion of tenancy flow within Screen 26 alternatives. Unlike:
- **Screen 26a/b** (Suspension): Suspension has different follow-up requirements (reasons for suspension, etc.)
- **Screen 26c** (Housing Act Demotion): Simpler choice-only (no details), this screen adds conditional details capture
- Other claim screens: This is housing-act-specific conditional logic for demotion context

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-29 based on user story screen26d.txt.*
