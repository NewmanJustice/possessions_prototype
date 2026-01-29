# Test Plan — Screen 26d: Statement of express terms

## Scope

### In Scope
- Page rendering with "Statement of express terms" heading
- Question text display and radio options (Yes, No)
- Conditional reveal of details textarea on Yes selection
- Conditional hide of details textarea on No selection
- Radio selection validation (required)
- Details text entry (optional when Yes selected)
- Session persistence of service confirmation and optional details
- Pre-population on revisit (radio selection, textarea visibility, details text)
- Navigation: Previous (to Screen 26c), Continue (to Screen 28), Cancel (to case-list)
- Error handling and accessibility (GOV.UK patterns)
- Route creation for `GET /claims/statement-of-express-terms` and `POST /claims/statement-of-express-terms`

### Out of Scope
- Legal validation of statement content
- Collection of actual statement documents or files
- Verification of statutory compliance
- Service evidence upload or storage
- Character limit enforcement (assumed reasonable, e.g., 2000 chars)
- Details text format validation (assumed free-form service method description)
- Screen 28 implementation (separate story; placeholder route acceptable)

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handlers:** GET and POST for `/claims/statement-of-express-terms`
- **Validation logic:** Required selection (Yes/No), optional details
- **Session management:** String persistence, pre-population, conditional visibility logic
- **Navigation flows:** Previous, Continue, Cancel with session preservation
- **Conditional reveal/hide:** Textarea visibility based on radio selection

### 2. Session State Tests
- Service confirmation value storage (`statementOfExpressTerms: 'yes' | 'no' | null`)
- Optional details text storage (`statementOfExpressTermsDetails: text | null`)
- Pre-population based on session values
- Details persistence even when No is selected
- Selection change handling with details preservation

### 3. Form Interaction Tests
- Conditional textarea display/hide on radio selection change
- Empty textarea display on first visit with Yes pre-selected
- Textarea content retention when toggling Yes→No→Yes
- Textarea remains empty on revisit if previously selected Yes with no details

### 4. Accessibility Tests
- Error summary rendering and focus
- Error link targets radio group
- Keyboard navigation for radios and buttons
- Proper labelling of radio options and textarea
- Focus management on validation error

---

## Assumptions

1. **Form field names:** `expressTermsServed` (radio group), `expressTermsDetails` (textarea)
2. **Radio values:** 'yes' and 'no' (lowercase strings)
3. **GOV.UK components:** Using `govukRadios` and `govukTextarea` with standard pattern
4. **Error pattern:** Standard GOV.UK error summary and inline error on radio group
5. **Pre-population logic:** Radio checked and textarea visibility based on session state
6. **Details character limit:** Reasonable limit (e.g., 2000 characters)
7. **Textarea attributes:** Multi-line textarea (rows=5 or similar)
8. **Entry condition:** User must have selected Housing Act on Screen 26c (context preserved in session)
9. **Details label:** "Provide details of how you served the statement" (exact text from design)
10. **Session namespace:** Data stored in `session.claim.demotionOrder` object
11. **Screen 28 status:** May be placeholder route for navigation testing
12. **Details conditional:** Textarea only visible when Yes is selected; visibility changes on radio click

---

## Risks and Constraints

### Risks
1. **Conditional logic:** Textarea visibility must toggle correctly and preserve text across toggles
2. **Session namespace:** Ensure data stored in `demotionOrder` (not `suspensionOrder` or other)
3. **Navigation dependency:** Screen 28 may not exist yet; placeholder may be needed
4. **Details retention:** Text must survive Yes→No→Yes toggle without loss
5. **Radio value consistency:** Values 'yes'/'no' must match across form, session, and tests

### Mitigations
1. Test conditional reveal/hide explicitly on radio selection change
2. Test session object structure and namespace in detail
3. Create placeholder `/claims/claiming-costs` route if Screen 28 not ready
4. Test details text retention via multi-step session manipulation
5. Define exact radio values in test setup and verify in session

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Validation:** Single validation rule (required radio selection)
- **Navigation:** Linear flow (no branching, but conditional display)
- **Pre-existing context:** Screen 26c must have set `demotionOrder.housingAct` before this screen

---

## Test Approach

### Happy Path Tests
1. Display page with heading, question, and two radio options
2. Select Yes option → details textarea is revealed (empty)
3. Enter text in details field and submit successfully
4. Session stores 'yes' and entered details text
5. Navigate Continue to Screen 28
6. Select No option → details textarea is hidden
7. Submit without details successfully
8. Session stores 'no' and null for details
9. Navigate Continue to Screen 28

### Conditional Display Tests
1. Select Yes → textarea appears
2. Select No → textarea disappears
3. Select Yes → textarea appears (empty if first entry, or with retained text if previously entered)
4. Toggle Yes→No→Yes and verify text retention
5. Reload page after Yes+details → textarea shown and pre-filled

### Edge and Boundary Cases
1. First visit (no pre-selection, no textarea visible)
2. Revisit after Yes with details → radio pre-selected, textarea visible and pre-filled
3. Revisit after Yes without details → radio pre-selected, textarea visible and empty
4. Revisit after No → radio pre-selected, textarea hidden
5. Enter very long details (edge of assumed limit, e.g. 1999/2000 chars)
6. Enter details with special characters, line breaks, HTML-like content
7. Select Yes, enter details, navigate Previous, return → all preserved
8. Select No, navigate Previous to Screen 26c, change Housing Act, return → data still preserved

### Error and Invalid Scenarios
1. Submit without selecting Yes or No (validation error)
2. Error summary display and focus on error
3. Inline error message on radio group
4. Error link targets radio group
5. After error, selecting Yes/No and submitting successfully resolves error

### Cross-Cutting Concerns
1. Session persistence across GET/POST/GET cycles
2. Accessibility: error summary, focus, labels, keyboard navigation
3. Pre-population after navigation (Previous/Continue and return to this page)
4. Cancel navigation: session draft preserved, not cleared
5. Housing Act context preserved from Screen 26c throughout this screen
6. Session object structure: `demotionOrder` contains both `housingAct` and express terms fields

---

## Success Criteria

### Tests Must
- Cover all 11 acceptance criteria (AC-1 through AC-11)
- Run successfully via `npm test`
- Use realistic session state matching `demotionOrder` structure
- Test both Yes and No options
- Verify pre-population for both options with and without details
- Verify conditional textarea display/hide on selection change
- Test GOV.UK error pattern (summary, inline, focus)
- Test details text retention across Yes→No→Yes toggles
- Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 11 ACs mapped to tests
- **Both options:** Yes and No tested separately with various detail entry states
- **Pre-population:** First visit, revisit with Yes+details, revisit with Yes+empty, revisit with No
- **Validation:** Required selection error, details optional confirmation
- **Conditional reveal:** Display on Yes, hide on No, retention across toggles
- **Navigation paths:** Previous (to 26c), Continue (to 28), Cancel (to case-list)
- **Session scenarios:** Fresh, pre-existing, modified, navigation variations
- **Special cases:** Empty details, max-length details, special characters, focus management

---

## Traceability

All tests will map back to specific acceptance criteria (AC-1 through AC-11):

| AC | Description | Test Coverage |
|----|-------------|---|
| AC-1 | Page heading and question display | T-1.1, T-1.2 |
| AC-2 | Reveal details field on Yes | T-2.1, T-2.2 |
| AC-3 | Hide details field on No | T-3.1, T-3.2 |
| AC-4 | Selection required validation | T-4.1, T-4.2, T-4.3 |
| AC-5 | Details optional when Yes selected | T-5.1, T-5.2 |
| AC-6 | Persist service confirmation and details | T-6.1, T-6.2, T-6.3 |
| AC-7 | Pre-populate on revisit | T-7.1, T-7.2, T-7.3, T-7.4 |
| AC-8 | Previous navigation | T-8.1, T-8.2 |
| AC-9 | Continue navigation | T-9.1, T-9.2 |
| AC-10 | Cancel behaviour | T-10.1, T-10.2 |
| AC-11 | Accessibility compliance | T-11.1, T-11.2, T-11.3, T-11.4 |

See test cases document for detailed test-to-AC mapping.

---

## Open Questions

1. **Field naming convention:** Confirm `expressTermsServed` and `expressTermsDetails` vs. alternative names
2. **Details character limit:** Confirm upper boundary for details textarea input (assumed 2000)
3. **Textarea attributes:** Confirm rows count and other display properties
4. **Error message wording:** Confirm exact error text (assumed per AC-4: "Select yes if you have served the statement of express terms")
5. **Screen 28 readiness:** Confirm if `/claims/claiming-costs` is implemented or needs placeholder
6. **Housing Act context:** Confirm Screen 26c data is available in session before arriving at this screen

---

*Test plan created by Nigel (Tester Agent) on 2026-01-29 for Screen 26d.*
