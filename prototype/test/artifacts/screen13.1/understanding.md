# Screen 13.1: Assured Journey Confirmation - Understanding Document

## Summary

As a solicitor making a possession claim with an assured tenancy, I need to confirm whether I want to proceed with the assured-tenancy grounds journey or switch to an alternate grounds flow.

This is a **confirmation and branch point** screen that determines whether the user follows the assured-tenancy-specific grounds journey or proceeds to a general grounds selection.

## Key Behaviours

### Primary Behaviour (Happy Path)
- Solicitor is asked "Do you want to proceed with assured-tenancy grounds?"
- Yes/No radio selection (required)
- Selection determines next screen and stores confirmation choice
- Yes path continues to assured grounds selection
- No path switches to alternate grounds flow

### Branch Logic
```
Do you want to proceed with assured-tenancy grounds?
├─ Yes → /claims/grounds-for-possession-assured-selection (Screen 13.1.1)
│        (stores assuredProceed = true)
└─ No  → /claims/grounds-for-possession (Screen 14.1)
         (stores assuredProceed = false)
```

### Constraints
- Radio selection is required (validation error if not selected)
- Session must store `session.claim.grounds.assuredProceed` as boolean
- Only applies to assured tenancy journey (groundsModel = 'ASSURED')

## Route Details

1. **Route**: `/claims/grounds-for-possession-assured-confirmation`
2. **Previous page**: `/claims/tenancy` (when groundsModel = 'ASSURED')
3. **Next pages**: 
   - Yes → `/claims/grounds-for-possession-assured-selection` (Screen 13.1.1)
   - No → `/claims/grounds-for-possession` (Screen 14.1)
4. **Session storage**: `session.claim.grounds.assuredProceed` (boolean)

## Session State Structure

```js
session.claim.grounds = {
  ...existing,
  assuredProceed: true | false  // NEW - confirmation of assured journey
}
```

## Page Content

### Question
"Do you want to proceed with assured-tenancy grounds?"

### Radio Options
- Yes
- No

### Error Message
"Select whether you want to proceed with assured-tenancy grounds"

### Supporting Text
Explanatory text about what assured-tenancy grounds are and when to use them vs. alternate grounds flow.

## Initial Assumptions

1. This screen is **only reached** when user has selected "Assured tenancy" on Screen 12
2. The "No" path allows users to access a more general grounds selection (Screen 14.1)
3. AC-4 mentions preserving answers if Screen 14.1 was visited - assume this is not relevant for prototype (per Steve's Q3 answer)
4. Previous link goes back to Screen 12 (Tenancy details)
5. Cancel link goes to /case-list

## Out of Scope

- Actual assured grounds selection (Screen 13.1.1 - separate)
- General grounds selection (Screen 14.1 - separate)
- Toggling between assured/non-assured after completion
- Validation of which grounds are legally appropriate
