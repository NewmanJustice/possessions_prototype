# Test Plan — Screen 24: Claimant's Circumstances

## Scope

### In Scope
- Page rendering with claimant circumstances question
- Dynamic claimant name in question text
- Yes/No radio button display
- Radio selection validation (required)
- Conditional textarea reveal when Yes selected
- Character limit validation (950 characters)
- Details textarea optional when revealed
- Session persistence of choice and details
- Pre-population on revisit (radio and textarea)
- Selection change behavior (Yes↔No)
- Navigation: Previous, Continue, Cancel
- Error handling and accessibility (GOV.UK patterns)

### Out of Scope
- Document/evidence uploads
- Validation of content relevance
- Multiple claimant handling
- Client-side character counter JavaScript
- Word count limits

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handlers:** GET and POST for `/claims/claimants-circumstances`
- **Validation logic:** Required selection, character limit
- **Session management:** Boolean and string persistence, pre-population
- **Navigation flows:** Previous, Continue, Cancel
- **Conditional reveal:** Textarea inclusion in response

### 2. Session State Tests
- Boolean storage (`provided: true | false`)
- Details storage (`details: string | null`)
- Pre-population based on session values
- Selection and details change handling
- Details clearing when changing Yes to No

### 3. Accessibility Tests
- Error summary rendering and focus
- Error link to radio group or textarea
- Keyboard navigation for radios, textarea, and buttons
- Proper labelling of form elements

---

## Assumptions

1. **Claimant name:** Read from `session.claim.claimantName` with fallback
2. **Radio values:** Form uses "yes"/"no" strings, converted to boolean in session
3. **Form fields:** `provideCircumstances` and `circumstancesDetails`
4. **GOV.UK components:** Using `govukRadios` with conditional reveal, `govukTextarea`
5. **Error pattern:** Standard GOV.UK error summary and inline error
6. **Pre-population logic:** Radio checked and textarea filled based on session state
7. **Screen 25 placeholder:** Exists for continue route testing
8. **Character validation:** Server-side, triggered when > 950 characters
9. **Optional details:** Empty textarea valid when Yes selected

---

## Risks and Constraints

### Risks
1. **Dynamic claimant name:** Ensuring name displays correctly with fallback
2. **Conditional reveal state:** Radio and textarea state must stay in sync
3. **Details clearing:** Edge case when user toggles Yes↔No multiple times
4. **Character limit boundary:** Exactly 950 vs 951 characters
5. **Whitespace handling:** Details with only whitespace should be accepted

### Mitigations
1. Test with and without claimant name in session
2. Test conditional reveal in both GET (revisit) and POST (error) scenarios
3. Test multiple selection changes and verify final state
4. Test exact boundary (950) and over boundary (951) explicitly
5. Test whitespace-only input explicitly

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Validation:** Two validation rules (required selection, character limit)
- **Navigation:** Linear flow (no branching based on selection)

---

## Test Approach

### Happy Path Tests
1. Display page with Yes/No radios and guidance
2. Display dynamic claimant name in question
3. Select Yes and submit successfully (with or without details)
4. Select No and submit successfully
5. Navigate using Previous/Continue/Cancel

### Edge and Boundary Cases
1. First visit (no pre-selection)
2. Revisit with Yes pre-selected and details
3. Revisit with No pre-selected
4. Change from Yes to No (details cleared)
5. Change from No to Yes
6. Exactly 950 characters (valid)
7. 951 characters (invalid)
8. Empty details with Yes (valid)
9. Whitespace-only details (valid)

### Error and Invalid Scenarios
1. Submit without selection (validation error)
2. Submit with details exceeding 950 characters
3. Error summary display and focus
4. Inline error messages
5. Input preserved after validation error

### Cross-Cutting Concerns
1. Session persistence across request/response cycles
2. Accessibility (error summary, focus, labels, keyboard)
3. Pre-population after navigation back and forth
4. GOV.UK conditional reveal pattern

---

## Success Criteria

### Tests Must
- Cover all 11 acceptance criteria (AC-1 through AC-11)
- Run successfully via `npm test`
- Use realistic session state matching structure
- Test boolean and string storage and retrieval
- Verify pre-population for Yes, No, and details
- Test selection change scenarios including details clearing
- Test character limit boundary conditions
- Test GOV.UK error pattern (summary, inline, focus)
- Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 11 ACs mapped to tests
- **Both selections:** Yes and No tested separately
- **Pre-population:** First visit, revisit with Yes, revisit with No
- **Validation:** Required selection and character limit
- **Navigation paths:** Previous, Continue, Cancel
- **Session scenarios:** Fresh, pre-existing, modified
- **Boundary conditions:** 950 characters, 951 characters
- **Conditional reveal:** Textarea shown/hidden appropriately

---

## Traceability
All tests will map back to specific acceptance criteria (AC-1 through AC-11). See test-matrix.md and traceability.md for detailed mapping.

---

*Test plan created by Nigel (Tester Agent) on 2026-01-28 for Screen 24.*
