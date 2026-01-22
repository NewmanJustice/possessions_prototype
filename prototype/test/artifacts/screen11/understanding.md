# Screen 11: Defendant Details - Understanding Document

## Summary

As a solicitor making a possession claim, I need to provide details about the defendant (the person the claim is against). This page collects:

1. **Defendant name** - Whether known, and if so, first and last name
2. **Defendant correspondence address** - Whether known, and if so, whether same as property or different
3. **Additional defendants** - Whether more defendants need to be added (not yet supported)

## Key Behaviours

### Primary Behaviour (Happy Path)
- Solicitor indicates if defendant's name is known, provides name if yes
- Solicitor indicates if defendant's address is known
- If address known, solicitor chooses "same as property" or enters different address
- Solicitor confirms no additional defendants needed
- On successful submission, defendant saved to `session.claim.defendants[]` and user proceeds to `/claims/grounds`

### Variants
- **Name**: Known (provide first/last name) OR Unknown (skip name fields)
- **Address**: Unknown OR Known + Same as property OR Known + Different address (manual entry)
- **Additional defendants**: No (continue) OR Yes (show not-supported message on same page)

### Conditional Logic Flow
```
Do you know defendant's name?
├─ Yes → Show first name + last name fields (required)
└─ No → Hide name fields, clear any stored names

Do you know defendant's correspondence address?
├─ No → Store addressKnown=false, continue
└─ Yes → Is address same as property?
         ├─ Yes → Copy property address, clear any manual address
         └─ No → Show postcode lookup + manual address fields (required)

Do you need to add another defendant?
├─ No → Continue to /claims/grounds
└─ Yes → Show "not supported" message (JavaScript reveal on same page)
```

### Constraints
- Single defendant only for this iteration
- Name fields: first name and last name both required if name known
- Address fields: Building/Street, Town/City, Postcode required if entering manual address
- Defendant stored as array even for single defendant
- Property address must exist in session from earlier in journey

## Initial Assumptions

1. **Route**: `/claims/defendant-details`
2. **Previous page**: `/claims/contact-preferences`
3. **Next page**: `/claims/grounds`
4. **Property address source**: `session.claim.propertyAddress`
5. **Additional defendants UI**: JavaScript reveal on same page (not separate route)
6. **Postcode lookup**: UI element only for now (simulated)
7. **Name limits**: Max 255 chars for first/last name, special characters allowed

## Ambiguities Identified

| Item | Ambiguity | Resolution |
|------|-----------|------------|
| A1 | What if `session.claim.propertyAddress` doesn't exist? | Claude to handle gracefully - show error or redirect |
| A2 | What message shows for "additional defendants not supported"? | Assume standard placeholder text |
| A3 | Can defendant have title (Mr/Mrs/etc)? | Not mentioned - assume not required |

## Out of Scope

- Multiple defendants (placeholder only)
- Defendant title/salutation
- Defendant contact details (phone/email)
- Company/organisation as defendant
