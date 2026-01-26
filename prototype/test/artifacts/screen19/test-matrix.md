# Screen 19 — Notice details (Test Matrix)

## Display tests (AC-1, AC-3)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| D-1 | Page loads successfully | GET /claims/notice-details | Status 200, correct title | AC-1 |
| D-2 | Service method question displayed | GET request | Question text visible | AC-1 |
| D-3 | First class post option present | GET request | Radio option 1 visible | AC-1 |
| D-4 | Permitted place option present | GET request | Radio option 2 visible | AC-1 |
| D-5 | Personal service option present | GET request | Radio option 3 visible | AC-1 |
| D-6 | Email option present | GET request | Radio option 4 visible | AC-1 |
| D-7 | Other electronic option present | GET request | Radio option 5 visible | AC-1 |
| D-8 | Other option present | GET request | Radio option 6 visible | AC-1 |
| D-9 | Upload section title displayed | GET request | Section heading visible | AC-3 |
| D-10 | Upload explanatory text displayed | GET request | Guidance about later upload shown | AC-3 |
| D-11 | Upload button present | GET request | Add/Upload button visible | AC-3 |
| D-12 | Continue button present | GET request | Submit button visible | - |

---

## Service method selection tests (AC-1, Q4)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| SM-1 | First class post selectable | POST serviceMethod=first-class-post | Value stored in session | AC-1, Q4 |
| SM-2 | Permitted place selectable | POST serviceMethod=permitted-place | Value stored in session | AC-1, Q4 |
| SM-3 | Personal service selectable | POST serviceMethod=personal-service | Value stored in session | AC-1, Q4 |
| SM-4 | Email selectable | POST serviceMethod=email | Value stored in session | AC-1, Q4 |
| SM-5 | Other electronic selectable | POST serviceMethod=other-electronic | Value stored in session | AC-1, Q4 |
| SM-6 | Other selectable | POST serviceMethod=other | Value stored in session | AC-1, Q4 |
| SM-7 | Selected value persists | POST, then GET | Selected radio checked | Q4 |

---

## Required field validation (AC-2)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| RV-1 | Error when no selection | POST with no serviceMethod | Status 400, error displayed | AC-2 |
| RV-2 | Error summary displayed | POST with no selection | Error summary at top | AC-2 |
| RV-3 | Inline error displayed | POST with no selection | Error by radio group | AC-2 |
| RV-4 | Error message correct | POST with no selection | "Select how you served the notice" | AC-2 |
| RV-5 | Focus to error summary | POST with error | Focus moves to summary | AC-2 |
| RV-6 | Error clears with selection | POST valid after error | No error, redirect success | AC-2 |

---

## Optional upload tests (AC-4)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| OU-1 | Can continue without uploads | POST serviceMethod only | Redirect success, no error | AC-4 |
| OU-2 | Empty documents array valid | POST with no documents | documents: [] in session | AC-4 |
| OU-3 | Service method sufficient | POST serviceMethod=email, no docs | Valid submission | AC-4 |

---

## Upload simulation tests (AC-5, Q1)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| US-1 | Upload stores metadata | Upload notice.pdf | id, name, uploadedAt in session | AC-5, Q1 |
| US-2 | Document in array | Upload one file | documents array has 1 entry | AC-5 |
| US-3 | Document displayed | Upload and reload | File shown in uploaded list | AC-5 |
| US-4 | Multiple uploads in array | Upload 2 files | documents array has 2 entries | AC-5, Q1 |
| US-5 | Metadata has required fields | Upload file | id, name, uploadedAt all present | AC-5, Q1 |

---

## Upload validation tests (AC-6, Q2)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| UV-1 | PDF accepted | Upload .pdf file | File uploaded successfully | Q2 |
| UV-2 | DOC accepted | Upload .doc file | File uploaded successfully | Q2 |
| UV-3 | DOCX accepted | Upload .docx file | File uploaded successfully | Q2 |
| UV-4 | JPG accepted | Upload .jpg file | File uploaded successfully | Q2 |
| UV-5 | PNG accepted | Upload .png file | File uploaded successfully | Q2 |
| UV-6 | Invalid type rejected | Upload .txt file | Error: "must be a PDF, DOC, DOCX, JPG, JPEG or PNG" | AC-6, Q2 |
| UV-7 | 10MB file accepted | Upload 10MB file | File uploaded successfully | Q2 |
| UV-8 | 11MB file rejected | Upload 11MB file | Error: "must be smaller than 10MB" | AC-6, Q2 |
| UV-9 | Error summary on invalid type | Upload .exe | Error summary displayed | AC-6 |
| UV-10 | Inline error on invalid size | Upload 15MB | Inline error displayed | AC-6 |

---

## Multiple upload tests (Q3)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| MU-1 | Can upload multiple files | Upload 3 files | All 3 in documents array | Q3 |
| MU-2 | All files displayed | Upload 3 files | All 3 shown in list | Q3 |
| MU-3 | Can upload up to 10 | Upload 10 files | All 10 stored | Q3 |
| MU-4 | 11th upload prevented/error | Upload 11 files | Error or 11th rejected | Q3 |
| MU-5 | Documents numbered | Upload multiple | Clear identification/order | Q3 |
| MU-6 | Mixed types allowed | Upload PDF + JPG + DOCX | All accepted | Q3 |

---

## Document removal tests (Q3)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| DR-1 | Remove button present | Upload 1 file | Remove/Delete action visible | Q3 |
| DR-2 | Remove deletes from session | Upload, then remove | File removed from documents array | Q3 |
| DR-3 | Remove updates display | Upload, then remove | File no longer in list | Q3 |
| DR-4 | Can remove all documents | Upload 3, remove all | documents array empty | Q3 |
| DR-5 | Can re-upload after removal | Upload, remove, upload again | New file in array | Q3 |

---

## Input preservation tests (AC-7)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| IP-1 | Radio preserved on error | Submit with upload error | Radio selection still checked | AC-7 |
| IP-2 | Documents preserved on error | Upload files, trigger error | Files still in list | AC-7 |
| IP-3 | Both preserved together | Radio + files + error | Both radio and files preserved | AC-7 |
| IP-4 | Preserved with validation error | Upload invalid, have radio | Valid uploads and radio preserved | AC-7 |

---

## Session storage tests (AC-8, Q4)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| SS-1 | Service method stored | POST with serviceMethod | Value in session (not testing exact string) | AC-8, Q4 |
| SS-2 | Empty documents array stored | POST without uploads | documents: [] in session | AC-8 |
| SS-3 | Documents array with uploads | POST with 2 uploads | documents array has 2 items | AC-8 |
| SS-4 | Session persists after redirect | Submit, then navigate | Data still in session | AC-8 |
| SS-5 | Can change service method | POST, change, POST again | New value replaces old | AC-8 |

---

## Forward navigation tests (AC-10, Q5)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| FN-1 | Valid submission redirects | Valid POST | Redirect to /claims/rent-details | AC-10, Q5 |
| FN-2 | Session stored before redirect | Valid submission | Data in session before redirect | AC-10 |
| FN-3 | Data persists after redirect | Submit, check session | Data still present | AC-10 |

---

## Backward navigation tests (AC-9, AC-11)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| BN-1 | Previous returns to Screen 18 | Click Previous | Redirect to /claims/notice-of-intention | AC-9 |
| BN-2 | Previous preserves data | Enter data, Previous, return | Data preserved | AC-9 |
| BN-3 | Cancel returns to case-list | Click Cancel | Redirect to /case-list | AC-11 |
| BN-4 | Cancel preserves draft | Enter data, Cancel | Session data preserved | AC-11 |

---

## Accessibility tests (AC-12)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| A-1 | Error summary links to radio | Required field error | Link to #serviceMethod | AC-12 |
| A-2 | Error summary links to upload | Upload error | Link to upload section | AC-12 |
| A-3 | Radio inputs labelled | GET request | Labels for all radios | AC-12 |
| A-4 | Upload button labelled | GET request | Button properly labelled | AC-12 |
| A-5 | Fieldset structure correct | GET request | Fieldset + legend for radios | AC-12 |
| A-6 | Focus management on error | POST with error | Focus to error summary | AC-12 |
| A-7 | Keyboard accessible | Keyboard navigation | All controls reachable | AC-12 |
| A-8 | Remove buttons accessible | Upload files | Remove actions keyboard accessible | AC-12 |

---

## Test coverage summary

| Category | Test IDs | Count |
|----------|----------|-------|
| Display | D-1 to D-12 | 12 |
| Service method selection | SM-1 to SM-7 | 7 |
| Required validation | RV-1 to RV-6 | 6 |
| Optional upload | OU-1 to OU-3 | 3 |
| Upload simulation | US-1 to US-5 | 5 |
| Upload validation | UV-1 to UV-10 | 10 |
| Multiple uploads | MU-1 to MU-6 | 6 |
| Document removal | DR-1 to DR-5 | 5 |
| Input preservation | IP-1 to IP-4 | 4 |
| Session storage | SS-1 to SS-5 | 5 |
| Forward navigation | FN-1 to FN-3 | 3 |
| Backward navigation | BN-1 to BN-4 | 4 |
| Accessibility | A-1 to A-8 | 8 |
| **Total** | | **78** |

---

## Acceptance Criteria mapping

| AC | Description | Test IDs | Count |
|----|-------------|----------|-------|
| AC-1 | Service method options | D-2 to D-8, SM-1 to SM-7 | 13 |
| AC-2 | Selection required | RV-1 to RV-6 | 6 |
| AC-3 | Upload section displayed | D-9 to D-11 | 3 |
| AC-4 | Upload optional | OU-1 to OU-3 | 3 |
| AC-5 | Upload stores metadata | US-1 to US-5 | 5 |
| AC-6 | Upload validation | UV-6, UV-8, UV-9, UV-10 | 4 |
| AC-7 | Preserve inputs | IP-1 to IP-4 | 4 |
| AC-8 | Persist notice details | SS-1 to SS-5 | 5 |
| AC-9 | Previous navigation | BN-1, BN-2 | 2 |
| AC-10 | Continue navigation | FN-1 to FN-3 | 3 |
| AC-11 | Cancel behaviour | BN-3, BN-4 | 2 |
| AC-12 | Accessibility | A-1 to A-8 | 8 |
| **Total AC coverage** | | | **58** |

Additional tests (Q1-Q5): 20 tests
