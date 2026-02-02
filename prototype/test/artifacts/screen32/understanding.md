# Understanding — Screen 32: Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture

## Summary

Screen 32 asks the solicitor to confirm whether there is an underlessee or mortgagee entitled to claim relief against forfeiture. This is a simple yes/no selection that determines the next step in the journey:
- Yes → Screen 33 (Upload additional document)
- No → Screen 34 (Applications)

## Entry Conditions

Screen 32 is reached via one of two paths:
1. **Path A (No underlessee/mortgagee):** User selected "No" on Screen 30 and skipped Screen 31
2. **Path B (With underlessee/mortgagee details):** User selected "Yes" on Screen 30, completed Screen 31 details, then proceeded to Screen 32

## Key Behaviors

1. Display page heading: "Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture"
2. Display caption: "Make a claim"
3. Display case number
4. Display question: "Is there an underlessee or mortgagee entitled to claim relief against forfeiture?"
5. Two radio options: Yes, No
6. Required validation - must select an option
7. Conditional Continue navigation based on selection
8. Dynamic Previous navigation based on entry path

## Constraints

- Selection is required to continue
- Previous navigation is dynamic (Screen 30 or 31)
- Continue navigation is conditional (Screen 33 or 34)

## Session Shape

```javascript
session.claim.forfeitureRelief = {
  hasUnderlesseeOrMortgageeForRelief: 'yes' | 'no' | null
}
```

## Assumptions

1. The Previous destination is determined by checking `session.claim.underlesseeOrMortgagee.hasUnderlesseeOrMortgagee`:
   - If 'yes' → Previous goes to Screen 31
   - If 'no' → Previous goes to Screen 30
2. Screen 33 and Screen 34 routes exist as placeholders if not yet implemented
