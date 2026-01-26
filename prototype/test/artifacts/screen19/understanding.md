# Screen 19 — Notice details (Understanding)

## Purpose

This screen captures the method of service used to serve notice on defendants and allows optional upload of notice documents or certificates of service (simulated).

---

## User story reference

`businessArtifacts/userstories/screen19.txt`

---

## Journey context

- **Entry point:** Screen 18 (Notice of your intention to begin possession proceedings)
- **User type:** Professional (Solicitor)
- **Claim type:** England standard possession claim
- **Journey:** Assured tenancy rent arrears journey

---

## Routes

- **GET:** `/claims/notice-details`
- **POST:** `/claims/notice-details`

---

## Page content

### Service method (AC-1, AC-2)
- **Question:** "How did you serve the notice?"
- **Radio options (6 options):**
  1. By first class post or other service which provides for delivery on the next business day
  2. By delivering it to or leaving it at a permitted place
  3. By personally handing it to or leaving it with someone
  4. By email
  5. By other electronic method
  6. Other
- **Required field**

### Document upload (AC-3, AC-4, AC-5, AC-6)
- **Section title:** "Do you want to upload a copy of the notice you served or the certificate of service?"
- **Explanatory text:** Documents can be uploaded now or later, will be included in hearing bundle
- **Upload button:** "Add new" or similar
- **Optional** — can continue without uploading
- **Simulated upload** — stores metadata only (Q1)

---

## Session data

### Storage location
```js
session.claim.noticeDetails = {
  serviceMethod: 'first-class-post' | 'permitted-place' | 'personal-service' | 'email' | 'other-electronic' | 'other',
  documents: [
    {
      id: string,           // Unique identifier
      name: string,         // Filename
      uploadedAt: string    // ISO timestamp
    }
  ]
}
```

### Data flow
- **Service method:** Required radio selection → stored value (Q4: verify value stored, not exact string)
- **Documents:** Optional array, max 10 documents (Q3)
- **Upload simulation:** Mock storage, no actual file handling (Q1)

---

## Document upload rules (Q2)

### Allowed file types
- PDF (`.pdf`)
- Word documents (`.doc`, `.docx`)
- Images (`.jpg`, `.jpeg`, `.png`)

### File size limit
- **Maximum:** 10MB per file

### Validation errors
| Condition | Error Message |
|-----------|---------------|
| Disallowed file type | "The selected file must be a PDF, DOC, DOCX, JPG, JPEG or PNG" |
| File too large | "The selected file must be smaller than 10MB" |

---

## Multiple document upload (Q3)

### Upload limits
- **Maximum documents:** 10
- **Minimum documents:** 0 (optional)

### Upload functionality
- **Add:** "Add new" button to upload document
- **Remove:** Users can delete uploaded documents
- **Display:** List of uploaded documents shown after upload
- **Metadata only:** No actual file storage (simulated)

### Document removal
- Each uploaded document has a "Remove" or "Delete" action
- Removes document from session array
- Re-renders page to show updated list

---

## Navigation outcomes

### Forward navigation (AC-10)
- **Destination:** `/claims/rent-details` (Q5)
- **Trigger:** Continue button + validation passed

### Backward navigation (AC-9)
- **Previous** → `/claims/notice-of-intention` (Screen 18)
- Previous selections preserved

### Cancel (AC-11)
- **Cancel** → `/case-list`
- Claim draft remains in session

---

## Validation (AC-2, AC-6, AC-7)

### Required field
- **Field:** Service method
- **Error:** "Select how you served the notice"

### Upload validation
- **File type:** Must be PDF, DOC, DOCX, JPG, JPEG, or PNG
- **File size:** Must be ≤ 10MB
- **Errors displayed:** GOV.UK error summary + inline error

### Input preservation (AC-7)
- Radio selection preserved on error
- Uploaded documents preserved on error
- All inputs maintained when validation fails

---

## Accessibility (AC-12)

- Error summary displayed at top
- Error links to radio group or upload section
- Focus moves to error summary
- Radio inputs properly labelled
- Upload button keyboard accessible

---

## Testing considerations

1. **6 radio options** — test all values can be selected and stored
2. **Optional upload** — can continue without uploading any documents
3. **Simulated upload** — test session metadata, not actual file storage (Q1)
4. **Multiple uploads** — can upload up to 10 documents (Q3)
5. **Upload validation** — file type and size limits (Q2)
6. **Document removal** — can delete uploaded documents (Q3)
7. **Input preservation** — all data preserved on validation error (AC-7)
8. **Service method values** — verify value stored, not exact string (Q4)

---

## Explicit non-goals

- No validation of whether service method was legally valid
- No capture of dates or recipients of service
- No requirement for documents to be uploaded
- Method and optional documents only (legal assessment later)
