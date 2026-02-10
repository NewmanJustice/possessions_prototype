# Screen 26a — Housing Act (Suspension of right to buy)

## Understanding

### Summary
This screen captures the specific Housing Act and section that applies for a suspension of the right to buy request. It presents three radio options (Housing Act 1985, Housing Act 1996, Other) where "Other" conditionally reveals a text input for specifying an alternative Act name. A separate section text field captures the relevant section reference for the suspension order.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/alternative-to-possession` (Screen 26) having selected "Suspension of right to buy"
2. Page displays heading "Housing Act" with guidance text
3. User sees question "Which Housing Act does the suspension order relate to?"
4. User selects one of three options:
   - Housing Act 1985
   - Housing Act 1996
   - Other (reveals "Name of Housing Act" text input)
5. User enters section reference in the "Section" text field (e.g., "section 121A")
6. User clicks Continue
7. Selection stored in `session.claim.suspensionOrder`
8. User redirected to `/claims/reasons-for-suspension` (Screen 26b)

### Input Variations
- **Housing Act selection:** One of three radio options (required)
- **Other Act name:** Free text input (conditionally required when "Other" selected)
- **Section:** Free text input (always required, max 50 characters)
- **Revisit scenario:** User returns and changes selection
- **Navigation:** Previous returns to Screen 26, Cancel returns to case-list

### Constraints

#### Business Rules
- **Single choice required:** User must select exactly one Housing Act option
- **Conditional reveal:** "Other" selection reveals the "Name of Housing Act" text input
- **Other name required:** If "Other" selected, the act name must be provided
- **Section always required:** Section field must be completed regardless of Housing Act selection
- **Section max length:** 50 characters maximum

#### Validation Rules
| Field | Rule | Error Message |
|-------|------|---------------|
| Housing Act radio | Required | "Select the Housing Act" |
| Other Act name | Required if Other selected | "Enter the name of the Housing Act" |
| Section | Required | "Enter the Housing Act section" |
| Section | Max 50 chars | "Enter 50 characters or fewer" |

#### GOV.UK Error Pattern
- Error summary at top of page
- Inline error messages
- Error links target relevant field
- Focus moves to error summary

#### Session Structure
```javascript
session.claim.suspensionOrder = {
  housingAct: 'housing-act-1985' | 'housing-act-1996' | 'other',
  housingActOtherName: string | null,
  section: string
}
```

**Storage rules:**
- `housingAct` stores the radio selection value
- `housingActOtherName` is populated only when `housingAct === 'other'`
- `housingActOtherName` is `null` when 1985 or 1996 selected
- `section` stores the section reference as entered

#### Navigation Rules
- **Previous:** `/claims/alternative-to-possession` (Screen 26)
- **Continue:** `/claims/reasons-for-suspension` (Screen 26b)
- **Cancel:** `/case-list`

### Initial Assumptions

1. **Form field names:**
   - `suspensionHousingAct` for radio group
   - `housingActOtherName` for other act name text input
   - `section` for section reference text input
2. **Radio values:** Hyphenated lowercase (`housing-act-1985`, `housing-act-1996`, `other`)
3. **Conditional reveal:** Uses GOV.UK conditional reveal pattern with data-aria-controls
4. **Pre-population:** Fields pre-populated based on session data on revisit
5. **Error focus:** Focus moves to error summary on validation failure
6. **Section hint text:** "For example, section 121A"

### Clarifications Needed (Q1-Q6)

**Q1 - Form field names:** What should the field names be?
- **Proposed:** `suspensionHousingAct`, `housingActOtherName`, `section`
- **Status:** Awaiting confirmation

**Q2 - Radio option values:** What values should be stored?
- **Proposed:** `housing-act-1985`, `housing-act-1996`, `other` (lowercase hyphenated)
- **Status:** Awaiting confirmation

**Q3 - Section hint text:** What hint text should appear for section field?
- **Proposed:** "For example, section 121A"
- **Status:** Matches user story (AC-6)

**Q4 - Other name max length:** Should there be a character limit on the Other act name field?
- **Proposed:** No limit specified in user story, assume no validation
- **Status:** Awaiting confirmation

**Q5 - Previous navigation data preservation:** Should partial data be saved when clicking Previous?
- **Proposed:** Yes, preserve any data entered (standard pattern)
- **Status:** Awaiting confirmation

**Q6 - Screen 26b placeholder:** Does Screen 26b exist or need placeholder?
- **Proposed:** Create placeholder route if not yet implemented
- **Status:** Awaiting confirmation

### Out of Scope
- Validation of legal correctness of chosen Act/section
- Collection of supporting evidence for suspension order
- Assessment of appropriateness (for the court)
- Format validation on section field (beyond length)

### Relationship to Other Screens
- **Screen 26** (Alternative to Possession): Previous screen, entry point when "Suspension of right to buy" selected
- **Screen 26b** (Reasons for Suspension): Next screen after this one
- **Screen 26c** (Housing Act Demotion): Parallel screen for demotion path
- **Case list:** Cancel destination

### Differences from Screen 26c (Demotion)
| Aspect | Screen 26a (Suspension) | Screen 26c (Demotion) |
|--------|-------------------------|------------------------|
| Housing Act options | 3 (1985, 1996, Other) | 2 (1985 s82A, 1996 s143A) |
| Other option | Yes, with free text | No |
| Section input | Separate text field (required) | Embedded in option labels |
| Session key | `suspensionOrder` | `demotionOrder` |
| Next screen | Screen 26b (reasons) | Screen 26d (express terms) |
| Validation complexity | Higher (4 possible errors) | Lower (1 possible error) |

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-28 based on user story screen26a.txt.*
