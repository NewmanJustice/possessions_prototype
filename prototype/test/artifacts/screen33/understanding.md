# Understanding — Screen 33: Upload additional documents

## Summary

Screen 33 allows solicitors to upload supporting documents for their possession claim. Users can add multiple documents, each requiring a document type (mandatory) and optionally a short description. This is a prototype-only feature with no actual file storage.

## Entry Conditions

Screen 33 is reached when:
- User selects "Yes" on Screen 32 (there is an underlessee/mortgagee entitled to claim relief against forfeiture)

## Key Behaviors

1. Display page heading: "Upload additional documents"
2. Display instructional text and guidance
3. "Add new" button to add document entries
4. Each document entry has:
   - Document type dropdown (mandatory)
   - File input (Choose file)
   - Short description (optional)
   - Remove button
   - Cancel upload button
5. Multiple documents can be added
6. If user came via "Yes" on Screen 32, at least one document is required
7. Validation follows GOV.UK patterns

## Session Shape

```javascript
session.claim.uploadedDocuments = [
  {
    id: 'doc-1',
    documentType: 'contact-log' | 'tenancy-agreement' | etc.,
    fileName: 'filename.pdf' | null,
    description: 'string' | null
  }
]
```

## Navigation

- Previous → Screen 32 (`/claims/underlessee-mortgagee-forfeiture-relief`)
- Continue → Screen 34 (`/claims/applications`)
- Cancel → `/case-list`

## Assumptions

1. File upload is UI-only (no actual storage)
2. Document type is required for each document entry
3. At least one document required if user selected "Yes" on Screen 32
