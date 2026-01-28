# Test Plan — Screen 26c: Housing Act (Demotion of tenancy)

## Scope

### In Scope
- Page rendering with Housing Act heading and guidance
- Two radio options display (1985 s82A, 1996 s143A)
- Radio selection validation (required)
- Session persistence of Housing Act choice
- Pre-population on revisit
- Navigation: Previous, Continue, Cancel
- Error handling and accessibility (GOV.UK patterns)
- Route creation for `/claims/select-housing-act-demotion`

### Out of Scope
- "Other" Housing Act option (explicitly excluded)
- Free-text section input field (section embedded in options)
- Legal validation of chosen Act
- Supporting evidence collection
- Screen 26d implementation (separate story)

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handlers:** GET and POST for `/claims/select-housing-act-demotion`
- **Validation logic:** Required selection
- **Session management:** String persistence, pre-population
- **Navigation flows:** Previous, Continue, Cancel

### 2. Session State Tests
- Housing Act value storage (`housingAct: string`)
- Pre-population based on session values
- Selection change handling

### 3. Accessibility Tests
- Error summary rendering and focus
- Error link to radio group
- Keyboard navigation for radios and buttons
- Proper labelling of form elements

---

## Assumptions

1. **Form field name:** `demotionHousingAct` for radio group
2. **Radio values:** `housing-act-1985-section-82a` and `housing-act-1996-section-143a`
3. **GOV.UK components:** Using `govukRadios` with standard pattern
4. **Error pattern:** Standard GOV.UK error summary and inline error
5. **Pre-population logic:** Radio checked based on session state
6. **Screen 26d placeholder:** May be needed for continue route testing
7. **Entry condition:** User must have selected "Demotion of tenancy" on Screen 26

---

## Risks and Constraints

### Risks
1. **Field name collision:** Different field names from Screen 26a (`demotionHousingAct` vs `housingAct`)
2. **Value format:** Hyphenated values with embedded section reference
3. **Session namespace:** Using `demotionOrder` vs `suspensionOrder`
4. **Navigation dependency:** Screen 26d may not exist yet

### Mitigations
1. Use distinct naming throughout tests and implementation
2. Test exact value matching for session storage
3. Verify correct session object is used
4. Create placeholder route for Screen 26d if needed

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Validation:** Single validation rule (required selection)
- **Navigation:** Linear flow (no branching)

---

## Test Approach

### Happy Path Tests
1. Display page with Housing Act heading and guidance
2. Display two radio options with correct labels
3. Select 1985 option and submit successfully
4. Select 1996 option and submit successfully
5. Navigate using Previous/Continue/Cancel

### Edge and Boundary Cases
1. First visit (no pre-selection)
2. Revisit with 1985 pre-selected
3. Revisit with 1996 pre-selected
4. Change from 1985 to 1996
5. Change from 1996 to 1985

### Error and Invalid Scenarios
1. Submit without selection (validation error)
2. Error summary display and focus
3. Inline error message
4. Error link targets radio group

### Cross-Cutting Concerns
1. Session persistence across request/response cycles
2. Accessibility (error summary, focus, labels, keyboard)
3. Pre-population after navigation back and forth
4. Entry from Screen 26 with demotion selected

---

## Success Criteria

### Tests Must
- Cover all 9 acceptance criteria (AC-1 through AC-9)
- Run successfully via `npm test`
- Use realistic session state matching structure
- Test both Housing Act options
- Verify pre-population for both options
- Test GOV.UK error pattern (summary, inline, focus)
- Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 9 ACs mapped to tests
- **Both options:** 1985 and 1996 tested separately
- **Pre-population:** First visit, revisit with each option
- **Validation:** Required selection error
- **Navigation paths:** Previous, Continue, Cancel
- **Session scenarios:** Fresh, pre-existing, modified

---

## Traceability
All tests will map back to specific acceptance criteria (AC-1 through AC-9). See test-matrix.md and traceability.md for detailed mapping.

---

*Test plan created by Nigel (Tester Agent) on 2026-01-28 for Screen 26c.*
