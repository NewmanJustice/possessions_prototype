# Screen 12: Tenancy or Licence Details - Understanding Document

## Summary

As a solicitor making a possession claim, I need to record the tenancy or licence information for the claim. This page collects:

1. **Tenancy/licence type** - Required radio selection from predefined list
2. **Start date** - Optional date (but if partially entered, must be complete)
3. **Document upload** - Optional simulated file upload for tenancy agreement

## Key Behaviours

### Primary Behaviour (Happy Path)
- Solicitor selects a tenancy type from the radio options
- Solicitor optionally enters a start date (all three parts if any)
- Solicitor optionally uploads tenancy agreement document(s)
- On successful submission, tenancy data saved to `session.claim.tenancy` and user proceeds to `/claims/grounds`

### Variants
- **Tenancy type**: One of: Assured, Secure, Introductory, Flexible, Demoted, Other
- **Other type**: If "Other" selected, optional free-text field revealed
- **Start date**: Empty (skip) OR complete valid date (all three parts)
- **Documents**: Zero or more uploaded files (simulated)

### Conditional Logic Flow
```
Select tenancy type (required)
├─ Assured/Secure/Introductory/Flexible/Demoted → Continue
└─ Other → Reveal "Please specify" text field (optional)

Start date (optional)
├─ All empty → OK, continue
├─ Partial (1 or 2 fields) → Error
└─ Complete valid date → Save to session

Upload documents (optional, simulated)
├─ No files → OK, continue
├─ Valid file type/size → Store metadata, show in list
└─ Invalid type/size → Error
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
3. **Next page**: `/claims/grounds`
4. **File upload**: Simulated - metadata stored in session, no actual file storage
5. **File removal**: Users can remove uploaded files from the list

## Ambiguities Identified

| Item | Ambiguity | Resolution |
|------|-----------|------------|
| A1 | How is file upload simulated? | Assume form field stores filename, generates fake ID/timestamp |
| A2 | What happens if same file uploaded twice? | Not specified - assume allowed (different IDs) |
| A3 | File removal confirmation? | Not specified - assume immediate removal |

## Out of Scope

- Actual file storage/retrieval
- File content validation (virus scanning, etc.)
- Multiple tenancy records
- Tenancy end date
