# Screen 34 Implementation Plan

**Created:** 2026-02-02T15:30:00Z
**Screen:** Applications
**Route:** `/claims/applications`

---

## Summary

Screen 34 asks whether the solicitor plans to make an application at the same time as their claim. It provides explanatory content about what applications are and when to make them.

---

## Understanding

- Simple Yes/No question with explanatory content
- Dynamic Previous navigation (Screen 33 if documents uploaded, Screen 32 otherwise)
- Test count: ~25 tests

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `prototype/src/routes/claims.js` | Modify | Add GET/POST routes |
| `prototype/src/views/pages/claims/applications.njk` | Create | New template |

---

## Implementation Steps

1. Create Nunjucks template with explanatory content
2. Add GET route handler
3. Add POST route handler with validation and dynamic Previous
4. Run tests and fix failures

---

## Session Data

**Read:**
- `session.claim.uploadedDocuments` - to determine Previous destination
- `session.claim.applications.planningApplication` - for pre-population

**Write:**
- `session.claim.applications.planningApplication` - 'yes' | 'no'

---

## Validation Rules

- planningApplication: Required - "Select yes if you are planning to make an application at the same time as your claim"

---

## Navigation

- Previous → Dynamic (Screen 33 if uploadedDocuments.length > 0, else Screen 32)
- Continue → Screen 35 (/claims/language-used)
- Cancel → /case-list
