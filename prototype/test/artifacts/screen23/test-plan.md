# Test Plan — Screen 23: Money Judgement

## Scope

### In Scope
- Page rendering with money judgment question
- Yes/No radio button display
- Radio selection validation (required)
- Session persistence of boolean choice
- Pre-population on revisit
- Selection change behavior
- Navigation: Previous, Continue, Cancel
- Error handling and accessibility (GOV.UK patterns)

### Out of Scope
- Payment schedule inputs
- Money judgment amount fields
- Eligibility validation logic
- Enforcement details
- Court system integration

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handlers:** GET and POST for `/claims/money-judgement`
- **Validation logic:** Required selection validation
- **Session management:** Boolean persistence, pre-population
- **Navigation flows:** Previous, Continue, Cancel

### 2. Session State Tests
- Boolean storage (`requested: true | false`)
- Pre-population based on boolean value
- Selection change handling

### 3. Accessibility Tests
- Error summary rendering and focus
- Error link to radio group
- Keyboard navigation for radios and buttons

---

## Assumptions

1. **Question text:** Using exact wording from AC-1
2. **Radio values:** Form uses "yes"/"no" strings, converted to boolean in session
3. **British spelling:** `moneyJudgement` with 'e' throughout
4. **GOV.UK components:** Using `govukRadios` for selection
5. **Error pattern:** Standard GOV.UK error summary and inline error
6. **Pre-population logic:** Radio checked based on `requested === true` or `requested === false`
7. **Screen 24 placeholder:** Created for continue route testing
8. **Simple screen:** No conditional reveals or complex logic

---

## Risks and Constraints

### Risks
1. **Spelling confusion:** `moneyJudgement` (British) vs `moneyJudgment` (American)
2. **Boolean mapping:** Ensuring "yes"/"no" strings correctly map to true/false
3. **Pre-population edge case:** Handling when `requested` is undefined (first visit)

### Mitigations
1. Use British spelling consistently throughout (matches route)
2. Test both string→boolean and boolean→string conversions explicitly
3. Test first visit (no pre-selection) separately from revisit scenarios

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Validation:** Single validation rule (required selection)
- **Navigation:** Linear flow (no branching based on selection)

---

## Test Approach

### Happy Path Tests
1. Display page with Yes/No radios
2. Select Yes and submit successfully
3. Select No and submit successfully
4. Navigate using Previous/Continue/Cancel

### Edge and Boundary Cases
1. First visit (no pre-selection)
2. Revisit with Yes pre-selected
3. Revisit with No pre-selected
4. Change from Yes to No
5. Change from No to Yes

### Error and Invalid Scenarios
1. Submit without selection (validation error)
2. Error summary display and focus
3. Selection preserved after validation error (if applicable)

### Cross-Cutting Concerns
1. Session persistence across request/response cycles
2. Accessibility (error summary, focus, radio labels)
3. Pre-population after navigation back and forth

---

## Success Criteria

### Tests Must
- ✅ Cover all 7 acceptance criteria (AC-1 through AC-7)
- ✅ Run successfully via `npm test`
- ✅ Use realistic session state matching structure
- ✅ Test boolean storage and retrieval
- ✅ Verify pre-population for both Yes and No
- ✅ Test selection change scenarios
- ✅ Test GOV.UK error pattern (summary, inline, focus)
- ✅ Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 7 ACs mapped to tests
- **Both selections:** Yes and No tested separately
- **Pre-population:** First visit and revisit scenarios
- **Validation:** Required selection with error handling
- **Navigation paths:** Previous, Continue, Cancel
- **Session scenarios:** Fresh, pre-existing, modified

---

## Traceability
All tests will map back to specific acceptance criteria (AC-1 through AC-7). See test-matrix.md and traceability.md for detailed mapping.

---

*Test plan created by Nigel (Tester Agent) on 2026-01-27 for Screen 23.*
