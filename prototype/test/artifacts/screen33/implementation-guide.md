# Implementation Guide — Screen 33: Upload additional documents

## Overview

Screen 33 allows users to upload supporting documents. This is a prototype-only feature with dynamic add/remove functionality.

---

## Route Configuration

```javascript
GET  /claims/upload-additional-document
POST /claims/upload-additional-document
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/pages/claims/upload-additional-document.njk`

---

## Form Fields

### Document Entry (repeatable)
| Field | Type | Required | Name |
|-------|------|----------|------|
| Document type | Select | Yes | `documents[0].documentType` |
| File | File input | No | `documents[0].fileName` |
| Description | Text | No | `documents[0].description` |

### Document Type Options
- contact-log: "Contact log"
- tenancy-agreement: "Tenancy agreement"
- correspondence: "Correspondence"
- court-order: "Court order"
- notice-to-tenant: "Notice to tenant"
- proof-of-service: "Proof of service"
- other: "Other supporting document"

---

## Validation Rules

| Condition | Rule | Error Message |
|-----------|------|---------------|
| Document type | Required per document | "Select the type of document" |
| At least one document | Required if Screen 32 = Yes | "You must upload at least one document" |

---

## Session Structure

```javascript
session.claim.uploadedDocuments = [
  {
    id: 'doc-1',
    documentType: 'contact-log',
    fileName: 'document.pdf',
    description: 'Contact log for tenant'
  }
]
```

---

## Navigation Logic

### Previous
```javascript
return res.redirect('/claims/underlessee-mortgagee-forfeiture-relief');
```

### Continue (after validation)
```javascript
return res.redirect('/claims/applications');
```

### Cancel
```javascript
return res.redirect('/case-list');
```

---

## POST Actions

| Action | Behaviour |
|--------|-----------|
| `addNew` | Add new document entry, re-render page |
| `remove-{id}` | Remove document with ID, re-render page |
| `previous` | Go to Screen 32 |
| `cancel` | Go to /case-list |
| `continue` (default) | Validate and proceed to Screen 34 |

---

## Test File Reference

Tests: `prototype/test/routes/uploadAdditionalDocument.test.js`

Run: `npm test -- --testPathPattern="uploadAdditionalDocument"`
