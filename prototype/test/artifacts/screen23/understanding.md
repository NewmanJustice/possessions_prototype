# Screen 23 — Money Judgement

## Understanding

### Summary
This is a simple declarative screen that captures whether the solicitor wants the court to make a money judgment for the outstanding arrears. It presents a single Yes/No radio question with standard GOV.UK validation and navigation patterns.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/details-of-rent-arrears` (Screen 22)
2. Page displays question: "Do you want the court to make a judgment for the outstanding arrears?"
3. User selects Yes or No
4. User clicks Continue
5. Selection stored in `session.claim.moneyJudgement.requested` as boolean
6. User redirected to `/claims/claimants-circumstances` (Screen 24)

### Input Variations
- **Selection:** Yes (true) or No (false)
- **Revisit scenario:** User returns and changes selection
- **Validation error:** User submits without selecting

### Constraints

#### Business Rules
- **Single choice required:** User must select either Yes or No
- **No conditional logic:** No additional fields revealed based on selection
- **Declarative only:** Records intent without eligibility validation
- **No amounts:** Payment schedules and amounts handled elsewhere

#### Validation Rules
- **Selection required:** Must choose Yes or No
- **Error message:** "Select whether you want the court to make a judgment for the outstanding arrears"
- **GOV.UK error pattern:** Error summary at top, inline error, focus management

#### Session Structure
```javascript
session.claim.moneyJudgement = {
  requested: true | false  // true = Yes, false = No
}
```

**Storage rules:**
- Yes selected → `requested: true`
- No selected → `requested: false`
- Changing selection updates the boolean value

#### Navigation Rules
- **Previous:** `/claims/details-of-rent-arrears` (Screen 22)
- **Continue:** `/claims/claimants-circumstances` (Screen 24)
- **Cancel:** `/case-list`

### Initial Assumptions

1. **No design file:** Using exact question text from AC-1
2. **British spelling:** Using `moneyJudgement` (with 'e') to match route and AC
3. **Radio values:** "yes" and "no" as string values in form, converted to boolean in session
4. **Pre-population:** Radio pre-selected based on `requested` boolean value
5. **Error focus:** Focus moves to error summary on validation failure
6. **Standard layout:** Single page with question, radios, and navigation buttons

### Ambiguities Identified

✅ **Q1 - Design reference:** RESOLVED  
   - No design file available
   - Using AC text exactly

✅ **Q2 - Session key spelling:** RESOLVED  
   - Using British spelling: `moneyJudgement` (matches AC and route)

✅ **Q3 - Radio change behavior:** RESOLVED  
   - Changing from Yes to No (or vice versa) updates the boolean value

✅ **Q4 - Next screen placeholder:** RESOLVED  
   - Create placeholder for Screen 24: `/claims/claimants-circumstances`

### Out of Scope
- Payment schedule collection
- Money judgment amount specification
- Eligibility validation for money judgment
- Enforcement details
- Integration with court systems

### Relationship to Other Screens
- **Screen 22** (Details of rent arrears): Previous screen, provides arrears context
- **Screen 24** (Claimants circumstances): Next screen, receives money judgment intent
- **Case list:** Cancel destination

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-27 based on user story screen23.txt, with clarifications from Steve.*
