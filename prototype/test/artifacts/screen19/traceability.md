# Screen 19 — Notice details (Traceability)

## User story → Test mapping

| Acceptance Criteria | Test File | Test IDs | Status |
|---------------------|-----------|----------|--------|
| AC-1: Display service method options | noticeDetails.test.js | D-2 to D-8, SM-1 to SM-7 | ⏳ Pending |
| AC-2: Selection required | noticeDetails.test.js | RV-1 to RV-6 | ⏳ Pending |
| AC-3: Display upload section | noticeDetails.test.js | D-9 to D-11 | ⏳ Pending |
| AC-4: Upload optional | noticeDetails.test.js | OU-1 to OU-3 | ⏳ Pending |
| AC-5: Upload stores metadata | noticeDetails.test.js | US-1 to US-5 | ⏳ Pending |
| AC-6: Upload validation errors | noticeDetails.test.js | UV-6, UV-8, UV-9, UV-10 | ⏳ Pending |
| AC-7: Preserve inputs on error | noticeDetails.test.js | IP-1 to IP-4 | ⏳ Pending |
| AC-8: Persist notice details | noticeDetails.test.js | SS-1 to SS-5 | ⏳ Pending |
| AC-9: Previous navigation | noticeDetails.test.js | BN-1, BN-2 | ⏳ Pending |
| AC-10: Continue navigation | noticeDetails.test.js | FN-1 to FN-3 | ⏳ Pending |
| AC-11: Cancel behaviour | noticeDetails.test.js | BN-3, BN-4 | ⏳ Pending |
| AC-12: Accessibility compliance | noticeDetails.test.js | A-1 to A-8 | ⏳ Pending |

---

## Additional coverage

| Requirement | Test File | Test IDs | Status |
|-------------|-----------|----------|--------|
| Q1: Session metadata only | noticeDetails.test.js | US-1, US-2, US-5 | ⏳ Pending |
| Q2: File type validation | noticeDetails.test.js | UV-1 to UV-8 | ⏳ Pending |
| Q3: Multiple uploads (max 10) | noticeDetails.test.js | MU-1 to MU-6, DR-1 to DR-5 | ⏳ Pending |
| Q4: Verify value stored | noticeDetails.test.js | SM-1 to SM-6, SS-1 | ⏳ Pending |
| Q5: Redirect to rent-details | noticeDetails.test.js | FN-1 | ⏳ Pending |

---

## Test file summary

| Test File | Total Tests | ACs Covered | Status |
|-----------|-------------|-------------|--------|
| noticeDetails.test.js | 78 | AC-1 to AC-12 + Q1-Q5 | ⏳ Not yet created |

---

## Coverage summary

- **Total ACs:** 12
- **Total tests planned:** 78
- **Coverage:** 100% (all ACs covered)
- **Additional tests:** 20 (file type validation, multiple uploads, removal)

---

## Implementation complexity

**Complexity:** ⭐⭐⭐⭐ High

**Key challenges:**
1. **6 radio options** — comprehensive option testing
2. **Simulated file upload** — mock metadata storage without actual files
3. **File type validation** — 6 allowed types, multiple rejected types
4. **File size validation** — 10MB limit enforcement
5. **Multiple uploads** — up to 10 documents
6. **Document removal** — delete from session and UI
7. **Input preservation** — radios + uploaded documents on error
8. **Upload UI** — display list of uploaded documents

**Frontend requirements:**
- File input handling (even if simulated)
- Document list display
- Remove/delete functionality
- Upload validation and error display
- Multiple file management

---

## Dependencies

### Prerequisite screens
- Screen 1: Claim type
- Screen 12: Tenancy type
- Screen 13.1: Assured confirmation
- Screen 13.1.1: Assured grounds selection
- Screen 16: Pre-action protocol
- Screen 17: Mediation and settlement
- Screen 18: Notice of intention

### Navigation helper
- `navigateToNoticeDetails(agent)` in `sessionHelper.js`

### Downstream screens
- Screen TBD: Rent details (`/claims/rent-details`) (Q5)

---

## Notes

- **Entry point:** Screen 18 (Notice of intention)
- **Route:** `/claims/notice-details`
- **Session path:** `session.claim.noticeDetails`
- **Previous:** Returns to Screen 18 (`/claims/notice-of-intention`)
- **Next:** Redirects to `/claims/rent-details` (Q5)
- **Cancel:** Returns to `/case-list`
- **Upload:** Simulated, metadata only (Q1)
- **Allowed types:** PDF, DOC, DOCX, JPG, JPEG, PNG (Q2)
- **Max file size:** 10MB (Q2)
- **Max documents:** 10 (Q3)
- **Document removal:** Supported (Q3)
- **Service method values:** Verify value stored, not exact string (Q4)

---

## Session data structure

```js
session.claim.noticeDetails = {
  serviceMethod: string,  // One of 6 options (Q4: test value exists)
  documents: [
    {
      id: string,           // Unique identifier
      name: string,         // Filename
      uploadedAt: string    // ISO timestamp
    }
  ]  // Empty array if no uploads, max 10 items
}
```

**Storage rules:**
- Service method: required, one of 6 values
- Documents: optional array, 0-10 items
- Upload: simulated, stores metadata only (Q1)
- Removal: deletes from array (Q3)

---

## File upload specifications (Q2)

**Allowed types:**
- `.pdf` — PDF documents
- `.doc` — Word 97-2003 documents
- `.docx` — Word 2007+ documents
- `.jpg`, `.jpeg` — JPEG images
- `.png` — PNG images

**Rejected types:**
- `.txt`, `.exe`, `.bat`, `.zip`, etc.

**Size limit:**
- Maximum: 10MB (10,485,760 bytes)
- Files over limit rejected

**Error messages:**
- Type: "The selected file must be a PDF, DOC, DOCX, JPG, JPEG or PNG"
- Size: "The selected file must be smaller than 10MB"
