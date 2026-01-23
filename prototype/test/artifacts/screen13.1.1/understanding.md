# Screen 13.1.1: Assured Tenancy Grounds Selection - Understanding Document

## Overview
This page allows solicitors to select which assured-tenancy rent arrears grounds (8, 10, 11) apply to their possession claim, and whether they have additional grounds beyond these rent arrears grounds.

## Route
- **URL:** `/claims/grounds-for-possession-assured-selection`
- **Previous:** `/claims/grounds-for-possession-assured-confirmation` (Screen 13.1 - assured confirmation = Yes)
- **Next (Yes radio or button):** `/claims/grounds-for-possession` (title: "Additional grounds for possession")
- **Next (No radio):** `/claims/preaction-protocol` (Screen 16)

## Page Elements

### Grounds Checkboxes (all optional)
- Ground 8: Serious rent arrears
- Ground 10: Rent arrears
- Ground 11: Persistent delay in paying rent

### Additional Grounds Section (required - radio OR button)
- Radio question: "Do you have any additional grounds for possession?"
  - Options: Yes / No
- **Primary button:** "Add additional grounds" (green, positioned underneath radios)
  - Immediately redirects to `/claims/grounds-for-possession`
  - Bypasses Continue button
  - Same destination as "Yes" radio

### Validation Logic
- Checkboxes: All optional (can submit with none selected)
- Additional grounds: **Error only if**:
  - No radio selected AND
  - "Add additional grounds" button NOT pressed
- Allows bypassing radio via button click

### Navigation
- Previous → `/claims/grounds-for-possession-assured-confirmation`
- Cancel → `/case-list`
- Continue → branching based on radio selection
- "Add additional grounds" button → immediate redirect

## Session State

```js
session.claim.grounds = {
  rentArrears: true,           // Set from earlier journey (deprecated for assured path)
  assuredProceed: true,        // Set from Screen 13.1
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
2. **Radio is required UNLESS button pressed** - validation bypassed if button used
3. **Button provides shortcut** - "Add additional grounds" button skips radio selection
4. **Selections persist** - both checkboxes and radio show previous values on re-visit
5. **Button click is immediate** - stores session data and redirects without Continue click

## Branching Logic

```
POST /claims/grounds-for-possession-assured-selection

Option 1: "Add additional grounds" button clicked
  → hasAdditionalGrounds = true
  → 302 /claims/grounds-for-possession (immediate)

Option 2: Radio "Yes" + Continue clicked
  → hasAdditionalGrounds = true
  → 302 /claims/grounds-for-possession

Option 3: Radio "No" + Continue clicked
  → hasAdditionalGrounds = false
  → 302 /claims/preaction-protocol

Option 4: Neither radio nor button
  → Validation error
```

## Page Title
"Grounds for possession - Possessions - GOV.UK"

## Error States
- Missing radio selection (and button not pressed): "Select whether you have additional grounds for possession"
- Error page title: "Error: Grounds for possession - Possessions - GOV.UK"

## Button Specifications
- **Label:** "Add additional grounds"
- **Style:** Primary button (green) - matching Continue button
- **Position:** Underneath the radio options
- **Behavior:** Immediate redirect (POST request, not link)
- **Accessibility:** Keyboard focusable, accessible name provided

## Clarifications from Steve (2026-01-23)
- Route name: `/claims/grounds-for-possession-assured-selection` (updated from old name)
- Both checkboxes and radio pre-populated on re-visit
- Checkboxes are optional (no validation)
- Button is primary (green) style, positioned underneath radios
- `/claims/preaction-protocol` is placeholder (test redirect only)
- Destination page title "Additional grounds for possession" is just guidance (don't test)
