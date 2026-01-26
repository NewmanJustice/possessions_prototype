# Test Plan: Screen 13.2 — Secure/Flexible Tenancy Grounds Selection

## Scope

### In Scope
- ✅ Display of 8 grounds as checkboxes (discretionary + mandatory)
- ✅ Multiple ground selection (checkboxes)
- ✅ Minimum one ground selection validation
- ✅ Ground 1 conditional radio reveal/hide
- ✅ Ground 1 sub-option validation (rent arrears vs breach)
- ✅ Session data persistence (secureFlexible grounds object)
- ✅ Checkbox state preservation on revisit
- ✅ Conditional radio state preservation on revisit
- ✅ Navigation (Previous, Continue, Cancel)
- ✅ GOV.UK error patterns (summary, inline, focus)
- ✅ Accessibility compliance (conditional reveal announcements)

### Out of Scope
- ❌ Legal validation of grounds
- ❌ Grounds combination logic
- ❌ Notice or arrears amounts
- ❌ Preventing claim progression

---

## Test Types

### 1. Display Tests
- Page structure (heading, explanatory text)
- All 8 ground checkboxes present
- Ground labels match design
- Conditional radio group (initially hidden)
- Navigation buttons (Previous, Continue, Cancel)

### 2. Validation Tests
**Minimum Selection:**
- No grounds selected → error
- At least one ground selected → valid

**Ground 1 Conditional:**
- Ground 1 checked + no sub-option → error
- Ground 1 checked + rent arrears → valid
- Ground 1 checked + breach → valid
- Ground 1 unchecked → no sub-option required

### 3. Conditional Behavior Tests
- Ground 1 checked → radio group revealed
- Ground 1 unchecked → radio group hidden
- Ground 1 checked → unchecked → ground1Type cleared
- Other grounds → no conditional reveal

### 4. Session Persistence Tests
- Each ground stored as boolean
- ground1Type stored correctly (rentArrears/breach/null)
- Data structure matches specification
- Values persist on page revisit

### 5. Multi-Selection Tests
- Single ground (no Ground 1)
- Single ground (Ground 1 only)
- Multiple grounds including Ground 1
- Multiple grounds excluding Ground 1
- All 8 grounds selected

### 6. Error Handling Tests
- GOV.UK error summary displayed
- Error summary links to fields
- Focus moves to error summary
- Inline errors on fields
- Multiple simultaneous errors
- Checkbox values preserved on error
- Radio values preserved on error

### 7. Navigation Tests
- Previous → /claims/tenancy
- Continue → /claims/rent-arrears-breach-of-tenency
- Cancel → /case-list

### 8. Accessibility Tests
- Conditional radio announced to assistive tech
- Error summary focus management
- All controls keyboard accessible
- Labels properly associated
- ARIA attributes correct

---

## Test Environment

### Technology Stack
- **Framework:** Jest
- **HTTP Testing:** Supertest + supertest-session
- **Template Engine:** Nunjucks
- **UI Components:** GOV.UK Frontend

### Prerequisites
- Session initialized with `groundsModel = 'SECURE_LIKE'`
- Navigation via `sessionHelper` from tenancy page

### Test Data

#### Grounds (from screen13.2.png)
| Ground | Key | Label |
|--------|-----|-------|
| 1 | ground1 | Rent arrears or breach of the tenancy |
| 2 | ground2 | Nuisance or annoyance |
| 2A | ground2A | Domestic violence |
| 3 | ground3 | Deterioration of dwelling |
| 4 | ground4 | Deterioration of furniture |
| 5 | ground5 | False statement |
| 6 | ground6 | Premium paid for assignment |
| 7 | ground7 | Misconduct or conviction |
| 8 | ground8 | Serious rent arrears |

#### Ground 1 Sub-Options
- **rentArrears**: "Rent arrears"
- **breach**: "Breach of tenancy"

---

## Assumptions

1. **Conditional reveal:** GOV.UK pattern with `govuk-radios__conditional`
2. **Session availability:** `session.claim.grounds` initialized
3. **Placeholder route:** `/claims/rent-arrears-breach-of-tenency` exists
4. **Error messages:** Match AC-4 text exactly
5. **Minimum selection error:** "Select at least one ground for possession"

---

## Risks & Constraints

### Risks
| Risk | Mitigation |
|------|------------|
| Conditional reveal JavaScript not working | Test with/without JS |
| Ground 1 validation bypass | Test all conditional paths |
| Session structure mismatch | Explicit structure tests |
| Accessibility issues | Test screen reader announcements |

### Constraints
- Cannot test actual next screen implementation (placeholder only)
- Conditional reveal depends on GOV.UK Frontend JavaScript

---

## Test Execution Strategy

### Phase 1: Display & Structure
1. Page renders correctly
2. All 8 ground checkboxes present
3. Ground 1 conditional initially hidden
4. Navigation buttons visible

### Phase 2: Validation
1. No grounds selected → error
2. Ground 1 only + no sub-option → error
3. Ground 1 + sub-option selected → valid
4. Other grounds only → valid
5. Error presentation (summary + inline)

### Phase 3: Conditional Behavior
1. Check Ground 1 → radio reveals
2. Uncheck Ground 1 → radio hides
3. Check/uncheck → ground1Type cleared
4. Other grounds → no reveal

### Phase 4: Multi-Selection
1. Various ground combinations
2. All grounds selected
3. Ground 1 with different sub-options

### Phase 5: Session & Persistence
1. Grounds stored correctly
2. ground1Type stored correctly
3. Session structure validated
4. Pre-population on revisit

### Phase 6: Navigation
1. Previous navigation
2. Continue navigation (valid submission)
3. Cancel navigation

### Phase 7: Accessibility
1. Error focus management
2. Conditional reveal announcements
3. Keyboard navigation
4. ARIA compliance

---

## Success Criteria

- ✅ All 10 acceptance criteria covered by tests
- ✅ Happy path tests pass
- ✅ Edge cases identified and tested
- ✅ Error scenarios validated
- ✅ Conditional logic verified
- ✅ Session persistence proven
- ✅ Accessibility standards met
- ✅ Traceability to ACs maintained

---

## Estimated Test Count

- Display: ~12 tests
- Validation (minimum selection): ~4 tests
- Validation (Ground 1 conditional): ~6 tests
- Conditional behavior: ~8 tests
- Multi-selection: ~8 tests
- Session persistence: ~10 tests
- Error handling: ~8 tests
- Navigation: ~6 tests
- Accessibility: ~8 tests

**Total: ~70 tests**

---

**Status:** ✅ Test plan complete  
**Next:** Create test matrix and map to acceptance criteria
