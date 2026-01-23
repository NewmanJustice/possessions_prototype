# Screen 13.1.1: Assured Tenancy Grounds Selection - Understanding Document

## Overview
This page allows solicitors to select which rent arrears grounds (8, 10, 11) apply to their possession claim, and whether they have additional grounds beyond rent arrears.

## Route
- **URL:** `/claims/assured-tenancy-grounds-selection`
- **Previous:** `/claims/grounds` (screen 13.1 - rent arrears = Yes)
- **Next (Yes):** `/claims/other-tenancy-grounds` (has additional grounds)
- **Next (No):** `/claims/reasons-for-possessions` (no additional grounds)

## Page Elements

### Grounds Checkboxes (all optional)
- Ground 8: Serious rent arrears
- Ground 10: Rent arrears
- Ground 11: Persistent delay in paying rent

### Other Grounds Radio (required)
- "Do you have any other grounds for possession?"
- Options: Yes / No
- Validation error if neither selected

### Navigation
- Previous → `/claims/grounds`
- Cancel → `/case-list`
- Continue → branching based on radio selection

## Session State

```js
session.claim.grounds = {
  rentArrears: true,  // Already set from screen 13.1
  assuredTenancy: {
    ground8: true | false,
    ground10: true | false,
    ground11: true | false
  },
  hasAdditionalGrounds: true | false
}
```

## Key Behaviours

1. **Checkboxes are optional** - page can be submitted with none selected
2. **Radio is required** - must select Yes or No to continue
3. **Selections persist** - even when clicking Previous (before Continue)
4. **Re-visit pre-populates** - both checkboxes and radio show previous values

## Branching Logic

```
POST /claims/assured-tenancy-grounds-selection
├─ hasAdditionalGrounds: 'yes' → 302 /claims/other-tenancy-grounds
└─ hasAdditionalGrounds: 'no'  → 302 /claims/reasons-for-possessions
```

## Page Title
"Grounds for possession - Possessions - GOV.UK"

## Error States
- Missing radio selection: "Select whether you have other grounds for possession"
- Error page title: "Error: Grounds for possession - Possessions - GOV.UK"

## Clarifications from Steve
- Q1: Route confirmed as `/claims/assured-tenancy-grounds-selection`
- Q2: Typo in user story - redirect is `/claims/other-tenancy-grounds` not "tenency"
- Q3: Both checkboxes and radio pre-populated on re-visit
- Q4: Only radio validation - checkboxes are optional
- Q5: Selections persist even when clicking Previous
- Q6: Page title is "Grounds for possession"
