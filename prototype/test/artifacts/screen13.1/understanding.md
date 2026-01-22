# Screen 13.1: Grounds for Possession - Understanding Document

## Summary

As a solicitor making a possession claim, I need to indicate whether I am claiming possession because of rent arrears. This is a **branch point** that determines the next step in the journey.

## Key Behaviours

### Primary Behaviour (Happy Path)
- Solicitor is asked "Are you claiming possession because of rent arrears?"
- Yes/No radio selection
- Selection determines which grounds selection page comes next

### Branch Logic
```
Are you claiming possession because of rent arrears?
├─ Yes → /claims/assured-tenancy-grounds-selection
│        (stores rentArrears = true)
└─ No  → /claims/other-tenancy-grounds
         (stores rentArrears = false)
```

### Constraints
- This is a **hard branch point** - the selection alone determines the branch
- Radio selection is required
- Session must store `session.claim.grounds.rentArrears` as boolean

## Initial Assumptions

1. **Route**: `/claims/grounds`
2. **Previous page**: `/claims/tenancy`
3. **Next pages**: 
   - Yes → `/claims/assured-tenancy-grounds-selection`
   - No → `/claims/other-tenancy-grounds`
4. **Session storage**: `session.claim.grounds.rentArrears` (boolean)

## Ambiguities Identified

| Item | Ambiguity | Resolution |
|------|-----------|------------|
| A1 | User story file said "secure-tenancy-grounds" for No | Steve clarified: `/claims/other-tenancy-grounds` |

## Out of Scope

- The actual grounds selection pages (separate screens)
- Tenancy type validation against selection
