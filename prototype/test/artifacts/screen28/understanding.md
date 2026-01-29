# Screen 28 — Claiming Costs

## Understanding

### Summary
This screen captures the claimant's intention to claim costs (yes/no) in a possession claim. It displays a simple binary choice with two radio buttons and conditional hint text explaining that a detailed schedule is not required at this stage. The selection is persisted in session and the user can revisit and change their answer.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/statement-of-express-terms` (Screen 26d)
2. Page displays heading "Claiming costs" with caption "Make a claim"
3. Current case number displayed above heading
4. Question reads: "Do you want to ask for your costs back?"
5. Hint text explains: "You do not need to provide the exact amount at this stage, but a judge will request a schedule of costs at the hearing"
6. Two radio options: Yes, No
7. User selects Yes or No
8. User clicks Continue
9. Selection stored in `session.claim.claimingCosts` as 'yes' or 'no'
10. User redirected to next screen (TBD)

### Input Variations
- **Selection:** Yes (stored as 'yes') or No (stored as 'no')
- **Revisit scenario:** User returns and pre-selected option is displayed
- **Selection change:** User changes from Yes to No (or vice versa) and resubmits
- **Validation errors:** No selection made

### Constraints

#### Business Rules
- **Single choice required:** User must select either Yes or No (no "maybe" or skip option)
- **No details capture:** This screen only captures intention, not cost amounts or itemised breakdown
- **Static wording:** Uses "Do you want to ask for your costs back?" exactly as specified
- **Legal placeholder:** Hint text reflects current policy intent about judge requesting schedule

#### Validation Rules
- **Selection required:** Must choose Yes or No
- **Selection error message:** "Select yes if you want to ask for your costs back"
- **GOV.UK error pattern:** Error summary at top, inline error, focus management

#### Session Structure
```javascript
session.claim.claimingCosts = 'yes' | 'no' | null
```

**Storage rules:**
- Yes selected → `claimingCosts: 'yes'`
- No selected → `claimingCosts: 'no'`
- Initial/null state → `claimingCosts: null`

#### Navigation Rules
- **Previous:** `/claims/statement-of-express-terms` (Screen 26d)
- **Continue:** Next screen (TBD) — conditional on validation passing
- **Cancel:** `/case-list`

### Initial Assumptions

1. **Storage format:** String values 'yes' or 'no' (lowercase)
2. **Form field name:** `claimingCosts` for radio buttons
3. **Pre-population:** Radio pre-selected if session already contains 'yes' or 'no'
4. **Error focus:** Focus moves to error summary on validation failure
5. **Case number display:** Present and readable above page heading
6. **Continue route TBD:** Implementation assumes placeholder route to avoid blocking; next screen must be confirmed before go-live
7. **Data preservation:** Clicking Previous preserves the selection in session

### Out of Scope
- Document/evidence uploads
- Detailed cost breakdown or schedule capture
- Validation of cost amounts or itemised details
- Cost recovery rules or legal qualification assessment
- Judge review logic or cost assessment procedures
- Dynamic next screen routing (fixed to TBD placeholder)

### Relationship to Other Screens
- **Screen 26d** (Statement of Express Terms): Previous screen
- **Next screen:** TBD (placeholder route needed)
- **Case list:** Cancel destination

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-29 based on user story screen28.txt.*
