# Screen 17 — Mediation and settlement (Test Plan)

## Test file location

`prototype/test/routes/mediationSettlement.test.js`

---

## Test categories

### 1. Page display tests

**Purpose:** Verify correct content, form elements, and guidance are displayed

**Coverage:**
- AC-1: Mediation guidance displayed
- AC-2: Mediation question displayed
- AC-6: Settlement guidance displayed
- AC-7: Settlement question displayed

**Tests:**
- Page loads successfully
- Mediation guidance present
- Mediation question with Yes/No radios
- Settlement guidance present (generic, not conditional - Q1)
- Settlement question with Yes/No radios
- Continue button present
- Previous/Cancel links present

---

### 2. Conditional display tests

**Purpose:** Verify text areas show/hide based on radio selections

**Coverage:**
- AC-3: Mediation details shown when Yes
- AC-8: Settlement details shown when Yes
- Q4: Text areas hidden when No

**Tests:**
- Mediation details hidden by default
- Mediation details shown when Yes selected
- Mediation details hidden when No selected
- Settlement details hidden by default
- Settlement details shown when Yes selected
- Settlement details hidden when No selected
- Helper text shown with text areas
- Character count hints displayed

---

### 3. Required field validation tests

**Purpose:** Verify both radio selections are required

**Coverage:**
- AC-11: Both selections required

**Tests:**
- Error when mediation question not answered
- Error when settlement question not answered
- Error when both questions not answered
- Error summary displayed
- Inline errors displayed
- Error messages correct
- Focus moves to error summary
- Errors cleared when selections made

---

### 4. Character limit validation tests

**Purpose:** Verify 250 character limit enforced

**Coverage:**
- AC-5: Mediation details character limit
- AC-10: Settlement details character limit
- Q5: 251 characters triggers error

**Tests:**
- 250 chars in mediation details: valid
- 251 chars in mediation details: error
- 250 chars in settlement details: valid
- 251 chars in settlement details: error
- Both fields over limit: multiple errors
- Error message correct for character limit

---

### 5. Optional field tests

**Purpose:** Verify details fields are optional when Yes selected

**Coverage:**
- AC-4: Mediation details optional
- AC-9: Settlement details optional

**Tests:**
- Yes + empty mediation details: valid
- Yes + empty settlement details: valid
- Yes + both empty: valid (radios required, details optional)
- No + any details: details ignored/cleared

---

### 6. Data clearing tests

**Purpose:** Verify details cleared when switching Yes→No

**Coverage:**
- Q4: Clear details when switching to No

**Tests:**
- Submit Yes + details, then switch to No: details cleared
- Submit Yes + mediation details, switch to No: mediation cleared
- Submit Yes + settlement details, switch to No: settlement cleared
- Switch Yes→No→Yes: details not restored (fresh start)

---

### 7. Input preservation tests

**Purpose:** Verify all inputs preserved on validation error

**Coverage:**
- AC-12: Preserve inputs on validation failure

**Tests:**
- Radio selections preserved on error
- Text area content preserved on error
- Both radios + both text areas preserved
- Preserved values with character limit error

---

### 8. Session storage tests

**Purpose:** Verify data stored correctly in session

**Coverage:**
- AC-13: Persist responses in session

**Tests:**
- Both No selections: store booleans only
- Mediation Yes + details: store boolean + string
- Settlement Yes + details: store boolean + string
- Both Yes + both details: store all four values
- Session data persists after redirect
- Previous answers can be changed

---

### 9. Forward navigation tests

**Purpose:** Verify Continue button redirects correctly

**Coverage:**
- AC-14: Continue navigation

**Tests:**
- Valid submission → redirect to `/claims/notice-of-intention` (Q3)
- Session data stored before redirect
- Data persists after redirect

---

### 10. Backward navigation tests

**Purpose:** Verify Previous and Cancel behavior

**Coverage:**
- AC-15: Previous navigation
- AC-16: Cancel behavior

**Tests:**
- Previous → returns to `/claims/preaction-protocol` (Screen 16) (Q2)
- Previous → preserves entered data
- Cancel → returns to `/case-list`
- Cancel → preserves claim draft in session

---

### 11. Accessibility tests

**Purpose:** Verify WCAG/GOV.UK accessibility standards

**Coverage:**
- AC-17: Accessibility compliance

**Tests:**
- Error summary links to fields
- Radio inputs have proper labels
- Text areas have proper labels
- Fieldset/legend structure correct
- Focus management on error
- Keyboard navigation works
- Character count accessible

---

## Navigation helper function

Add to `prototype/test/helpers/sessionHelper.js`:

```js
async function navigateToMediationSettlement(agent) {
  // Start from beginning and navigate through journey
  await navigateToPreActionProtocol(agent);
  
  // Screen 16: Select either Yes or No (both go to mediation-settlement)
  await agent
    .post('/claims/preaction-protocol')
    .send({ followed: 'true' })
    .expect(302);
    
  return agent;
}
```

---

## Test data setup

### Minimal session for Screen 17
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
    }
  }
}
```

### Test data helpers
```js
// 250 character string (valid)
const valid250 = 'A'.repeat(250);

// 251 character string (invalid)
const invalid251 = 'A'.repeat(251);
```

---

## Expected test count

Estimated: **50-60 tests**

Breakdown:
- Display: 7 tests
- Conditional display: 8 tests
- Required validation: 8 tests
- Character limits: 6 tests
- Optional fields: 4 tests
- Data clearing: 4 tests
- Input preservation: 4 tests
- Session storage: 6 tests
- Forward navigation: 3 tests
- Backward navigation: 4 tests
- Accessibility: 6-8 tests
