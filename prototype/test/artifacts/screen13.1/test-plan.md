# Screen 13.1: Grounds for Possession - Test Plan

## Scope

### In Scope
- GET `/claims/grounds` - Page rendering and content
- POST `/claims/grounds` - Form submission and branching
- Yes → redirect to `/claims/assured-tenancy-grounds-selection`
- No → redirect to `/claims/other-tenancy-grounds`
- Session storage of `session.claim.grounds.rentArrears`
- Navigation (Previous, Cancel)
- GOV.UK error summary on validation failure

### Out of Scope
- Subsequent grounds selection pages
- Tenancy type validation

## Types of Tests

| Type | Purpose |
|------|---------|
| Integration | Route behaviour, session handling, redirects |
| Validation | Radio selection required |
| Branching | Correct redirect based on selection |
| State | Session data persistence |
| Navigation | Previous/Cancel link behaviour |

## Assumptions for Testing

1. Previous page: `/claims/tenancy`
2. Branch destinations:
   - Yes (rent arrears) → `/claims/assured-tenancy-grounds-selection`
   - No (not rent arrears) → `/claims/other-tenancy-grounds`
3. Session stores: `session.claim.grounds.rentArrears` as `true` or `false`
