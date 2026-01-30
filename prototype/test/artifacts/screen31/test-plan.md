# Test Plan — Screen 31: Underlessee or Mortgagee Details

## Scope

### In Scope
- Page rendering with heading, caption, case number, and three sections
- Section 1: Name question with Yes/No radios and conditional name input
- Section 2: Address question with Yes/No radios, postcode lookup, and manual entry
- Section 3: Additional parties question with Yes/No radios and Add new panel
- Postcode lookup functionality (stubbed/mocked)
- Manual address entry with required/optional field marking
- All five validation scenarios (ACs 16-20)
- Session persistence as array structure
- Pre-population on revisit
- Add new button functionality (save and reset)
- Navigation: Previous, Continue, Cancel
- Error handling and accessibility (GOV.UK patterns)
- Conditional reveal/hide behaviours

### Out of Scope
- Real address lookup API integration
- Legal status validation of underlessee/mortgagee
- Name verification against court records
- Editing or removing previously added entries
- International address formats
- Next screen implementation (placeholder only)
- Limiting number of entries

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handlers:** GET and POST for `/claims/underlessee-or-mortgagee-details`
- **Validation logic:** All five required field validations
- **Session management:** Array persistence, pre-population, Add new behaviour
- **Navigation flows:** Previous, Continue, Cancel, Add new
- **Page content:** Heading, caption, case number, all three sections
- **Conditional rendering:** All conditional reveals for Yes selections

### 2. Session State Tests
- Array storage (`underlesseeOrMortgageeDetails: [...]`)
- Single entry storage with all fields
- Multiple entries via Add new
- Pre-population of last entry on revisit
- Data preservation when navigating back
- Text/address retention when toggling selections

### 3. Accessibility Tests
- Error summary rendering and focus
- Error links to relevant fields/radio groups
- Keyboard navigation for all inputs
- Proper labelling of form elements
- Conditional reveals announced to screen readers
- GOV.UK component patterns

---

## Assumptions

1. **Entry condition:** Screen only accessible after "Yes" on Screen 30
2. **Storage format:** String values 'yes' and 'no' (lowercase); null on first visit
3. **Form field names:** As per AC-21 session structure
4. **GOV.UK components:** Using govukRadios, govukInput, govukTextarea, govukButton
5. **Postcode lookup stub:** Uses FEATURE_ADDRESS_LOOKUP flag or mock service
6. **Manual entry always available:** "I can't enter a UK postcode" link shows manual fields
7. **Address dropdown:** Populated after "Find address" click with valid postcode
8. **Required fields:** Building and Street, Town or City, Postcode
9. **Optional field marking:** "(Optional)" in label text
10. **Add new behaviour:** POST with action="addNew" saves and resets
11. **Array indexing:** Current entry index tracked in session or query param
12. **Placeholder route:** Next screen route TBD; tests use generic assertion

---

## Risks and Constraints

### Risks
1. **Postcode lookup complexity:** Stub behaviour must match expected patterns
2. **Array management:** Current entry tracking and Add new logic complexity
3. **Multiple validation rules:** Five separate validation scenarios to test
4. **Conditional reveals:** Multiple nested conditional reveals
5. **Session structure:** Complex nested object within array
6. **Address selection:** Dropdown population and field pre-fill logic
7. **Form state persistence:** Data retained across many interactions

### Mitigations
1. Create comprehensive stub for postcode lookup behaviour
2. Test array operations in isolation; verify index tracking
3. Test each validation rule separately and combined
4. Test conditional reveals in isolation and combination
5. Verify session structure in every persistence test
6. Test address selection end-to-end with stubbed data
7. Explicit tests for form state across navigation

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Postcode lookup:** Stubbed; no external API calls
- **Navigation:** Linear flow with fixed Previous/Cancel; Continue TBD
- **JavaScript:** Conditional reveals require JavaScript; tests assume client-side logic

---

## Test Approach

### Happy Path Tests
1. Display page with all three sections and correct heading/caption
2. Section 1: Select Yes for name, enter name, conditional reveal works
3. Section 2: Select Yes for address, use postcode lookup, address populated
4. Section 2: Select Yes for address, use manual entry, all fields available
5. Section 3: Select No for additional parties
6. Submit successfully with all data stored in session array
7. Navigate using Previous (back to Screen 30, data preserved)
8. Navigate using Continue (to TBD next screen)
9. Navigate using Cancel (to case-list)

### Add New Flow Tests
1. Select Yes for additional parties, Add new panel revealed
2. Click Add new button, current entry saved, form reset
3. Multiple Add new clicks create array entries
4. Previous entries preserved in array

### Edge and Boundary Cases
1. First visit (empty form, no pre-selection)
2. Revisit with data (all fields pre-populated)
3. Toggle name Yes/No (data retained in session)
4. Toggle address Yes/No (address data retained)
5. Toggle additional Yes/No (panel shown/hidden)
6. Postcode lookup with no results
7. Postcode lookup with multiple results
8. Address selection from dropdown
9. Manual entry link behaviour
10. Very long name input
11. Special characters in name and address

### Error and Invalid Scenarios
1. Submit without any selection (all five validation errors)
2. Submit with name Yes but no name entered
3. Submit with address Yes but missing required fields
4. Submit with partial address (some required missing)
5. Submit without additional parties selection
6. Validation error display and focus
7. Multiple validation errors displayed together
8. Form state preserved after validation error

### Cross-Cutting Concerns
1. Session persistence across request/response cycles
2. Accessibility (error summary, focus, labels, keyboard)
3. Pre-population after navigation back and forth
4. GOV.UK component patterns throughout
5. Case number display
6. Array structure integrity

---

## Success Criteria

### Tests Must
- Cover all 26 acceptance criteria (AC-1 through AC-26)
- Run successfully via `npm test`
- Use realistic session state matching expected structure
- Test all three sections independently and together
- Test all five validation scenarios
- Verify array storage and Add new behaviour
- Test GOV.UK error pattern (summary, inline, focus)
- Verify all conditional reveals
- Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 26 ACs mapped to tests
- **All three sections:** Name, Address, Additional parties
- **All selections:** Yes and No for each question
- **Pre-population:** First visit, revisit, after navigation
- **Validation:** All five error scenarios
- **Navigation paths:** Previous, Continue, Cancel, Add new
- **Session scenarios:** Fresh, single entry, multiple entries
- **Page content:** All headings, labels, hints verified
- **Error handling:** All error messages, focus, summary
- **Conditional rendering:** All reveals and hides

---

## Traceability
All tests will map back to specific acceptance criteria (AC-1 through AC-26). See test-behaviour-matrix.md for detailed mapping.

---

*Test plan created by Nigel (Tester Agent) on 2026-01-30 for Screen 31.*
