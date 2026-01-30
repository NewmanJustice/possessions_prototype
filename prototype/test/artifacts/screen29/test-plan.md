# Test Plan — Screen 29: Additional Reasons for Possession

## Scope

### In Scope
- Page rendering with heading, caption, and question
- Two radio button options (Yes, No) display
- Conditional textarea reveal when Yes selected
- Textarea label and hint text display
- Textarea character limit (6400) enforcement
- Character counter display (optional but tested)
- Radio selection validation (required)
- Textarea content submission when optional
- Session persistence of selection and text
- Pre-population on revisit (radio pre-selected, textarea pre-filled)
- Selection change behavior (Yes↔No) with text retention
- Navigation: Previous, Continue, Cancel
- Error handling and accessibility (GOV.UK patterns)
- Text persistence when switching between Yes/No

### Out of Scope
- Content validation (legal relevance, accuracy, completeness)
- Automatic ground determination
- Real-time legal guidance or suggestions
- Document or evidence uploads
- Judge review logic
- Cost implications assessment
- Multiple claimants/defendants handling
- Next screen implementation (placeholder only)

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handlers:** GET and POST for `/claims/additional-reasons-for-possession`
- **Validation logic:** Required selection validation
- **Session management:** Object persistence (`hasAdditionalReasons`, `additionalReasonsText`), pre-population
- **Navigation flows:** Previous, Continue, Cancel
- **Page content:** Heading, caption, question, radios, hint, textarea
- **Conditional rendering:** Textarea reveal/hide based on selection
- **Character limit:** Maxlength enforcement and character counter

### 2. Session State Tests
- Object storage (`additionalReasons: { hasAdditionalReasons, additionalReasonsText }`)
- Yes selection with no text: `{ hasAdditionalReasons: 'yes', additionalReasonsText: null }`
- Yes selection with text: `{ hasAdditionalReasons: 'yes', additionalReasonsText: 'text...' }`
- No selection: `{ hasAdditionalReasons: 'no', additionalReasonsText: null }`
- Initial/null state: `{ hasAdditionalReasons: null, additionalReasonsText: null }`
- Text retention when switching Yes↔No↔Yes

### 3. Accessibility Tests
- Error summary rendering and focus
- Error link to radio group
- Keyboard navigation for radios, textarea, and buttons
- Proper labelling of form elements (radio and textarea)
- Character counter aria-live region for screen readers (if implemented)

---

## Assumptions

1. **Storage format:** String values 'yes' and 'no' (lowercase); null on first visit
2. **Form field names:** `hasAdditionalReasons` for radio, `additionalReasonsText` for textarea
3. **GOV.UK components:** Using `govukRadios` with two options, `govukTextarea` for text input
4. **Error pattern:** Standard GOV.UK error summary and inline error
5. **Pre-population logic:** Radio checked and textarea populated based on session state
6. **Character limit:** Enforced via maxlength attribute on frontend and validated on backend
7. **Character counter:** Optional display (assumed as nice-to-have); tests verify it if present
8. **Textarea optional:** No "required" indicator shown; submission allowed even if empty
9. **Text persistence:** Text retained in session when user toggles between Yes/No
10. **Previous route:** Fixed to `/claims/claiming-costs`
11. **Cancel route:** Fixed to `/case-list`
12. **Next screen placeholder:** Placeholder route created to avoid blocking implementation
13. **Null initialization:** `additionalReasons` may be null/undefined on first visit
14. **Session object structure:** Nested under `session.claim.additionalReasons`

---

## Risks and Constraints

### Risks
1. **Next screen TBD:** Route destination unknown; placeholder will block navigation testing until confirmed
2. **Conditional rendering:** Textarea reveal/hide must work reliably; JavaScript required (no JavaScript fallback)
3. **Character limit consistency:** Frontend maxlength and backend validation must align at 6400
4. **Text retention logic:** Text must persist in session when user toggles Yes/No; logic complexity
5. **Session state structure:** Object format must match exactly; nested properties must be initialized
6. **Character counter logic:** If implemented, must update accurately as user types
7. **Focus management:** Error summary focus must work reliably; textarea focus when revealed

### Mitigations
1. Create placeholder route for next screen; test documents navigation to TBD clearly
2. Test textarea reveal in isolation; verify DOM state change without page reload
3. Test character limit enforcement on both frontend and backend
4. Explicit test for text retention when toggling selections
5. Verify session object structure and null initialization in every scenario
6. Test character counter updates if implemented; skip if not present
7. Test focus management in accessibility test

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Validation:** One validation rule (required selection); textarea content optional
- **Navigation:** Linear flow with fixed Previous/Cancel routes; Continue route TBD
- **Next screen:** Cannot fully test Continue flow until next screen implemented
- **JavaScript:** Textarea conditional reveal requires JavaScript; tests assume client-side logic

---

## Test Approach

### Happy Path Tests
1. Display page with Yes/No radios, question, caption, heading (no textarea initially)
2. Select Yes and observe textarea reveal with label, hint, and no "required" indicator
3. Select Yes, enter text, and submit successfully
4. Select Yes, leave textarea empty, and submit successfully
5. Select No and observe textarea hide
6. Navigate using Previous (back to Screen 28, selection preserved)
7. Navigate using Continue (to TBD next screen with Yes selection and text)
8. Navigate using Cancel (to case-list)

### Edge and Boundary Cases
1. First visit (no pre-selection, `additionalReasons` is null)
2. Revisit with Yes pre-selected and no text
3. Revisit with Yes pre-selected and text pre-filled
4. Revisit with No pre-selected
5. Change from Yes to No (textarea hidden, text retained in session)
6. Change from No to Yes (textarea revealed with previous text pre-filled)
7. Enter exactly 6400 characters (at limit)
8. Attempt to enter 6401 characters (limit enforced, text not entered)
9. Toggle selection multiple times (Yes → No → Yes) with text changes

### Error and Invalid Scenarios
1. Submit without selection (validation error)
2. Error summary display and focus
3. Inline error message: "Select yes if you would like to provide additional reasons for possession"
4. Selection preserved after validation error (radio accessible to change)
5. Textarea visible/hidden correctly after validation error

### Cross-Cutting Concerns
1. Session persistence across request/response cycles
2. Accessibility (error summary, focus, labels, keyboard, textarea labelling)
3. Pre-population after navigation back and forth
4. GOV.UK radio and textarea component patterns
5. Character limit consistency (frontend and backend)
6. Text retention when toggling selections
7. Null and undefined state handling
8. Object structure in session.claim.additionalReasons

---

## Success Criteria

### Tests Must
- Cover all 12 acceptance criteria (AC-1 through AC-12)
- Run successfully via `npm test`
- Use realistic session state matching structure
- Test string storage ('yes', 'no') and null initialization
- Verify pre-population for Yes and No
- Test selection change scenarios with text retention
- Test GOV.UK error pattern (summary, inline, focus)
- Test character limit enforcement (6400 characters)
- Verify textarea conditional reveal/hide
- Test textarea optional nature (no "required" indicator)
- Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 12 ACs mapped to tests
- **Both selections:** Yes and No tested separately
- **Pre-population:** First visit, revisit with Yes (no text), revisit with Yes (with text), revisit with No
- **Validation:** Required selection error
- **Navigation paths:** Previous, Continue (to TBD), Cancel
- **Session scenarios:** Fresh, pre-existing, modified, text retention
- **Page content:** Heading, caption, question, radios, textarea label, hint all verified
- **Error handling:** Validation error display, focus, message accuracy
- **Character limits:** At limit (6400), over limit (6401), empty, various text lengths
- **Conditional rendering:** Textarea reveal on Yes, hide on No, toggle scenarios
- **Textarea optional:** Submit with Yes and empty textarea succeeds

---

## Traceability
All tests will map back to specific acceptance criteria (AC-1 through AC-12). See test-matrix.md and traceability.md for detailed mapping.

---

*Test plan created by Nigel (Tester Agent) on 2026-01-29 for Screen 29.*
