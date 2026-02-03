# Understanding - Screen 35: Language Used

## Summary

Screen 35 asks the solicitor which language they used to complete the service. This supports bilingual service delivery and ensures claims completed in Welsh can be flagged for processing by the Welsh Language Unit.

## Entry Conditions

Screen 35 is reached when:
- User completes Screen 34 (`/claims/applications`) and clicks Continue

## Key Behaviors

1. Display page heading: "Language used"
2. Display caption: "Make a claim"
3. Display case number
4. Display question: "Which language did you use to complete this service?"
5. Display hint text explaining why the question is asked
6. Three radio options: English, Welsh, English and Welsh
7. Required validation - must select one option
8. Previous returns to Screen 34
9. Continue goes to Screen 36

## Session Shape

```javascript
session.claim.languageUsed = {
  language: 'english' | 'welsh' | 'english-and-welsh' | null
}
```

## Navigation

- Previous -> Screen 34 (`/claims/applications`)
- Continue -> Screen 36 (`/claims/completing-your-claim`)
- Cancel -> `/case-list`

## Clarification Questions (Q1-Q6)

### Q1: Radio Button Values
**Question:** What are the exact form values for each radio option?
**Answer (from user story):**
- "English" = `english`
- "Welsh" = `welsh`
- "English and Welsh" = `english-and-welsh`

### Q2: Field Name
**Question:** What is the name attribute for the radio group?
**Assumption:** `language` (based on session structure `languageUsed.language`)

### Q3: Hint Text Content
**Question:** Is the hint text displayed as a single paragraph or multiple lines?
**Answer (from user story):** Single paragraph: "If someone else helped you to answer a question in this service, ask them if they answered any questions in Welsh. We'll use this to make sure your claim is processed correctly"

### Q4: Error Message
**Question:** What is the exact error message text?
**Answer (from user story):** "Select which language you used to complete this service"

### Q5: Previous Navigation Condition
**Question:** Is Previous navigation always to Screen 34, or is it conditional?
**Answer (from user story):** Always returns to `/claims/applications` regardless of prior selections.

### Q6: Continue Navigation Condition
**Question:** Does Continue destination vary based on language selection?
**Answer (from user story):** No - always goes to `/claims/completing-your-claim` regardless of selection.

## Initial Assumptions

1. The field name for the radio group is `language`
2. The session path is `session.claim.languageUsed.language`
3. No default selection is made on first visit
4. The Welsh Language Unit notification is mocked/simulated (out of scope for testing)
5. The page follows standard GOV.UK Design System patterns
