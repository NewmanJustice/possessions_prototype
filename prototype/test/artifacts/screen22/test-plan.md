# Test Plan — Screen 22: Details of Rent Arrears

## Scope

### In Scope
- Page rendering with rent statement guidance
- Document upload section display (UI only, not actual upload)
- Document metadata storage structure
- Total rent arrears currency input and validation
- Third-party payments Yes/No radio selection
- Conditional reveal of payment sources checkboxes
- Payment sources selection (5 checkboxes)
- "Other" payment source conditional reveal (text input)
- Session persistence of all rent arrears data
- Pre-population of all fields on revisit
- Navigation: Previous, Continue, Cancel
- Error handling and accessibility (GOV.UK patterns)
- Currency formatting and validation (£0.01 to £1,000,000)

### Out of Scope
- Actual file upload mechanism (multipart form, file storage)
- File type/size validation
- Document preview or download
- Rent arrears calculation logic
- Third-party payment amount tracking
- Integration with payment systems
- Real-time validation during typing

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handlers:** GET and POST for `/claims/details-of-rent-arrears`
- **Validation logic:** Total arrears, third-party selection, payment sources, other details
- **Session management:** Data persistence, pre-population
- **Conditional logic:** Payment sources reveal, other details reveal
- **Navigation flows:** Previous, Continue, Cancel

### 2. Session State Tests
- Document metadata storage
- Total arrears persistence
- Third-party payments flag
- Payment sources object structure
- Other details conditional storage
- Pre-population on revisit

### 3. Accessibility Tests
- Error summary rendering and focus
- Error links to inputs/checkboxes/radios
- Conditional reveal announcements
- Keyboard navigation for all controls

---

## Assumptions

1. **File upload UI:** "Add new" button displayed but not functionally tested
2. **Document metadata:** Simple object structure `{ id, name, uploadedAt }`
3. **Currency format:** £ prefix visual only, stored as number
4. **Validation timing:** Server-side validation on POST (client-side not tested)
5. **Payment sources:** All 5 initialized to `false`, selected set to `true`
6. **Other details:** Set to `null` when Other not selected
7. **GOV.UK components:** Using standard govukInput, govukRadios, govukCheckboxes
8. **Error patterns:** Standard GOV.UK error summary and inline errors
9. **Pre-population logic:** All form controls restore from session state
10. **Screen 23 placeholder:** Created for continue route testing

---

## Risks and Constraints

### Risks
1. **Complex conditional logic:** Two levels of conditional reveals (third-party → sources, other → details)
2. **Multiple validation scenarios:** 4 different validation rules with different error states
3. **Currency validation edge cases:** Decimals, formatting, large numbers
4. **File upload placeholder:** UI shown but not functional (could confuse implementation)
5. **Session structure complexity:** Nested objects with conditional properties

### Mitigations
1. Test conditional reveals explicitly with multiple scenarios
2. Test each validation rule independently and in combination
3. Reuse currency validation patterns from Screen 20
4. Clearly document upload is out of scope in tests and guide
5. Test session structure thoroughly with various input combinations

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Currency validation:** Same as Screen 20 (reuse patterns)
- **Conditional reveals:** GOV.UK Frontend JavaScript (tested server-side only)
- **Navigation:** Linear flow (no branching based on content)

---

## Test Approach

### Happy Path Tests
1. Display page with all sections (guidance, upload, total arrears, third-party)
2. Submit with total arrears and No to third-party payments
3. Submit with total arrears, Yes to third-party, and selected payment sources
4. Submit with "Other" payment source and details
5. Navigate using Previous/Continue/Cancel

### Edge and Boundary Cases
1. Minimum arrears (£0.01)
2. Maximum arrears (£1,000,000)
3. Arrears with 2 decimal places
4. All 5 payment sources selected
5. Only "Other" payment source selected
6. Deselect previously selected payment sources
7. Pre-population with all fields filled

### Error and Invalid Scenarios
1. Submit without total arrears (validation error)
2. Submit with invalid arrears (0, negative, too many decimals)
3. Submit without third-party selection (validation error)
4. Submit with Yes but no payment sources (validation error)
5. Submit with Other selected but no details (validation error)
6. Multiple validation errors simultaneously
7. Error preservation after validation failure

### Cross-Cutting Concerns
1. Session persistence across request/response cycles
2. Accessibility (error summary, focus, conditional reveals)
3. Pre-population after navigation back and forth
4. Conditional logic state management

---

## Success Criteria

### Tests Must
- ✅ Cover all 17 acceptance criteria (AC-1 through AC-17)
- ✅ Run successfully via `npm test`
- ✅ Use realistic session state matching structure
- ✅ Test both levels of conditional reveals
- ✅ Validate currency input thoroughly (like Screen 20)
- ✅ Verify all 5 payment sources individually and combined
- ✅ Test "Other" conditional reveal explicitly
- ✅ Confirm pre-population for all field types
- ✅ Test GOV.UK error patterns (summary, inline, focus)
- ✅ Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 17 ACs mapped to tests
- **Validation rules:** 4 distinct validations (arrears, third-party, sources, other)
- **Conditional reveals:** 2 levels tested explicitly
- **Payment sources:** All 5 tested individually and in combinations
- **Currency values:** Min, max, decimals, invalid formats
- **Navigation paths:** Previous, Continue, Cancel
- **Session scenarios:** Fresh, pre-existing, modified

---

## Traceability
All tests will map back to specific acceptance criteria (AC-1 through AC-17). See test-matrix.md and traceability.md for detailed mapping.

---

*Test plan created by Nigel (Tester Agent) on 2026-01-27 for Screen 22.*
