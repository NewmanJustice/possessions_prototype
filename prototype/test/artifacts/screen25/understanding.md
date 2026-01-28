# Screen 25 — Defendant's Circumstances

## Understanding

### Summary
This screen captures optional information about the defendants' circumstances that the court may consider when deciding whether to grant a possession order. It presents a Yes/No radio question with a conditional reveal textarea when "Yes" is selected. This is structurally identical to Screen 24 (Claimant's Circumstances) but captures defendant information instead.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/claimants-circumstances` (Screen 24)
2. Page displays question: "Is there any information you'd like to provide about the defendants' circumstances?"
3. User selects Yes or No
4. **If Yes:** User may optionally enter details (up to 950 characters)
5. User clicks Continue
6. Selection and any details stored in `session.claim.defendantCircumstances`
7. User redirected to `/claims/alternative-to-possession` (Screen 26)

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
- **Static wording:** Uses "defendants'" (plural possessive) regardless of defendant count

#### Validation Rules
- **Selection required:** Must choose Yes or No
- **Selection error message:** "Select whether you want to provide information about the defendants' circumstances"
- **Character limit error message:** "Enter 950 characters or fewer"
- **GOV.UK error pattern:** Error summary at top, inline error, focus management

#### Session Structure
```javascript
session.claim.defendantCircumstances = {
  provided: true | false,  // true = Yes, false = No
  details: string | null   // Details text or null if No selected
}
```

**Storage rules:**
- Yes selected → `provided: true`, `details: entered text or null`
- No selected → `provided: false`, `details: null`
- Changing from Yes to No clears details

#### Navigation Rules
- **Previous:** `/claims/claimants-circumstances` (Screen 24)
- **Continue:** `/claims/alternative-to-possession` (Screen 26)
- **Cancel:** `/case-list`

### Initial Assumptions

1. **Static wording:** Uses "defendants'" (plural) as written in AC, not dynamic
2. **Form field names:** `provideDefendantCircumstances` for radio, `defendantDetails` for textarea
3. **Pre-population:** Radio pre-selected and textarea pre-filled based on session data
4. **Error focus:** Focus moves to error summary on validation failure
5. **Conditional reveal:** Standard GOV.UK pattern for Yes selection revealing textarea
6. **Character counting:** Simple character count (not word count), includes all characters
7. **Details clearing:** Details set to null when changing from Yes to No

### Clarifications Received (Q1-Q6)

✅ **Q1 - Plural "defendants'":** RESOLVED
- Use "defendants'" as written in AC (static, not dynamic)

✅ **Q2 - Form field names:** RESOLVED
- Radio: `provideDefendantCircumstances`
- Textarea: `defendantDetails`

✅ **Q3 - Details clearing:** RESOLVED
- Yes, details cleared when changing Yes to No

✅ **Q4 - Character guidance:** RESOLVED
- Same hint text: "You can enter up to 950 characters"

✅ **Q5 - Next screen placeholder:** RESOLVED
- Create placeholder for `/claims/alternative-to-possession` (Screen 26)

✅ **Q6 - Design reference:** RESOLVED
- No design file, use AC text exactly

### Out of Scope
- Document/evidence uploads
- Validation of information relevance or sufficiency
- Dynamic defendant name(s)
- Multiple defendants handling (future iteration)
- Character count display on the UI (just guidance text)

### Relationship to Other Screens
- **Screen 24** (Claimant's Circumstances): Previous screen
- **Screen 26** (Alternative to Possession): Next screen (placeholder needed)
- **Case list:** Cancel destination

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-28 based on user story screen25.txt, with clarifications from Steve.*
