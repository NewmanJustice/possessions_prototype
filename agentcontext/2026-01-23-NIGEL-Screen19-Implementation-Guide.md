# Screen 19 Implementation Guide - Notice Details

**Date:** 2026-01-23  
**Author:** Nigel (Tester Agent)  
**For:** Claude (Developer Agent)  
**User Story:** `businessArtifacts/userstories/screen19.txt`

---

## Overview

Screen 19 captures the service method and allows optional simulated document uploads. This is the most complex screen so far, featuring 6 radio options and simulated file upload functionality with type/size validation, multiple uploads (max 10), and document removal.

**Complexity:** ⭐⭐⭐⭐ High — File upload simulation, multiple validations, document management

---

## Changes Required

### 1. Create new route handler
**File:** `prototype/src/app/routes/noticeDetails.js` (replace placeholder from Screen 18)

### 2. Create template
**File:** `prototype/src/app/views/noticeDetails.njk` (new file)

### 3. Create placeholder route
**File:** `prototype/src/app/routes/rentDetails.js` (temporary placeholder)

### 4. Add file upload simulation logic
**Note:** Simulated upload - stores metadata only, no actual file handling (Q1)

---

## Key Implementation Notes (Q1-Q5)

**Q1: Upload Simulation**
- Store metadata only: `{ id, name, uploadedAt, size }`
- NO actual file storage
- Tests verify session data only

**Q2: File Validation**
- **Allowed types:** PDF, DOC, DOCX, JPG, JPEG, PNG
- **Max size:** 10MB (10,485,760 bytes)
- **Type error:** "The selected file must be a PDF, DOC, DOCX, JPG, JPEG or PNG"
- **Size error:** "The selected file must be smaller than 10MB"

**Q3: Multiple Uploads**
- Maximum 10 documents
- Users can remove uploaded documents
- Display list of uploaded files
- Remove button for each document

**Q4: Service Method Values**
- Test verifies a value is stored
- Don't test exact string match
- Use kebab-case values: `first-class-post`, `permitted-place`, `personal-service`, `email`, `other-electronic`, `other`

**Q5: Next Screen**
- Redirect to `/claims/rent-details`
- Create placeholder route

---

## Route Handler Implementation

Create `prototype/src/app/routes/noticeDetails.js`:

```javascript
const express = require('express');
const router = express.Router();

// Helper: Validate file type
function isValidFileType(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  return ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'].includes(ext);
}

// Helper: Validate file size
function isValidFileSize(size) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  return size <= MAX_SIZE;
}

// GET /claims/notice-details
router.get('/claims/notice-details', (req, res) => {
  if (!req.session.claim) {
    return res.redirect('/claims/start');
  }

  if (!req.session.claim.noticeDetails) {
    req.session.claim.noticeDetails = {
      documents: []
    };
  }

  const data = req.session.claim.noticeDetails;

  res.render('noticeDetails', {
    serviceMethod: data.serviceMethod,
    documents: data.documents || [],
    errors: req.session.errors || {}
  });

  delete req.session.errors;
});

// POST /claims/notice-details/upload (simulated upload endpoint)
router.post('/claims/notice-details/upload', (req, res) => {
  const { document } = req.body;
  
  if (!req.session.claim.noticeDetails) {
    req.session.claim.noticeDetails = { documents: [] };
  }

  const errors = {};

  // Validation: File type (Q2)
  if (!isValidFileType(document.name)) {
    errors.upload = {
      text: 'The selected file must be a PDF, DOC, DOCX, JPG, JPEG or PNG'
    };
  }

  // Validation: File size (Q2)
  if (!isValidFileSize(document.size)) {
    errors.upload = {
      text: 'The selected file must be smaller than 10MB'
    };
  }

  // Validation: Max 10 documents (Q3)
  if (req.session.claim.noticeDetails.documents.length >= 10) {
    errors.upload = {
      text: 'You can only upload a maximum of 10 documents'
    };
  }

  if (Object.keys(errors).length > 0) {
    req.session.errors = errors;
    return res.status(400).json({ errors });
  }

  // Store metadata only (Q1)
  req.session.claim.noticeDetails.documents.push({
    id: document.id,
    name: document.name,
    uploadedAt: document.uploadedAt,
    size: document.size
  });

  res.json({ success: true, document });
});

// POST /claims/notice-details/remove (remove document)
router.post('/claims/notice-details/remove', (req, res) => {
  const { documentId } = req.body;
  
  if (req.session.claim.noticeDetails && req.session.claim.noticeDetails.documents) {
    req.session.claim.noticeDetails.documents = 
      req.session.claim.noticeDetails.documents.filter(doc => doc.id !== documentId);
  }

  res.json({ success: true });
});

// POST /claims/notice-details
router.post('/claims/notice-details', (req, res) => {
  const { serviceMethod } = req.body;

  const errors = {};

  // Validation: AC-2
  if (!serviceMethod) {
    errors.serviceMethod = {
      text: 'Select how you served the notice'
    };
  }

  if (Object.keys(errors).length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/notice-details');
  }

  // Initialize if needed
  if (!req.session.claim.noticeDetails) {
    req.session.claim.noticeDetails = { documents: [] };
  }

  // Store service method: AC-8
  req.session.claim.noticeDetails.serviceMethod = serviceMethod;

  // AC-10: Redirect to rent-details (Q5)
  res.redirect('/claims/rent-details');
});

module.exports = router;
```

---

## Template Implementation

Create `prototype/src/app/views/noticeDetails.njk`:

```njk
{% extends "layout.njk" %}

{% block pageTitle %}
  Notice details - HMCTS Possessions
{% endblock %}

{% block beforeContent %}
  {{ govukBackLink({
    text: "Previous",
    href: "/claims/notice-of-intention"
  }) }}
{% endblock %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">

      {% if errors.serviceMethod or errors.upload %}
        {% set errorList = [] %}
        {% if errors.serviceMethod %}
          {% set errorList = (errorList.push({
            text: errors.serviceMethod.text,
            href: "#serviceMethod"
          }), errorList) %}
        {% endif %}
        {% if errors.upload %}
          {% set errorList = (errorList.push({
            text: errors.upload.text,
            href: "#upload"
          }), errorList) %}
        {% endif %}

        {{ govukErrorSummary({
          titleText: "There is a problem",
          errorList: errorList,
          attributes: {
            tabindex: "-1"
          }
        }) }}
      {% endif %}

      <h1 class="govuk-heading-l">Notice details</h1>

      <form method="post" action="/claims/notice-details">

        {# AC-1: Service method radios #}
        {{ govukRadios({
          name: "serviceMethod",
          fieldset: {
            legend: {
              text: "How did you serve the notice?",
              classes: "govuk-fieldset__legend--m"
            }
          },
          items: [
            {
              value: "first-class-post",
              text: "By first class post or other service which provides for delivery on the next business day",
              checked: serviceMethod === 'first-class-post'
            },
            {
              value: "permitted-place",
              text: "By delivering it to or leaving it at a permitted place",
              checked: serviceMethod === 'permitted-place'
            },
            {
              value: "personal-service",
              text: "By personally handing it to or leaving it with someone",
              checked: serviceMethod === 'personal-service'
            },
            {
              value: "email",
              text: "By email",
              checked: serviceMethod === 'email'
            },
            {
              value: "other-electronic",
              text: "By other electronic method",
              checked: serviceMethod === 'other-electronic'
            },
            {
              value: "other",
              text: "Other",
              checked: serviceMethod === 'other'
            }
          ],
          errorMessage: errors.serviceMethod if errors.serviceMethod
        }) }}

        {# AC-3: Upload section #}
        <h2 class="govuk-heading-m">Do you want to upload a copy of the notice you served or the certificate of service?</h2>
        
        <p class="govuk-body">
          Documents can be uploaded now or later and will be included in the hearing bundle.
        </p>

        {# Display uploaded documents (Q3) #}
        {% if documents.length > 0 %}
          <div class="govuk-form-group">
            <h3 class="govuk-heading-s">Uploaded documents</h3>
            <ul class="govuk-list">
              {% for doc in documents %}
                <li>
                  {{ doc.name }}
                  <form method="post" action="/claims/notice-details/remove" style="display:inline;">
                    <input type="hidden" name="documentId" value="{{ doc.id }}">
                    <button type="submit" class="govuk-link" style="border:none;background:none;cursor:pointer;">
                      Remove
                    </button>
                  </form>
                </li>
              {% endfor %}
            </ul>
          </div>
        {% endif %}

        {# Upload button (simulated - actual implementation would use file input) #}
        <div class="govuk-form-group" id="upload">
          <button type="button" class="govuk-button govuk-button--secondary" data-module="upload-button">
            Add document
          </button>
          {% if errors.upload %}
            <p class="govuk-error-message">
              <span class="govuk-visually-hidden">Error:</span> {{ errors.upload.text }}
            </p>
          {% endif %}
        </div>

        <div class="govuk-button-group">
          {{ govukButton({
            text: "Continue"
          }) }}
          
          <a class="govuk-link" href="/case-list">Cancel</a>
        </div>
      </form>

    </div>
  </div>

  {# Simulated upload JavaScript (for demonstration) #}
  <script>
    // This would be replaced with actual file upload handling
    // For prototype, this simulates the upload process
    document.querySelector('[data-module="upload-button"]')?.addEventListener('click', function() {
      // Simulate file selection and upload
      const mockFile = {
        id: 'doc-' + Date.now(),
        name: 'example.pdf',
        uploadedAt: new Date().toISOString(),
        size: 1024
      };
      
      fetch('/claims/notice-details/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: mockFile })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          location.reload();
        }
      });
    });
  </script>
{% endblock %}
```

---

## Session Data Structure

After successful submission:

```javascript
session.claim.noticeDetails = {
  serviceMethod: string,  // One of 6 values (Q4)
  documents: [
    {
      id: string,           // Unique identifier
      name: string,         // Filename
      uploadedAt: string,   // ISO timestamp
      size: number          // File size in bytes
    }
  ]  // Empty array if no uploads, max 10 items (Q3)
}
```

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| serviceMethod | Required | "Select how you served the notice" |
| File type | Must be PDF, DOC, DOCX, JPG, JPEG, PNG | "The selected file must be a PDF, DOC, DOCX, JPG, JPEG or PNG" |
| File size | Must be ≤ 10MB | "The selected file must be smaller than 10MB" |
| Document count | Max 10 documents | "You can only upload a maximum of 10 documents" |

---

## Navigation Flow

```
Screen 18 (Notice of intention)
  ↓
Screen 19 (Notice details)
  ↓
/claims/rent-details (Q5)

Previous → /claims/notice-of-intention (Screen 18)
Cancel → /case-list
```

---

## Placeholder Route (Temporary)

Create `prototype/src/app/routes/rentDetails.js`:

```javascript
const express = require('express');
const router = express.Router();

// Temporary placeholder for Screen TBD: Rent details
router.get('/claims/rent-details', (req, res) => {
  res.send('<h1>Placeholder: Rent Details</h1><p>This screen will be implemented later.</p>');
});

module.exports = router;
```

Register in `app.js`:
```javascript
const rentDetailsRoute = require('./routes/rentDetails');
app.use('/', rentDetailsRoute);
```

---

## Test Execution

Run the test file:
```bash
cd prototype
npm test -- test/routes/noticeDetails.test.js
```

**Expected result:** 78/78 tests passing

---

## Verification Checklist

After implementation, verify:

**Display:**
- [ ] Page loads at `/claims/notice-details`
- [ ] Service method question with 6 radio options
- [ ] All 6 options selectable
- [ ] Upload section title and text
- [ ] Upload/Add button present
- [ ] Continue button present
- [ ] Previous/Cancel links present

**Service Method:**
- [ ] All 6 options can be selected and stored
- [ ] Selected value persists on reload
- [ ] Error when no selection made
- [ ] Validation error clears with selection

**Document Upload:**
- [ ] Can continue without uploading (optional)
- [ ] Upload stores metadata only (Q1)
- [ ] Uploaded documents displayed in list
- [ ] PDF, DOC, DOCX, JPG, JPEG, PNG accepted (Q2)
- [ ] Invalid file types rejected (Q2)
- [ ] Files ≤10MB accepted, >10MB rejected (Q2)
- [ ] Can upload up to 10 documents (Q3)
- [ ] 11th upload prevented/shows error (Q3)
- [ ] Remove button for each uploaded document (Q3)
- [ ] Removing document updates list and session (Q3)

**Session & Navigation:**
- [ ] Service method value stored (Q4)
- [ ] Documents array stored (empty or with items)
- [ ] Session persists after redirect
- [ ] Valid submission → `/claims/rent-details` (Q5)
- [ ] Previous → `/claims/notice-of-intention`
- [ ] Cancel → `/case-list`

**Accessibility:**
- [ ] Error summary links correctly
- [ ] Radio inputs properly labelled
- [ ] Fieldset/legend structure
- [ ] Focus management on errors
- [ ] All 78 tests passing

---

## Common Issues

**Issue:** File upload not working  
**Fix:** Ensure using simulated upload (metadata only). No actual file handling required for prototype.

**Issue:** Documents array not initializing  
**Fix:** Always initialize `documents: []` when creating `noticeDetails` object

**Issue:** Remove button not working  
**Fix:** Ensure documentId matches the id in session array. Filter by exact id match.

**Issue:** 11th upload accepted  
**Fix:** Check array length BEFORE adding: `if (documents.length >= 10) { error }`

**Issue:** File type validation inconsistent  
**Fix:** Use lowercase: `filename.toLowerCase().split('.').pop()`

**Issue:** File size stored as string  
**Fix:** Ensure size is number: `size: parseInt(document.size)`

---

## Notes

- **Complexity:** ⭐⭐⭐⭐ High (highest so far)
- **Upload:** Simulated metadata storage only (Q1)
- **File types:** 6 allowed types (Q2)
- **File size:** 10MB maximum (Q2)
- **Multiple uploads:** Up to 10 documents (Q3)
- **Removal:** Supported via separate endpoint (Q3)
- **Service method:** 6 radio options, test value stored (Q4)
- **Next screen:** `/claims/rent-details` (Q5)
- **Tests:** 78 tests covering all scenarios
- **PRG pattern:** POST → Redirect → GET

---

## Test Artifacts Location

- Understanding: `prototype/test/artifacts/screen19/understanding.md`
- Test Plan: `prototype/test/artifacts/screen19/test-plan.md`
- Test Matrix: `prototype/test/artifacts/screen19/test-matrix.md`
- Traceability: `prototype/test/artifacts/screen19/traceability.md`
- Executable Tests: `prototype/test/routes/noticeDetails.test.js` (790 lines, 78 tests)
- Navigation Helper: `prototype/test/helpers/sessionHelper.js` (navigateToNoticeDetails)

---

**Ready for implementation!** 🚀

This is the most complex screen so far. The key challenge is simulating file upload without actual file handling. All tests verify session metadata only. Pay special attention to the 10-document limit and file validation rules.
