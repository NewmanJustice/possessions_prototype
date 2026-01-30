# Screen 26 — Alternatives to Possession

## Understanding

### Summary
This screen presents a solicitor with optional choices for alternatives to possession (suspension of right to buy or demotion of tenancy). It represents a decision point where the user selects at most one alternative, or proceeds with no selection. The selection is mutually exclusive and entirely optional.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/defendants-circumstances` (Screen 25)
2. Page displays heading "Alternatives to possession" with explanatory guidance
3. User sees question: "In the alternative to possession, would you like to claim suspension of right to buy or demotion of tenancy? (Optional)"
4. Two checkbox options are presented:
   - Suspension of right to buy
   - Demotion of tenancy
5. User either:
   - Selects neither option and clicks Continue → redirected to `/claims/claiming-costs` (Screen 28)
   - Selects Suspension → redirected to `/claims/select-housing-act-suspension` (Screen 26a)
   - Selects Demotion → redirected to `/claims/select-housing-act-demotion` (Screen 26c)
6. Selection stored in `session.claim.alternativesToPossession`

### Input Variations
- **No selection:** User selects neither checkbox (valid)
- **Suspension selected:** User selects only suspension checkbox
- **Demotion selected:** User selects only demotion checkbox
- **Attempt mutual selection:** User tries to select both (prevented by UI/validation)
- **Revisit scenario:** User returns and changes selection

### Constraints

#### Business Rules
- **Mutually exclusive:** At most one alternative can be selected
- **Optional:** Zero selections is valid
- **Two fixed options only:** No other alternatives offered
- **No input fields:** Pure checkbox selection, no free-text input
- **Guidance present:** Explanatory text clarifies these are judge-considered alternatives

#### Validation Rules
- **No mandatory selection error:** Submitting with no checkboxes selected is valid
- **Mutual exclusivity:** Server must validate that both cannot be selected simultaneously
- **Mutual exclusivity UI:** Client may disable second checkbox when first is selected

#### Session Structure
```javascript
session.claim.alternativesToPossession = {
  suspensionOfRightToBuy: true | false,
  demotionOfTenancy: true | false
}
```

**Storage rules:**
- Both properties always present (never undefined)
- Either both false (no selection), or exactly one true
- Values stored as booleans

#### Navigation Rules
- **Previous:** `/claims/defendants-circumstances` (Screen 25)
- **Continue (no selection):** `/claims/claiming-costs` (Screen 28)
- **Continue (suspension):** `/claims/select-housing-act-suspension` (Screen 26a)
- **Continue (demotion):** `/claims/select-housing-act-demotion` (Screen 26c)

### Initial Assumptions

1. **Checkbox behaviour:** UI may disable one checkbox when the other is selected; server validates regardless
2. **Session initialization:** `alternativesToPossession` initialized with both properties false on first visit
3. **Pre-population:** Checkboxes pre-checked based on session data on revisit
4. **Guidance text:** Explanatory section appears before the question
5. **GOV.UK pattern:** Follows standard checkbox pattern with error summary if validation fails
6. **No auto-proceed:** Page requires explicit Continue click (no auto-routing)

### Clarifications Needed (Q1-Q3)

**Q1 - Checkbox field names:** What should the form field names be?
- **Proposed:** `suspensionOfRightToBuy` and `demotionOfTenancy`
- **Status:** Awaiting confirmation

**Q2 - Guidance text:** What exact guidance text should appear describing the alternatives?
- **Proposed:** "Select one or proceed with neither. The court may consider these alternatives if possession is not reasonable."
- **Status:** Awaiting exact wording from design

**Q3 - UI enforcement of mutual exclusivity:** Should checkboxes be disabled in browser, or only validated server-side?
- **Proposed:** UI disables second checkbox when first selected; server always validates
- **Status:** Awaiting implementation guidance

### Out of Scope
- Validation of eligibility for either alternative (deferred to subsequent screens)
- Details of suspension/demotion orders (captured on Screens 26a/26b/26c/26d)
- Legal basis assessment (handled downstream)
- Assessment of appropriateness (for the court)

### Relationship to Other Screens
- **Screen 25** (Defendant's Circumstances): Previous screen, entry point
- **Screen 26a** (Housing Act Suspension): Next if suspension selected
- **Screen 26c** (Housing Act Demotion): Next if demotion selected
- **Screen 28** (Claiming Costs): Next if no alternative selected
- **Case list:** Cancel destination (standard pattern)

### Differences from Related Screens
| Aspect | Screen 26 | Screen 26a (Suspension) | Screen 26c (Demotion) |
|--------|----------|------------------------|----------------------|
| Input type | Checkboxes (mutual) | Radio (required) | Radio (required) |
| Selection | Optional | Required | Required |
| Number of options | 2 | 3 (+ Other) | 2 |
| Free-text input | No | Yes (Other section) | No |
| Immediate next | Varies by selection | Screen 26b | Screen 26d |
| None path available | Yes (Screen 28) | No | No |

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-29 based on user story screen26.txt.*
