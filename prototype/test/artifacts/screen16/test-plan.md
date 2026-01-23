# Screen 16 — Pre-action protocol (Test Plan)

## Test file location

`prototype/test/routes/preActionProtocol.test.js`

---

## Test categories

### 1. Page display tests

**Purpose:** Verify correct content, form elements, and guidance are displayed

**Coverage:**
- AC-1: Guidance content presence (not specific text)
- AC-2: Radio question displayed

**Tests:**
- Page loads successfully
- Guidance sections present
- Warning message present
- Radio question displayed
- Yes/No radio options present
- Continue button present
- Previous/Cancel links present

---

### 2. Validation tests

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

### 3. Forward navigation tests (Yes path)

**Purpose:** Verify session storage and routing for Yes selection

**Coverage:**
- AC-4: Yes path

**Tests:**
- Yes selection → stores `followed: true`
- Yes selection → redirects to `/claims/mediation-settlement`
- Session data persists after redirect

---

### 4. Forward navigation tests (No path)

**Purpose:** Verify session storage and routing for No selection

**Coverage:**
- AC-5: No path

**Tests:**
- No selection → stores `followed: false`
- No selection → redirects to `/claims/mediation-settlement`
- Session data persists after redirect

---

### 5. Session update tests

**Purpose:** Verify changing answers updates session correctly

**Coverage:**
- General session behavior (Steve Q3)

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
- Previous → returns to Screen 13.1 (`/claims/grounds-for-possession-assured-confirmation`)
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
async function navigateToPreActionProtocol(agent) {
  // Start from beginning and navigate through assured path
  await navigateToAssuredConfirmation(agent);
  
  // Screen 13.1: Select No (don't proceed with assured grounds)
  await agent
    .post('/claims/grounds-for-possession-assured-confirmation')
    .send({ assuredProceed: 'false' })
    .expect(302);
  
  // Screen 13.1.1: Select No (no additional grounds)
  await agent
    .post('/claims/grounds-for-possession-assured-selection')
    .send({ hasAdditionalGrounds: 'false' })
    .expect(302);
    
  return agent;
}
```

---

## Test data setup

### Minimal session for Screen 16
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
    }
  }
}
```

### Complete journey session
Use `navigateToPreActionProtocol(agent)` helper to build full session state from Screen 1 onwards.

---

## Expected test count

Estimated: **30-35 tests**

Breakdown:
- Display: 7 tests
- Validation: 6 tests
- Yes path: 3 tests
- No path: 3 tests
- Session updates: 3 tests
- Previous navigation: 2 tests
- Cancel: 2 tests
- Accessibility: 4-6 tests
