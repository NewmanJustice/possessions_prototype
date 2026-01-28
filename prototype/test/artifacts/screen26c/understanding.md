# Screen 26c — Housing Act (Demotion of tenancy)

## Understanding

### Summary
This screen captures the specific Housing Act that applies for a demotion of tenancy request. It is a simpler variant of Screen 26a (suspension), presenting only two fixed radio options without an "Other" option or free-text section input. The legal basis options are predetermined based on the statutory framework for demotion orders.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/alternative-to-possession` (Screen 26) having selected "Demotion of tenancy"
2. Page displays heading "Housing Act" with guidance text
3. User sees question "Which Housing Act does the demotion order relate to?"
4. User selects one of two options:
   - Housing Act 1985 (section 82A)
   - Housing Act 1996 (section 143A)
5. User clicks Continue
6. Selection stored in `session.claim.demotionOrder.housingAct`
7. User redirected to `/claims/statement-of-express-terms` (Screen 26d)

### Input Variations
- **Housing Act selection:** One of two fixed options (required)
- **Revisit scenario:** User returns and changes selection
- **Navigation:** Previous returns to Screen 26, Cancel returns to case-list

### Constraints

#### Business Rules
- **Single choice required:** User must select exactly one Housing Act
- **Fixed options only:** No "Other" option available
- **No section input:** Section references are embedded in the option labels (82A and 143A)
- **Mutually exclusive:** Only one option can be selected (standard radio behaviour)

#### Validation Rules
- **Selection required:** Must choose one of the two Housing Act options
- **Error message:** "Select the Housing Act"
- **GOV.UK error pattern:** Error summary at top, inline error, focus management

#### Session Structure
```javascript
session.claim.demotionOrder = {
  housingAct: 'housing-act-1985-section-82a' | 'housing-act-1996-section-143a'
}
```

**Storage rules:**
- Selection stored with hyphenated value matching the radio option
- Value includes section reference (unlike Screen 26a which has separate section field)
- `housingAct` is `null` or undefined if page not yet submitted

#### Navigation Rules
- **Previous:** `/claims/alternative-to-possession` (Screen 26)
- **Continue:** `/claims/statement-of-express-terms` (Screen 26d)
- **Cancel:** `/case-list`

### Initial Assumptions

1. **Form field name:** `demotionHousingAct` for radio group
2. **Radio values:** Hyphenated lowercase (`housing-act-1985-section-82a`, `housing-act-1996-section-143a`)
3. **Pre-population:** Radio pre-selected based on session data on revisit
4. **Error focus:** Focus moves to error summary on validation failure
5. **No character limits:** No free-text fields on this screen
6. **Screen 26d exists:** Statement of express terms screen is the next step

### Clarifications Needed (Q1-Q6)

**Q1 - Form field name:** What should the radio group name be?
- **Proposed:** `demotionHousingAct` (to distinguish from suspension screen's `housingAct`)
- **Status:** Awaiting confirmation

**Q2 - Radio option values:** What values should be stored?
- **Proposed:** `housing-act-1985-section-82a` and `housing-act-1996-section-143a` (as per AC-4)
- **Status:** Matches user story session structure

**Q3 - Guidance text:** What guidance should appear below the heading?
- **Proposed:** "Select the relevant Housing Act for the demotion order request"
- **Status:** Awaiting exact wording from design

**Q4 - Previous navigation data preservation:** Should partial data be saved when clicking Previous?
- **Proposed:** Yes, preserve any selection made (standard pattern)
- **Status:** Awaiting confirmation

**Q5 - Screen 26d placeholder:** Does Screen 26d exist or need placeholder?
- **Proposed:** Create placeholder route if not yet implemented
- **Status:** Awaiting confirmation

**Q6 - Design reference:** Is there a design file for this screen?
- **Proposed:** Use AC text exactly if no design file
- **Status:** Awaiting response

### Out of Scope
- Validation of legal correctness of chosen Act
- Collection of supporting evidence for demotion order
- "Other" Housing Act option (explicitly excluded in user story)
- Free-text section reference field (section embedded in option labels)
- Assessment of appropriateness (for the court)

### Relationship to Other Screens
- **Screen 26** (Alternative to Possession): Previous screen, entry point when "Demotion of tenancy" selected
- **Screen 26a** (Housing Act Suspension): Parallel screen for suspension path
- **Screen 26d** (Statement of Express Terms): Next screen after this one
- **Case list:** Cancel destination

### Differences from Screen 26a (Suspension)
| Aspect | Screen 26a (Suspension) | Screen 26c (Demotion) |
|--------|-------------------------|------------------------|
| Housing Act options | 3 (1985, 1996, Other) | 2 (1985 s82A, 1996 s143A) |
| Other option | Yes, with free text | No |
| Section input | Separate text field | Embedded in option labels |
| Session key | `suspensionOrder` | `demotionOrder` |
| Next screen | Screen 26b (reasons) | Screen 26d (express terms) |

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-28 based on user story screen26c.txt.*
