# Screen 24 — Claimant's Circumstances

## Understanding

### Summary
This screen captures optional information about the claimant's circumstances that the court may consider when deciding whether to grant a possession order. It presents a Yes/No radio question with a conditional reveal textarea when "Yes" is selected.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/money-judgement` (Screen 23)
2. Page displays question: "Is there any information you'd like to provide about [Claimant name]'s circumstances?"
3. User selects Yes or No
4. **If Yes:** User may optionally enter details (up to 950 characters)
5. User clicks Continue
6. Selection and any details stored in `session.claim.claimantCircumstances`
7. User redirected to `/claims/defendants-circumstances` (Screen 25)

### Input Variations
- **Selection:** Yes (provided: true) or No (provided: false)
- **Details text:** 0 to 950 characters (optional, only when Yes selected)
- **Revisit scenario:** User returns and changes selection or details
- **Validation errors:** No selection made, or details exceed 950 characters

### Constraints

#### Business Rules
- **Single choice required:** User must select either Yes or No
- **Conditional reveal:** Details textarea only shown when Yes selected
- **Details optional:** Textarea can be left empty even when revealed
- **Character limit:** Maximum 950 characters in details textarea
- **Dynamic claimant name:** Question includes claimant's name from session

#### Validation Rules
- **Selection required:** Must choose Yes or No
- **Selection error message:** "Select whether you want to provide information about the claimant's circumstances"
- **Character limit error message:** "Enter 950 characters or fewer"
- **GOV.UK error pattern:** Error summary at top, inline error, focus management

#### Session Structure
```javascript
session.claim.claimantCircumstances = {
  provided: true | false,  // true = Yes, false = No
  details: string | null   // Details text or null if No selected
}
```

**Storage rules:**
- Yes selected → `provided: true`, `details: entered text or null`
- No selected → `provided: false`, `details: null`
- Changing from Yes to No clears details

#### Navigation Rules
- **Previous:** `/claims/money-judgement` (Screen 23)
- **Continue:** `/claims/defendants-circumstances` (Screen 25)
- **Cancel:** `/case-list`

### Initial Assumptions

1. **Claimant name source:** Read from `session.claim.claimantName` (with fallback "the claimant")
2. **Radio values:** "yes" and "no" as string values in form, converted to boolean in session
3. **Form field names:** `provideCircumstances` for radio, `circumstancesDetails` for textarea
4. **Pre-population:** Radio pre-selected and textarea pre-filled based on session data
5. **Error focus:** Focus moves to error summary on validation failure
6. **Conditional reveal:** Standard GOV.UK pattern for Yes selection revealing textarea
7. **Character counting:** Simple character count (not word count), includes all characters

### Ambiguities Identified

**Q1 - Claimant name source:** RESOLVED
- Uses `session.claim.claimantName` with fallback to "the claimant"

**Q2 - Character limit validation:** RESOLVED
- Validates on server-side when > 950 characters
- Client-side guidance shows "You can enter up to 950 characters"

**Q3 - Details when changing Yes to No:** RESOLVED
- Details are cleared (set to null) when user changes from Yes to No

**Q4 - Whitespace handling:** RESOLVED
- Whitespace-only details accepted (treated as empty, not an error)

**Q5 - Empty details when Yes:** RESOLVED
- Empty textarea is valid when Yes selected (details are optional)

### Out of Scope
- Document/evidence uploads
- Validation of information relevance or sufficiency
- Multiple claimant scenarios
- Character count display on the UI (just guidance text)
- Word count limits

### Relationship to Other Screens
- **Screen 23** (Money Judgement): Previous screen
- **Screen 25** (Defendant's Circumstances): Next screen
- **Case list:** Cancel destination

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-28 based on user story screen24.txt.*
