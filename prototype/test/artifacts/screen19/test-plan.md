# Screen 19 — Notice details (Test Plan)

## Test file location

`prototype/test/routes/noticeDetails.test.js`

---

## Test categories

### 1. Page display tests

**Purpose:** Verify correct content, form elements, and sections are displayed

**Coverage:**
- AC-1: Service method options displayed
- AC-3: Upload section displayed

**Tests:**
- Page loads successfully
- Service method question displayed
- All 6 radio options present
- Upload section title displayed
- Upload explanatory text present
- Add/Upload button present
- Continue button present
- Previous/Cancel links present

---

### 2. Service method selection tests

**Purpose:** Verify all 6 radio options can be selected and stored

**Coverage:**
- AC-1: All service method options
- Q4: Verify value stored

**Tests:**
- First class post option selectable
- Permitted place option selectable
- Personal service option selectable
- Email option selectable
- Other electronic option selectable
- Other option selectable
- Selected value stored in session (not testing exact string)

---

### 3. Required field validation tests

**Purpose:** Verify service method is required

**Coverage:**
- AC-2: Selection required

**Tests:**
- Error when no service method selected
- Error summary displayed
- Inline error displayed
- Error message correct: "Select how you served the notice"
- Focus moves to error summary
- Error cleared when selection made

---

### 4. Optional upload tests

**Purpose:** Verify upload is optional and can continue without documents

**Coverage:**
- AC-4: Upload is optional

**Tests:**
- Can continue without uploading any documents
- No validation error when documents array empty
- Service method + no documents = valid submission

---

### 5. Document upload simulation tests

**Purpose:** Verify upload stores metadata correctly

**Coverage:**
- AC-5: Successful upload stores metadata
- Q1: Session data only

**Tests:**
- Upload stores document metadata (id, name, uploadedAt)
- Document appears in session documents array
- Document displayed in uploaded list
- Multiple uploads create multiple array entries
- Metadata has all required fields

---

### 6. Upload validation tests

**Purpose:** Verify file type and size validation

**Coverage:**
- AC-6: Upload validation errors
- Q2: File type and size limits

**Tests:**
- Allowed types accepted: PDF, DOC, DOCX, JPG, JPEG, PNG
- Disallowed type rejected (e.g., .txt, .exe)
- Error message: "The selected file must be a PDF, DOC, DOCX, JPG, JPEG or PNG"
- File ≤ 10MB accepted
- File > 10MB rejected
- Error message: "The selected file must be smaller than 10MB"
- Error summary and inline error displayed

---

### 7. Multiple upload tests

**Purpose:** Verify multiple document uploads up to limit

**Coverage:**
- Q3: Multiple uploads, max 10

**Tests:**
- Can upload multiple documents
- All documents stored in array
- All documents displayed in list
- Can upload up to 10 documents
- 11th upload prevented or shows error
- Documents numbered/listed correctly

---

### 8. Document removal tests

**Purpose:** Verify documents can be deleted

**Coverage:**
- Q3: Remove uploaded documents

**Tests:**
- Remove button/link present for each document
- Removing document deletes from session array
- Removing document updates displayed list
- Can remove all documents
- Can re-upload after removal

---

### 9. Input preservation tests

**Purpose:** Verify all inputs preserved on validation error

**Coverage:**
- AC-7: Preserve inputs on validation failure

**Tests:**
- Radio selection preserved on error
- Uploaded documents preserved on error
- Both radio + documents preserved together
- Preserved after upload validation error

---

### 10. Session storage tests

**Purpose:** Verify data stored correctly in session

**Coverage:**
- AC-8: Persist notice details

**Tests:**
- Service method stored (value verified, not exact string - Q4)
- Empty documents array stored when no uploads
- Documents array stored with uploads
- Session data persists after redirect
- Previous answers can be changed

---

### 11. Forward navigation tests

**Purpose:** Verify Continue button redirects correctly

**Coverage:**
- AC-10: Continue navigation

**Tests:**
- Valid submission → redirect to `/claims/rent-details` (Q5)
- Session data stored before redirect
- Data persists after redirect

---

### 12. Backward navigation tests

**Purpose:** Verify Previous and Cancel behavior

**Coverage:**
- AC-9: Previous navigation
- AC-11: Cancel behavior

**Tests:**
- Previous → returns to `/claims/notice-of-intention` (Screen 18)
- Previous → preserves entered data
- Cancel → returns to `/case-list`
- Cancel → preserves claim draft in session

---

### 13. Accessibility tests

**Purpose:** Verify WCAG/GOV.UK accessibility standards

**Coverage:**
- AC-12: Accessibility compliance

**Tests:**
- Error summary links to radio group
- Error summary links to upload section (when upload error)
- Radio inputs have proper labels
- Upload button labelled correctly
- Fieldset/legend structure correct
- Focus management on error
- Keyboard navigation works

---

## Navigation helper function

Add to `prototype/test/helpers/sessionHelper.js`:

```js
async function navigateToNoticeDetails(agent) {
  // Start from beginning and navigate through journey
  await navigateToNoticeOfIntention(agent);
  
  // Screen 18: Select either Yes or No (both go to notice-details)
  await agent
    .post('/claims/notice-of-intention')
    .send({ noticeServed: 'true' })
    .expect(302);
    
  return agent;
}
```

---

## Test data setup

### Minimal session for Screen 19
```js
{
  claim: {
    tenancy: {
      type: 'assured-tenancy',
      groundsModel: 'ASSURED'
    },
    grounds: {
      assuredProceed: false,
      hasAdditionalGrounds: false
    },
    preActionProtocol: {
      followed: true
    },
    mediationSettlement: {
      mediationAttempted: false,
      settlementAttempted: false
    },
    noticeOfIntention: {
      noticeServed: true
    }
  }
}
```

### Mock file upload helpers
```js
// Simulated file metadata
function createMockDocument(filename = 'notice.pdf') {
  return {
    id: `doc-${Date.now()}`,
    name: filename,
    uploadedAt: new Date().toISOString()
  };
}

// File type tests
const validFiles = ['notice.pdf', 'certificate.docx', 'scan.jpg'];
const invalidFiles = ['script.exe', 'data.txt', 'virus.bat'];

// File size tests
const validSize = 10 * 1024 * 1024;      // 10MB
const invalidSize = 11 * 1024 * 1024;    // 11MB
```

---

## Expected test count

Estimated: **65-75 tests**

Breakdown:
- Display: 8 tests
- Service method selection: 7 tests
- Required validation: 6 tests
- Optional upload: 3 tests
- Upload simulation: 5 tests
- Upload validation: 7 tests
- Multiple uploads: 6 tests
- Document removal: 5 tests
- Input preservation: 4 tests
- Session storage: 5 tests
- Forward navigation: 3 tests
- Backward navigation: 4 tests
- Accessibility: 6-8 tests
