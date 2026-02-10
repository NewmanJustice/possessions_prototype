# Test Plan — Screen 26a: Housing Act (Suspension of right to buy)

## Scope

### In Scope
- Page rendering with Housing Act heading and guidance
- Three radio options display (1985, 1996, Other)
- Conditional reveal of "Other" act name field
- Section text input with hint text
- All validation rules (4 types of errors)
- Session persistence of Housing Act choice, other name, and section
- Pre-population on revisit
- Navigation: Previous, Continue, Cancel
- Error handling and accessibility (GOV.UK patterns)
- Route creation for `/claims/select-housing-act-suspension`

### Out of Scope
- Legal validation of chosen Act/section
- Format validation on section field content (only length checked)
- Supporting evidence collection
- Screen 26b implementation (separate story)

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handlers:** GET and POST for `/claims/select-housing-act-suspension`
- **Validation logic:** Required fields, conditional required, max length
- **Session management:** Object persistence, pre-population
- **Navigation flows:** Previous, Continue, Cancel
- **Conditional reveal:** Other option reveals text input

### 2. Session State Tests
- Housing Act value storage
- Other act name storage (conditional)
- Section storage
- Pre-population based on session values
- Selection change handling
- Clearing of Other name when switching from Other to 1985/1996

### 3. Accessibility Tests
- Error summary rendering and focus
- Error links to correct fields
- Keyboard navigation for radios and inputs
- Proper labelling of form elements
- Conditional reveal accessibility

---

## Assumptions

1. **Form field names:**
   - `suspensionHousingAct` for radio group
   - `housingActOtherName` for other act name input
   - `section` for section input
2. **Radio values:** `housing-act-1985`, `housing-act-1996`, `other`
3. **GOV.UK components:** Using `govukRadios` with conditional reveal and `govukInput`
4. **Error pattern:** Standard GOV.UK error summary and inline errors
5. **Pre-population logic:** Fields pre-populated based on session state
6. **Section hint text:** "For example, section 121A"
7. **Screen 26b placeholder:** May be needed for continue route testing
8. **Entry condition:** User must have selected "Suspension of right to buy" on Screen 26

---

## Risks and Constraints

### Risks
1. **Field name collision:** Different field names from Screen 26c
2. **Conditional validation:** Other name only validated when Other selected
3. **Session namespace:** Using `suspensionOrder` object
4. **Navigation dependency:** Screen 26b may not exist yet
5. **Clear other name:** Must clear `housingActOtherName` when switching away from Other

### Mitigations
1. Use distinct naming throughout tests and implementation
2. Test conditional validation thoroughly
3. Verify correct session object is used
4. Create placeholder route for Screen 26b if needed
5. Test clearing behaviour when changing selection

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Validation:** Four validation rules (radio required, other name conditionally required, section required, section max length)
- **Navigation:** Linear flow (no branching)

---

## Test Approach

### Happy Path Tests
1. Display page with Housing Act heading and guidance
2. Display three radio options with correct labels
3. Display section input with hint text
4. Select 1985 option with section and submit successfully
5. Select 1996 option with section and submit successfully
6. Select Other option with act name and section, submit successfully
7. Navigate using Previous/Continue/Cancel

### Edge and Boundary Cases
1. First visit (no pre-selection)
2. Revisit with 1985 pre-selected and section filled
3. Revisit with 1996 pre-selected and section filled
4. Revisit with Other pre-selected, other name and section filled
5. Change from 1985 to Other (other name becomes required)
6. Change from Other to 1985 (other name should be cleared)
7. Section at exactly 50 characters (boundary)
8. Section at 51 characters (over boundary)

### Error and Invalid Scenarios
1. Submit without any selection (radio error)
2. Select Other but leave other name empty (other name error)
3. Leave section empty (section error)
4. Section exceeds 50 characters (section length error)
5. Multiple validation errors at once
6. Error summary display and focus
7. Inline error messages
8. Error links target correct fields

### Cross-Cutting Concerns
1. Session persistence across request/response cycles
2. Accessibility (error summary, focus, labels, keyboard)
3. Pre-population after navigation back and forth
4. Conditional reveal visibility
5. Entry from Screen 26 with suspension selected

---

## Success Criteria

### Tests Must
- Cover all 13 acceptance criteria (AC-1 through AC-13)
- Run successfully via `npm test`
- Use realistic session state matching structure
- Test all three Housing Act options
- Test conditional reveal of Other field
- Verify pre-population for all scenarios
- Test GOV.UK error pattern (summary, inline, focus)
- Test all four validation rules
- Test boundary conditions (50 chars)
- Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 13 ACs mapped to tests
- **All options:** 1985, 1996, and Other tested separately
- **Pre-population:** First visit, revisit with each option
- **Validation:** All four error types tested
- **Navigation paths:** Previous, Continue, Cancel
- **Session scenarios:** Fresh, pre-existing, modified
- **Boundary conditions:** 50 char limit tested

---

## Traceability
All tests will map back to specific acceptance criteria (AC-1 through AC-13). See test-behaviour-matrix.md for detailed mapping.

---

*Test plan created by Nigel (Tester Agent) on 2026-01-28 for Screen 26a.*
