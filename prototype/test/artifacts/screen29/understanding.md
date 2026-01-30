# Screen 29 — Additional Reasons for Possession

## Understanding

### Summary
This screen captures supplementary narrative context about reasons for possession that have not been captured in earlier screens. It uses a binary yes/no choice with an optional free-text textarea that is conditionally revealed when "Yes" is selected. The textarea accepts up to 6400 characters and is optional even when Yes is selected. Selection and text are persisted in session for preservation across revisits.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/claiming-costs` (Screen 28)
2. Page displays heading "Additional reasons for possession" with caption "Make a claim"
3. Question reads: "Is there any other information you'd like to provide about your reasons for possession?"
4. Two radio options: Yes, No
5. User selects Yes
6. Textarea is revealed with label "Additional reasons for possession" and hint "You can enter up to 6400 characters"
7. Textarea is optional (no "required" indicator)
8. User may enter text (up to 6400 characters) or leave blank
9. User clicks Continue
10. Selection and text stored in `session.claim.additionalReasons = { hasAdditionalReasons: 'yes' | 'no', additionalReasonsText: 'text' | null }`
11. User redirected to next screen (Screen 30, route TBD)

### Input Variations
- **Selection:** Yes or No
- **Textarea content:** Empty (when Yes selected), or text up to 6400 characters
- **Revisit scenario:** User returns and sees pre-selected radio and pre-filled textarea
- **Selection change:** User toggles between Yes and No, text persists in session
- **Validation errors:** No selection made, or validation failure

### Constraints

#### Business Rules
- **Binary choice required:** User must select Yes or No before continuing
- **Textarea is optional:** Even when Yes is selected, textarea submission is not required
- **Conditional reveal:** Textarea only visible when Yes is selected
- **Character limit:** 6400 characters maximum (enforced frontend and backend)
- **No content validation:** The screen does not validate legal relevance or accuracy of content
- **No supplementary functions:** No auto-completion, real-time legal guidance, or document uploads

#### Validation Rules
- **Selection required:** Must choose Yes or No; error if neither selected
- **Selection error message:** "Select yes if you would like to provide additional reasons for possession"
- **Textarea optional:** No error if Yes selected and textarea is empty
- **Character limit enforcement:** Textarea prevents input beyond 6400 characters (maxlength attribute)
- **GOV.UK error pattern:** Error summary at top, inline error, focus management

#### Session Structure
```javascript
session.claim.additionalReasons = {
  hasAdditionalReasons: 'yes' | 'no' | null,
  additionalReasonsText: 'text' | null
}
```

**Storage rules:**
- Yes selected, no text → `{ hasAdditionalReasons: 'yes', additionalReasonsText: null }`
- Yes selected, text entered → `{ hasAdditionalReasons: 'yes', additionalReasonsText: 'text...' }`
- No selected → `{ hasAdditionalReasons: 'no', additionalReasonsText: null }`
- Initial/null state → `{ hasAdditionalReasons: null, additionalReasonsText: null }`
- Revisit with previous Yes, text retained when switching to No then back to Yes

#### Navigation Rules
- **Previous:** `/claims/claiming-costs` (Screen 28); selection and text preserved
- **Continue:** Next screen (Screen 30 route TBD); redirect only if validation passes
- **Cancel:** `/case-list`; claim draft remains in session

### Initial Assumptions

1. **Storage format:** String values 'yes' or 'no'; null on first visit
2. **Textarea field name:** `additionalReasonsText` for text input
3. **Radio field name:** `hasAdditionalReasons`
4. **Character limit:** 6400 characters enforced via maxlength attribute on frontend
5. **Character counter:** Optional display of remaining characters (nice-to-have for UX)
6. **Pre-population:** Radio pre-selected and textarea pre-filled if session contains values
7. **Text persistence:** Text retained in session when user toggles between Yes/No
8. **Error focus:** Focus moves to error summary on validation failure
9. **Hint text visible:** Shown when textarea is revealed (unconditional)
10. **Next screen route TBD:** Implementation assumes placeholder route to avoid blocking

### Out of Scope
- Content validation (legal relevance, accuracy, completeness)
- Automatic ground-of-possession determination based on text
- Real-time legal guidance or auto-completion suggestions
- Document or evidence upload functionality
- Cost or judgment implications of additional reasons
- Judge review logic or automatic referral

### Relationship to Other Screens
- **Screen 28** (Claiming Costs): Previous screen; user clicks Continue to reach Screen 29
- **Screen 30** (TBD): Next screen; user reaches via Continue button
- **Case list:** Cancel destination

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-29 based on user story screen29.txt.*
