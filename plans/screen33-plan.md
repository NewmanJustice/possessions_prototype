# Screen 33 Implementation Plan

**Created:** 2026-02-02T14:00:00Z
**Screen:** Upload additional documents
**Route:** `/claims/upload-additional-document`

---

## Summary

Screen 33 allows solicitors to upload supporting documents. Users can add multiple documents via "Add new" button, each requiring a document type (mandatory) and optionally a description. This is prototype-only with no actual file storage.

---

## Understanding

- Dynamic form with add/remove document functionality
- Document type dropdown is mandatory for each document
- If user selected "Yes" on Screen 32, at least one document is required
- Test count: 22 tests

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `prototype/src/routes/claims.js` | Modify | Add GET/POST routes |
| `prototype/src/views/pages/claims/upload-additional-document.njk` | Create | New template with dynamic form |

---

## Implementation Steps

1. Create Nunjucks template with document entry form
2. Add GET route handler (display page with existing documents)
3. Add POST route handler with:
   - addNew action → add document entry, re-render
   - remove-{index} action → remove document, re-render
   - previous → redirect to Screen 32
   - cancel → redirect to /case-list
   - default → validate and redirect to Screen 34
4. Implement validation (document type required, at least one if from Screen 32 Yes)
5. Run tests and fix failures

---

## Session Data

**Read:**
- `session.claim.forfeitureRelief.hasUnderlesseeOrMortgageeForRelief` - determines if document required
- `session.claim.uploadedDocuments` - existing documents

**Write:**
- `session.claim.uploadedDocuments` - array of document objects

---

## Validation Rules

- Document type required for each document entry
- At least one document required if `hasUnderlesseeOrMortgageeForRelief === 'yes'`

---

## Template Components

- govukSelect for document type
- govukFileUpload for file input (prototype only)
- govukInput for description
- govukButton for Add new, Remove, Previous, Continue, Cancel
- govukErrorSummary for validation errors

---

## Document Type Options

- contact-log: "Contact log"
- tenancy-agreement: "Tenancy agreement"
- correspondence: "Correspondence"
- court-order: "Court order"
- notice-to-tenant: "Notice to tenant"
- proof-of-service: "Proof of service"
- other: "Other supporting document"

---

## Definition of Done

- [ ] All 22 tests passing
- [ ] Route accessible at /claims/upload-additional-document
- [ ] Add/Remove document functionality working
- [ ] Validation working
- [ ] Navigation working
