# Screen 30 — Underlessee or Mortgagee Entitled to Claim Relief Against Forfeiture

## Understanding

### Summary
This screen captures whether there is an underlessee (subtenant) or mortgagee (mortgage lender) who has a legal right to ask the court to let a lease continue, even though the landlord has tried to end it. This is a simple yes/no question with no conditional reveal. The selection is persisted in session and the user can revisit and change their answer.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/additional-reasons-for-possession` (Screen 29)
2. Page displays heading "Underlessee or mortgagee entitled to claim relief against forfeiture" with caption "Make a claim"
3. Current case number displayed above heading
4. Explanatory text displayed: "You must tell us if there is an underlessee (a subtenant) or a mortgagee (a mortgage lender) who has a legal right to ask the court to let a lease continue, even though the landlord has tried to end it."
5. Question reads (bold): "Is there an underlessee or mortgagee entitled to claim relief against forfeiture?"
6. Two radio options: Yes, No
7. User selects Yes or No
8. User clicks Continue
9. Selection stored in `session.claim.underlesseeOrMortgagee.hasUnderlesseeOrMortgagee` as 'yes' or 'no'
10. User redirected to next screen (Screen 31 route TBD)

### Input Variations
- **Selection:** Yes (stored as 'yes') or No (stored as 'no')
- **Revisit scenario:** User returns and pre-selected option is displayed
- **Selection change:** User changes from Yes to No (or vice versa) and resubmits
- **Validation errors:** No selection made

### Constraints

#### Business Rules
- **Single choice required:** User must select either Yes or No (no "maybe" or skip option)
- **No details capture:** This screen only captures whether a third party exists, not their details
- **Static wording:** Uses exact wording from acceptance criteria
- **Third-party awareness:** Question establishes whether any third party (underlessee or mortgagee) has legal rights that may affect the possession claim

#### Validation Rules
- **Selection required:** Must choose Yes or No
- **Selection error message:** "Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture"
- **GOV.UK error pattern:** Error summary at top, inline error, focus management

#### Session Structure
```javascript
session.claim.underlesseeOrMortgagee = {
  hasUnderlesseeOrMortgagee: 'yes' | 'no' | null
}
```

**Storage rules:**
- Yes selected -> `hasUnderlesseeOrMortgagee: 'yes'`
- No selected -> `hasUnderlesseeOrMortgagee: 'no'`
- Initial/null state -> `hasUnderlesseeOrMortgagee: null`

#### Navigation Rules
- **Previous:** `/claims/additional-reasons-for-possession` (Screen 29)
- **Continue:** Next screen (Screen 31 route TBD) — conditional on validation passing
- **Cancel:** `/case-list`

### Initial Assumptions

1. **Storage format:** String values 'yes' or 'no' (lowercase)
2. **Form field name:** `hasUnderlesseeOrMortgagee` for radio buttons
3. **Pre-population:** Radio pre-selected if session already contains 'yes' or 'no'
4. **Error focus:** Focus moves to error summary on validation failure
5. **Case number display:** Present and readable above page heading
6. **Continue route TBD:** Implementation assumes placeholder route to avoid blocking; next screen must be confirmed before go-live
7. **Data preservation:** Clicking Previous preserves the selection in session
8. **Session object structure:** Nested under `session.claim.underlesseeOrMortgagee`

### Open Questions (Q1-Q6)

**Q1 - Next screen route:** Continue navigation currently routes to TBD; confirm Screen 31 route before go-live
**Q2 - Form field name:** Confirm field name is `hasUnderlesseeOrMortgagee`
**Q3 - Value format:** Confirm lowercase 'yes' and 'no' string values
**Q4 - Session structure:** Confirm nested object structure under `session.claim.underlesseeOrMortgagee`
**Q5 - Branching logic:** Confirm whether selecting Yes triggers any conditional collection of underlessee/mortgagee details (currently assumed no branching)
**Q6 - Case number display:** Confirm case number display follows existing pattern from other screens

### Out of Scope
- Collecting details about the underlessee or mortgagee (name, address, etc.) if Yes is selected
- Determining the legal implications of selecting Yes
- Validating whether the claim type warrants this question (assumed to be relevant for forfeiture claims)
- Branching logic based on the Yes/No answer (e.g., collecting underlessee/mortgagee details) is deferred to a future iteration if required

### Relationship to Other Screens
- **Screen 29** (Additional Reasons for Possession): Previous screen
- **Screen 31:** Next screen (route TBD)
- **Case list:** Cancel destination

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-30 based on user story screen30.txt.*
