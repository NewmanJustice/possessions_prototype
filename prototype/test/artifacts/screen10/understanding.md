# Screen 10: Contact Preferences - Understanding Document

## Summary

As a solicitor making a possession claim, I need to specify how the court should contact me regarding this claim. This single page collects three pieces of contact information:

1. **Notification email** - Where claim updates are sent (use registered email or provide alternative)
2. **Correspondence address** - Where court documents are posted (use registered address or provide alternative)
3. **Contact phone** - Optional phone number for urgent updates

## Key Behaviours

### Primary Behaviour (Happy Path)
- Solicitor sees their registered email and address displayed read-only
- Solicitor can choose to use registered details OR provide alternatives
- Phone number is optional
- On successful submission, all preferences are saved to `session.claim.contactPreferences` and user proceeds to `/claims/defendant-details`

### Variants
- **Email**: Use registered (Yes) OR provide alternate email (No)
- **Address**: Use registered (Yes) OR enter alternate via postcode lookup/manual entry (No)
- **Phone**: Provide phone (Yes) OR decline (No) - both are valid paths

### Constraints
- Email must be valid format (max 254 chars)
- Phone must be 7-15 digits (after stripping formatting)
- Address required fields: Building/Street, Town/City, Postcode
- Only one notification email allowed (single address)
- Postcode lookup is simulated with fixed dummy data

## Initial Assumptions

1. **Route**: `/claims/contact-preferences`
2. **Previous page**: `/claims/name-of-claimant`
3. **Next page**: `/claims/defendant-details`
4. **Session data sources**:
   - Registered email: `session.user.email_registered` (or `session.user.email` if not set)
   - Registered address: `session.user.registeredAddress`
5. **Postcode lookup**: Simulated, returns fixed addresses for known postcodes only
6. **Phone validation**: 7-15 digits after stripping spaces, +, parentheses
7. **Single page**: All three sections (email, address, phone) on one page

## Ambiguities Identified

| Item | Ambiguity | Resolution |
|------|-----------|------------|
| A1 | What if `session.user.email_registered` doesn't exist? | Assume fallback to `session.user.email` |
| A2 | What if `session.user.registeredAddress` doesn't exist? | Test should set up fixtures; Claude to handle gracefully |
| A3 | Postcode lookup "no results" behaviour | Not tested - UI only at this stage (per Steve) |
| A4 | Can user submit with all sections incomplete? | No - at minimum must choose Yes/No for email and address |

## Out of Scope

- Actual postcode lookup API integration (simulated only)
- Non-UK address validation
- Welsh language variants
- Multiple notification emails
