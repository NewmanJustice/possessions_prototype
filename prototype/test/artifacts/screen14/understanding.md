# Screen 14 — Grounds for Possession (Additional Grounds)

## Understanding

### Summary
This is a **reusable screen** that collects additional grounds for possession via checkboxes. The screen supports **dynamic routing** through a navigation contract stored in session, allowing it to be entered from multiple user journeys with different titles and navigation paths.

For the **assured tenancy journey**, when a user selects "Yes" to additional grounds on Screen 13.1.1, they arrive at this screen titled **"Additional grounds for possession"**.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/grounds-for-possession-assured-selection` (Screen 13.1.1)
2. Navigation contract is set (if not already present): previous route, continue route, title mode
3. Page displays with title "Additional grounds for possession"
4. 14 grounds displayed as checkboxes in two groups:
   - **Mandatory grounds:** 1, 3, 4, 5, 7, 8 (6 checkboxes)
   - **Discretionary grounds:** 9, 10, 11, 12, 13, 14, 15, 16 (8 checkboxes)
5. User selects one or more grounds
6. User clicks Continue
7. Selections stored in `session.claim.grounds.additional` with prefixed keys
8. User redirected to `/claims/reasons-for-possession` (Screen 15)

### Input Variations
- **Number of selections:** Zero (validation error), one, multiple, or all 14 grounds
- **Entry point:** Currently assured additional grounds path; future: other journeys
- **Title mode:** 'additional' for assured journey; 'standard' for other journeys (future)
- **Revisit scenario:** User returns to change selections (pre-population required)
- **Navigation actions:** Continue, Previous, Cancel

### Constraints

#### Business Rules
- **Minimum selection:** At least 1 ground must be selected (AC-4)
- **Multiple selection:** Zero to 14 grounds can be selected (AC-3)
- **No conditional logic:** This screen only collects checkboxes (reasons collected on Screen 15)
- **No validation of combinations:** Legal validity of ground combinations not checked here

#### Validation Rules
- At least one checkbox must be selected
- Error message: "Select at least one ground for possession"
- GOV.UK error summary at top of page
- Focus moves to error summary on validation failure
- Selected checkboxes preserved on validation error (AC-5)

#### Session Structure
```javascript
session.claim.navigation.screen14 = {
  previous: '/claims/grounds-for-possession-assured-selection',
  continue: '/claims/reasons-for-possession',
  titleMode: 'additional' // or 'standard'
}

session.claim.grounds.additional = {
  // Mandatory grounds (prefix: mandatoryGround)
  mandatoryGround1: true | false,
  mandatoryGround3: true | false,
  mandatoryGround4: true | false,
  mandatoryGround5: true | false,
  mandatoryGround7: true | false,
  mandatoryGround8: true | false,
  
  // Discretionary grounds (prefix: discretionaryGround)
  discretionaryGround9: true | false,
  discretionaryGround10: true | false,
  discretionaryGround11: true | false,
  discretionaryGround12: true | false,
  discretionaryGround13: true | false,
  discretionaryGround14: true | false,
  discretionaryGround15: true | false,
  discretionaryGround16: true | false
}
```

**Key naming convention:**
- Mandatory grounds: `mandatoryGround{number}`
- Discretionary grounds: `discretionaryGround{number}`
- Deselected grounds: Set to `false` (not undefined or null)

#### Navigation Rules
- **Previous:** Uses `session.claim.navigation.screen14.previous` (dynamic)
- **Continue:** Uses `session.claim.navigation.screen14.continue` (dynamic)
- **Cancel:** Always goes to `/case-list`
- **Navigation contract setup:** Set conditionally on GET (only if not already present)
- **Default values (for assured path):**
  - previous: `/claims/grounds-for-possession-assured-selection`
  - continue: `/claims/reasons-for-possession`
  - titleMode: `additional`

#### Security
- Session-based persistence only
- No ground-level access control (professional user authenticated elsewhere)
- Navigation contract prevents unauthorized route manipulation

### Initial Assumptions

1. **Ground labels from design:** Using exact labels from screen14.png design file
2. **Two-group structure:** Mandatory and Discretionary groups displayed separately
3. **Navigation setup timing:** GET route sets navigation contract conditionally (if not present)
4. **Deselection behavior:** Changed from true → false (not deleted from session)
5. **Title determination:** Title set based on `titleMode` ('additional' vs 'standard')
6. **Screen 15 placeholder:** Required for continue route testing
7. **No ground descriptions on checkboxes:** Checkbox labels show ground numbers only (e.g., "Ground 1")
8. **Order preservation:** Grounds displayed in numerical order within each group

### Ambiguities Identified

✅ **Q1 - Ground labels and structure:** RESOLVED  
   - Using design file: screen14.png
   - 14 grounds in two groups (Mandatory: 1,3,4,5,7,8; Discretionary: 9,10,11,12,13,14,15,16)

✅ **Q2 - Session key naming:** RESOLVED  
   - Using prefixed format: `mandatoryGround{N}` and `discretionaryGround{N}`

✅ **Q3 - Navigation contract setup:** RESOLVED  
   - Set conditionally in GET handler (only if not already present)
   - Allows pre-configuration by previous screen or default fallback

✅ **Q4 - Deselection handling:** RESOLVED  
   - Deselected grounds set to `false` (not undefined/null/deleted)

✅ **Q5 - Continue destination:** RESOLVED  
   - Use dynamic route: `session.claim.navigation.screen14.continue`
   - For assured path: `/claims/reasons-for-possession`

✅ **Q6 - Placeholder requirements:** RESOLVED  
   - Create placeholder for Screen 15: `/claims/reasons-for-possession`

### Out of Scope
- Reason/evidence capture for grounds (handled on Screen 15)
- Legal validation of ground combinations
- Ground-specific conditional questions
- Non-assured journey entry points (future enhancement)
- Title mode 'standard' testing (only 'additional' tested for assured journey)

### Relationship to Other Screens
- **Screen 13.1.1** (assured additional grounds decision): Sets navigation contract and redirects here when "Yes" selected
- **Screen 15** (reasons for possession): Receives selected grounds from this screen
- **Screen 16** (preaction protocol): Bypassed if "No" selected on Screen 13.1.1
- **Case list:** Cancel destination

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-27 based on user story screen14.txt and design file screen14.png, with clarifications from Steve.*
