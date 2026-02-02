# Test Plan — Screen 26b: Reasons for requesting a suspension order

## Scope

### In Scope
- Page rendering with heading and guidance
- Textarea display with correct label
- Optional field behaviour (empty submission accepted)
- Character limit validation (950 chars max)
- Session persistence of reasons (string or null)
- Pre-population on revisit
- Navigation: Previous, Continue, Cancel
- Error handling and accessibility (GOV.UK patterns)
- Route creation for `/claims/reasons-for-suspension`

### Out of Scope
- Legal validation of reasons content
- Spell checking or content quality validation
- Supporting evidence collection
- Screen 26a implementation details

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handlers:** GET and POST for `/claims/reasons-for-suspension`
- **Validation logic:** Character limit enforcement (optional field)
- **Session management:** Reasons persistence, pre-population
- **Navigation flows:** Previous, Continue, Cancel

### 2. Session State Tests
- Reasons value storage (string)
- Null storage for empty input
- Pre-population based on session values
- Value update handling
- Integration with existing suspensionOrder object

### 3. Accessibility Tests
- Error summary rendering and focus
- Error links to correct textarea
- Keyboard navigation
- Proper labelling of textarea
- Character count accessibility (if implemented)

---

## Assumptions

1. **Form field name:** `reasons` for textarea
2. **Textarea ID:** `reasons` (same as name)
3. **GOV.UK components:** Using `govukCharacterCount` or `govukTextarea`
4. **Error pattern:** Standard GOV.UK error summary and inline errors
5. **Pre-population logic:** Textarea pre-populated based on session state
6. **Empty handling:** Empty string stored as `null`
7. **Entry condition:** User may arrive from suspension path (user story indicates direct from Screen 26)
8. **Existing session object:** `suspensionOrder` object may already exist with Housing Act data

---

## Risks and Constraints

### Risks
1. **Session namespace:** Must not overwrite existing `suspensionOrder` data from Screen 26a
2. **Navigation mismatch:** User story says Previous → Screen 26, but flow may include Screen 26a
3. **Character count:** Boundary testing at 950 chars
4. **Empty vs null:** Ensure empty string is converted to null

### Mitigations
1. Use object spread/merge when saving to session
2. Test per user story but flag navigation for review
3. Test boundary conditions thoroughly (949, 950, 951 chars)
4. Explicit tests for empty string → null conversion

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Validation:** Single validation rule (max length)
- **Navigation:** Linear flow (no branching)

---

## Test Approach

### Happy Path Tests
1. Display page with heading and guidance
2. Display textarea with correct label
3. Submit empty form successfully (optional field)
4. Submit with reasons text successfully
5. Navigate using Previous/Continue/Cancel

### Edge and Boundary Cases
1. First visit (textarea empty)
2. Revisit with pre-populated reasons
3. Reasons at exactly 950 characters (boundary - accepted)
4. Reasons at 951 characters (over boundary - rejected)
5. Very short reasons (1 character)
6. Reasons with special characters
7. Clear previously entered reasons

### Error and Invalid Scenarios
1. Submit with 951+ characters (length error)
2. Error summary display and focus
3. Inline error messages
4. Error links target textarea
5. Preserve entered text on validation failure

### Cross-Cutting Concerns
1. Session persistence across request/response cycles
2. Accessibility (error summary, focus, labels, keyboard)
3. Pre-population after navigation back and forth
4. Integration with existing suspensionOrder session data

---

## Success Criteria

### Tests Must
- Cover all 10 acceptance criteria (AC-1 through AC-10)
- Run successfully via `npm test`
- Use realistic session state matching structure
- Test optional field behaviour
- Verify pre-population
- Test GOV.UK error pattern (summary, inline, focus)
- Test character limit validation
- Test boundary conditions (950 chars)
- Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 10 ACs mapped to tests
- **Optional field:** Empty submission tested
- **Character limit:** Boundary and over-boundary tested
- **Pre-population:** First visit, revisit scenarios
- **Navigation paths:** Previous, Continue, Cancel
- **Session scenarios:** Fresh, pre-existing, modified

---

## Traceability
All tests will map back to specific acceptance criteria (AC-1 through AC-10). See test-behaviour-matrix.md for detailed mapping.

---

*Test plan created by Nigel (Tester Agent) on 2026-02-02 for Screen 26b.*
