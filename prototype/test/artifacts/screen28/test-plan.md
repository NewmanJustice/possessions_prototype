# Test Plan — Screen 28: Claiming Costs

## Scope

### In Scope
- Page rendering with case number, heading, caption, and question
- Two radio button options (Yes, No) display
- Hint text display about cost schedule at hearing stage
- Radio selection validation (required)
- Session persistence of choice ('yes' or 'no')
- Pre-population on revisit (radio pre-selected)
- Selection change behavior (Yes↔No)
- Navigation: Previous, Continue, Cancel
- Error handling and accessibility (GOV.UK patterns)
- Case number display

### Out of Scope
- Cost amount validation
- Detailed cost schedule capture
- Cost recovery eligibility assessment
- Judge review or cost determination logic
- Multiple claimants or defendants handling
- Next screen implementation (placeholder only)

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handlers:** GET and POST for `/claims/claiming-costs`
- **Validation logic:** Required selection validation
- **Session management:** String persistence ('yes', 'no'), pre-population
- **Navigation flows:** Previous, Continue, Cancel
- **Page content:** Heading, caption, case number, question, hint, radios

### 2. Session State Tests
- String storage (`claimingCosts: 'yes' | 'no' | null`)
- Pre-population based on session values
- Selection change handling
- Initial/null state handling

### 3. Accessibility Tests
- Error summary rendering and focus
- Error link to radio group
- Keyboard navigation for radios and buttons
- Proper labelling of form elements

---

## Assumptions

1. **Storage format:** String values 'yes' and 'no' (lowercase)
2. **Form field name:** `claimingCosts` for radio buttons
3. **GOV.UK components:** Using `govukRadios` with two options
4. **Error pattern:** Standard GOV.UK error summary and inline error
5. **Pre-population logic:** Radio checked based on session state
6. **Case number display:** Present and readable (assumed available in session)
7. **Next screen placeholder:** Placeholder route created to avoid blocking implementation
8. **Previous route:** Fixed to `/claims/statement-of-express-terms`
9. **Cancel route:** Fixed to `/case-list`
10. **Null initialization:** `claimingCosts` may be null on first visit

---

## Risks and Constraints

### Risks
1. **Next screen TBD:** Route destination unknown; placeholder will block navigation testing until confirmed
2. **Case number availability:** Assumes case number exists in session; test must verify presence
3. **String format consistency:** 'yes'/'no' lowercase must be enforced; mixed case could break logic
4. **Null handling:** Edge case where session.claim.claimingCosts is undefined vs null
5. **Focus management:** Error summary focus must work reliably across browsers

### Mitigations
1. Create placeholder route for next screen; test documents navigation to TBD clearly
2. Test with explicit case number in session; verify error if missing
3. Enforce lowercase in validation tests
4. Test both null and undefined states explicitly
5. Test focus management in accessibility test

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Validation:** One validation rule (required selection)
- **Navigation:** Linear flow with fixed Previous/Cancel routes; Continue route TBD
- **Next screen:** Cannot fully test Continue flow until next screen implemented

---

## Test Approach

### Happy Path Tests
1. Display page with Yes/No radios, question, hint, case number, heading, caption
2. Select Yes and submit successfully
3. Select No and submit successfully
4. Navigate using Previous (back to Screen 26d)
5. Navigate using Continue (to TBD next screen)
6. Navigate using Cancel (to case-list)

### Edge and Boundary Cases
1. First visit (no pre-selection, claimingCosts is null)
2. Revisit with Yes pre-selected
3. Revisit with No pre-selected
4. Change from Yes to No
5. Change from No to Yes
6. Case number present and displayed correctly
7. Form field name correct (claimingCosts)

### Error and Invalid Scenarios
1. Submit without selection (validation error)
2. Error summary display and focus
3. Inline error message: "Select yes if you want to ask for your costs back"
4. Selection preserved after validation error (radio still accessible to change)

### Cross-Cutting Concerns
1. Session persistence across request/response cycles
2. Accessibility (error summary, focus, labels, keyboard)
3. Pre-population after navigation back and forth
4. GOV.UK radio component pattern
5. Case number format and display

---

## Success Criteria

### Tests Must
- Cover all 9 acceptance criteria (AC-1 through AC-9)
- Run successfully via `npm test`
- Use realistic session state matching structure
- Test string storage ('yes', 'no')
- Verify pre-population for Yes and No
- Test selection change scenarios
- Test GOV.UK error pattern (summary, inline, focus)
- Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 9 ACs mapped to tests
- **Both selections:** Yes and No tested separately
- **Pre-population:** First visit, revisit with Yes, revisit with No
- **Validation:** Required selection error
- **Navigation paths:** Previous, Continue (to TBD), Cancel
- **Session scenarios:** Fresh, pre-existing, modified
- **Page content:** Heading, caption, case number, question, hint all verified
- **Error handling:** Validation error display and focus

---

## Traceability
All tests will map back to specific acceptance criteria (AC-1 through AC-9). See test-matrix.md and traceability.md for detailed mapping.

---

*Test plan created by Nigel (Tester Agent) on 2026-01-29 for Screen 28.*
