# Screen 12: Tenancy or Licence Details - Understanding Document

## Summary

As a solicitor making a possession claim, I need to record the tenancy or licence information for the claim. This page collects:

1. **Tenancy/licence type** - Required radio selection from predefined list
2. **Start date** - Optional date (but if partially entered, must be complete)
3. **Document upload** - Optional simulated file upload for tenancy agreement
4. **Grounds model determination** - System determines which grounds journey to follow based on tenancy type

## Key Behaviours

### Primary Behaviour (Happy Path)
- Solicitor selects a tenancy type from the radio options
- Solicitor optionally enters a start date (all three parts if any)
- Solicitor optionally uploads tenancy agreement document(s)
- System determines `groundsModel` based on selected tenancy type
- On successful submission, tenancy data (including groundsModel) saved to `session.claim.tenancy`
- User is routed to the appropriate grounds screen based on groundsModel

### Variants
- **Tenancy type**: One of: Assured, Secure, Introductory, Flexible, Demoted, Other
- **Other type**: If "Other" selected, optional free-text field revealed
- **Start date**: Empty (skip) OR complete valid date (all three parts)
- **Documents**: Zero or more uploaded files (simulated)
- **Grounds model**: Determined automatically from tenancy type selection

### Conditional Logic Flow
```
Select tenancy type (required)
├─ Assured/Secure/Introductory/Flexible/Demoted → Continue
└─ Other → Reveal "Please specify" text field (optional)

Determine groundsModel (automatic)
├─ Assured → ASSURED
├─ Secure/Introductory/Flexible → SECURE_LIKE
└─ Demoted/Other → OTHER_UNSUPPORTED

Start date (optional)
├─ All empty → OK, continue
├─ Partial (1 or 2 fields) → Error
└─ Complete valid date → Save to session

Upload documents (optional, simulated)
├─ No files → OK, continue
├─ Valid file type/size → Store metadata, show in list
└─ Invalid type/size → Error

Routing (based on groundsModel)
├─ ASSURED → /claims/grounds-for-possession-assured
├─ SECURE_LIKE → /claims/grounds-for-possession-secure-flexible
└─ OTHER_UNSUPPORTED → /claims/grounds-for-possession-intro-demoted-other
```

### Constraints
- Tenancy type is required
- Start date: if any part entered, all three required
- Date validation: day 1-31, month 1-12, year 1800-2100
- File types: .pdf, .doc, .docx, .jpg, .png
- Max file size: 5MB (simulated)
- "Other" free-text: max 255 characters

## Initial Assumptions

1. **Route**: `/claims/tenancy`
2. **Previous page**: `/claims/defendant-details`
3. **Next page**: Conditional based on groundsModel:
   - ASSURED → `/claims/grounds-for-possession-assured`
   - SECURE_LIKE → `/claims/grounds-for-possession-secure-flexible`
   - OTHER_UNSUPPORTED → `/claims/grounds-for-possession-intro-demoted-other`
4. **File upload**: Simulated - metadata stored in session, no actual file storage
5. **File removal**: Users can remove uploaded files from the list
6. **Grounds model**: Automatically determined from tenancy type, cannot be manually overridden
7. **State clearing**: Changing tenancy type that results in different groundsModel clears incompatible grounds data

## Ambiguities Identified

| Item | Ambiguity | Resolution |
|------|-----------|------------|
| A1 | How is file upload simulated? | Assume form field stores filename, generates fake ID/timestamp |
| A2 | What happens if same file uploaded twice? | Not specified - assume allowed (different IDs) |
| A3 | File removal confirmation? | Not specified - assume immediate removal |

## Grounds Model Mapping (AC-15)

| Tenancy Type          | groundsModel        | Next Route                                              |
| --------------------- | ------------------- | ------------------------------------------------------- |
| Assured tenancy       | ASSURED             | /claims/grounds-for-possession-assured                  |
| Secure tenancy        | SECURE_LIKE         | /claims/grounds-for-possession-secure-flexible          |
| Introductory tenancy  | SECURE_LIKE         | /claims/grounds-for-possession-secure-flexible          |
| Flexible tenancy      | SECURE_LIKE         | /claims/grounds-for-possession-secure-flexible          |
| Demoted tenancy       | OTHER_UNSUPPORTED   | /claims/grounds-for-possession-intro-demoted-other      |
| Other                 | OTHER_UNSUPPORTED   | /claims/grounds-for-possession-intro-demoted-other      |

## Session State Structure

```js
session.claim.tenancy = {
  type: 'assured-tenancy' | 'secure-tenancy' | 'introductory-tenancy' | 'flexible-tenancy' | 'demoted-tenancy' | 'other',
  otherTypeDetails: string | null,
  startDate: { day, month, year } | null,
  documents: [{ id, name, uploadedAt }],
  groundsModel: 'ASSURED' | 'SECURE_LIKE' | 'OTHER_UNSUPPORTED'  // NEW
}
```

## State Clearing Logic (AC-16)

When tenancy type is changed and the groundsModel changes:

- **From ASSURED to non-ASSURED**: Clear `session.claim.grounds.assuredTenancy`, `session.claim.grounds.rentArrears`, `session.claim.grounds.hasAdditionalGrounds`
- **From SECURE_LIKE to non-SECURE_LIKE**: Clear `session.claim.grounds.secureTenancy` and related data
- **To OTHER_UNSUPPORTED**: Clear all `session.claim.grounds` data
- **Within same groundsModel**: Preserve all grounds data

## Out of Scope

- Actual file storage/retrieval
- File content validation (virus scanning, etc.)
- Multiple tenancy records
- Tenancy end date
- Manual groundsModel override
- Validation of legal correctness of tenancy/grounds combinations
