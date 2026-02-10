# Screen 15: Reasons for Possession - Understanding

## Summary

Screen 15 allows solicitors to provide reasons for claiming possession under each selected ground. This screen **loops through each selected ground** from previous screens (13.1.1 and/or 14), displaying a dynamic heading with the ground name and number, and an optional textarea for entering reasons.

## Key Behaviours

### Primary Behaviour (Happy Path)
1. User arrives at screen with one or more grounds selected from session
2. Screen displays the first ground's name and number in heading
3. User optionally enters reasons (up to 500 characters)
4. User clicks Continue to move to next ground or pre-action protocol if complete
5. Reasons are persisted per ground in session

### Variants
- **Single ground selected**: User completes one iteration, redirects to pre-action protocol
- **Multiple grounds selected**: User loops through each ground sequentially
- **No text entered**: Valid submission (reasons are optional)
- **Previous within loop**: Navigates to previous ground's reasons page
- **Previous from first ground**: Returns to grounds-for-possession
- **Cancel**: Returns to case-list, preserving draft

### Constraints
- Text area maximum: 500 characters
- Reasons are optional (no required-field validation)
- Loop controller tracks current ground index
- Session stores reasons keyed by ground identifier (e.g., 'assured.ground8')

## Session Structure

```javascript
session.claim.reasonsForPossession = {
  'assured.ground8': 'Tenant has accumulated significant arrears...',
  'assured.ground10': '',
  'additional.mandatoryGround1': 'Landlord requires property for...'
}

session.claim.reasonsLoop = {
  grounds: ['assured.ground8', 'assured.ground10', 'additional.mandatoryGround1'],
  currentIndex: 0
}
```

## Initial Assumptions

1. **Ground definitions** are defined in the route handler for mapping ground keys to display names
2. **Selected grounds** are collected from session's assured grounds (13.1.1) and additional grounds (14)
3. **Loop initialisation** happens on first GET if no reasonsLoop exists or if grounds changed
4. **Loop cleanup** occurs when all grounds processed (reasonsLoop set to null)

## Ambiguities / Questions

- **Q1**: What happens if user navigates directly to /claims/reasons-for-possession with no grounds selected?
  - **Assumption**: Redirect to pre-action protocol (skip screen)

- **Q2**: Should reasons be preserved when navigating back via Previous?
  - **Assumption**: Yes, per AC-9 - "previously entered reasons are preserved"

- **Q3**: What happens if grounds change mid-flow (user goes back and changes selections)?
  - **Assumption**: Loop reinitialises with new grounds list, existing reasons preserved where keys match

## Dependencies

- **Preceding screens**: 13.1.1 (Assured grounds) and/or 14 (Additional grounds)
- **Following screen**: 16 (Pre-action protocol)
- **Session state**: `claim.grounds.assured`, `claim.grounds.additional`
