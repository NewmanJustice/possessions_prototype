# Screen 18 — Notice of intention (Test Plan)

## Test file location

`prototype/test/routes/noticeOfIntention.test.js`

---

## Test categories

### 1. Page display tests

**Purpose:** Verify correct content, form elements, and guidance are displayed

**Coverage:**
- AC-1: Guidance content presence
- AC-2: Radio question displayed

**Tests:**
- Page loads successfully
- Guidance sections present
- Warning message present
- External link present with correct attributes (Q1)
- Radio question displayed
- Yes/No radio options present
- Continue button present
- Previous/Cancel links present

---

### 2. External link tests

**Purpose:** Verify external guidance link has correct attributes

**Coverage:**
- AC-1: Link opens in new tab
- Q1: Test presence and attributes

**Tests:**
- Link present
- Link has `target="_blank"`
- Link has `rel="noopener noreferrer"`
- Link text/context indicates external guidance

---

### 3. Validation tests

**Purpose:** Verify required field validation

**Coverage:**
- AC-3: Selection required

**Tests:**
- Error when no selection made
- Error summary displayed
- Inline error displayed
- Error message correct
- Focus moves to error summary
- Error cleared when selection made

---

### 4. Session storage and navigation tests (Yes/No paths)

**Purpose:** Verify session storage and routing for both selections

**Coverage:**
- AC-4: Persist notice confirmation
- AC-5: Continue navigation

**Tests:**
- Yes selection → stores `noticeServed: true`
- Yes selection → redirects to `/claims/notice-details`
- No selection → stores `noticeServed: false`
- No selection → redirects to `/claims/notice-details`
- Session data persists after redirect
- Both paths converge to same destination

---

### 5. Session update tests

**Purpose:** Verify changing answers updates session correctly

**Coverage:**
- General session behavior

**Tests:**
- Initial answer stored correctly
- Changing answer updates stored value
- Previous answer overwritten (not appended)

---

### 6. Backward navigation tests

**Purpose:** Verify Previous and Cancel behavior

**Coverage:**
- AC-6: Previous navigation
- AC-7: Cancel behavior

**Tests:**
- Previous → returns to `/claims/mediation-settlement` (Screen 17)
- Previous → preserves previous selection
- Cancel → returns to `/case-list`
- Cancel → preserves claim draft in session

---

### 7. Accessibility tests

**Purpose:** Verify WCAG/GOV.UK accessibility standards

**Coverage:**
- AC-8: Accessibility compliance

**Tests:**
- Error summary links to radio group
- Radio inputs have proper labels
- Fieldset/legend structure correct
- Focus management on error
- Keyboard navigation works

---

## Navigation helper function

Add to `prototype/test/helpers/sessionHelper.js`:

```js
async function navigateToNoticeOfIntention(agent) {
  // Start from beginning and navigate through journey
  await navigateToMediationSettlement(agent);
  
  // Screen 17: Submit mediation and settlement
  await agent
    .post('/claims/mediation-settlement')
    .send({ 
      mediationAttempted: 'false',
      settlementAttempted: 'false'
    })
    .expect(302);
    
  return agent;
}
```

---

## Test data setup

### Minimal session for Screen 18
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
      mediationDetails: null,
      settlementAttempted: false,
      settlementDetails: null
    }
  }
}
```

### Complete journey session
Use `navigateToNoticeOfIntention(agent)` helper to build full session state from Screen 1 onwards.

---

## Expected test count

Estimated: **30-35 tests**

Breakdown:
- Display: 8 tests
- External link: 3 tests
- Validation: 6 tests
- Yes path: 3 tests
- No path: 3 tests
- Session updates: 3 tests
- Previous navigation: 2 tests
- Cancel: 2 tests
- Accessibility: 5 tests
