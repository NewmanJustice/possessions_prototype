# Screen 26b — Reasons for requesting a suspension order

## Understanding

### Summary
This screen captures optional free-text reasons for requesting a suspension of the right to buy. It presents a simple textarea for the solicitor to explain why they are seeking this alternative to possession. The field is optional but has a 950 character limit when text is provided.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/alternative-to-possession` (Screen 26) having selected "Suspension of right to buy"
2. Page displays heading "Reasons for requesting a suspension order"
3. User sees guidance text explaining the purpose of providing reasons
4. User sees a textarea labelled "Explain the reasons for requesting a suspension order"
5. User may enter reasons (optional) or leave blank
6. User clicks Continue
7. Reasons (or null if empty) stored in `session.claim.suspensionOrder.reasons`
8. User redirected to `/claims/claiming-costs` (Screen 28)

### Input Variations
- **Empty textarea:** User leaves field blank and submits (valid)
- **Reasons provided:** User enters free text up to 950 characters (valid)
- **Exceeded limit:** User enters more than 950 characters (validation error)
- **Revisit scenario:** User returns and sees previously entered text
- **Navigation:** Previous returns to Screen 26, Cancel returns to case-list

### Constraints

#### Business Rules
- **Optional field:** User is not required to provide reasons
- **Character limit:** Maximum 950 characters when text is provided
- **Single textarea:** One text input field

#### Validation Rules
| Field | Rule | Error Message |
|-------|------|---------------|
| reasons | Max 950 chars | "Enter 950 characters or fewer" |

Note: No "required" validation - field is optional.

#### GOV.UK Error Pattern
- Error summary at top of page (when validation fails)
- Inline error message below label
- Error link targets textarea
- Focus moves to error summary

#### Session Structure
```javascript
session.claim.suspensionOrder = {
  // ... other fields from Screen 26a
  reasons: string | null
}
```

**Storage rules:**
- `reasons` is `null` when no text is entered
- `reasons` stores the entered text as a string when provided
- Existing `suspensionOrder` object is extended (not replaced)

#### Navigation Rules
- **Previous:** `/claims/alternative-to-possession` (Screen 26)
- **Continue:** `/claims/claiming-costs` (Screen 28)
- **Cancel:** `/case-list`

### Initial Assumptions

1. **Form field name:** `reasons` for the textarea
2. **Textarea ID:** `reasons` (same as name)
3. **Character count:** GOV.UK character count component may be used
4. **Pre-population:** Textarea pre-populated based on session data on revisit
5. **Error focus:** Focus moves to error summary on validation failure
6. **Null vs empty:** Empty string treated as null for storage

### Clarifications Needed (Q1-Q4)

**Q1 - Form field name:** What should the field name be?
- **Proposed:** `reasons`
- **Status:** Awaiting confirmation

**Q2 - Character count display:** Should there be a live character count?
- **Proposed:** Yes, use GOV.UK character count component
- **Status:** Awaiting confirmation (standard practice for limited text areas)

**Q3 - Previous navigation destination:** User story says Previous goes to Screen 26, but journey flow suggests Screen 26a would be the immediate predecessor. Which is correct?
- **Proposed:** Follow user story - Previous goes to `/claims/alternative-to-possession`
- **Status:** Implemented per user story but flagged for review

**Q4 - Empty string handling:** Should empty string be stored as null or empty string?
- **Proposed:** Store as `null` when empty (matches user story)
- **Status:** Awaiting confirmation

### Out of Scope
- Validation of legal correctness of reasons provided
- Upload of supporting evidence
- Assessment of appropriateness (for the court)
- Spell checking or content validation

### Relationship to Other Screens
- **Screen 26** (Alternative to Possession): Entry point and Previous destination
- **Screen 26a** (Housing Act Suspension): Parallel screen for suspension path (not in this linear flow per user story)
- **Screen 28** (Claiming Costs): Next screen after this one
- **Case list:** Cancel destination

### Simplicity Note
This is one of the simpler screens in the journey:
- Single optional textarea
- One validation rule (character limit)
- No conditional reveals
- No complex state management

---

*This understanding document was created by Nigel (Tester Agent) on 2026-02-02 based on user story screen26b.txt.*
