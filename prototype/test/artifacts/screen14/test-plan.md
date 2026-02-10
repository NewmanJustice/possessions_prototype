# Test Plan — Screen 14: Grounds for Possession (Additional Grounds)

## Scope

### In Scope
- Page rendering with correct title based on `titleMode`
- Display of 14 ground checkboxes in two groups (Mandatory and Discretionary)
- Multiple selection functionality (0 to 14 grounds)
- Validation: At least one ground must be selected
- Session persistence of selected grounds with prefixed keys
- Pre-population of selections on revisit
- Dynamic navigation using `session.claim.navigation.screen14` contract
- Navigation: Previous (dynamic), Continue (dynamic), Cancel (fixed)
- Conditional setup of navigation contract (only if not present)
- Error handling and accessibility (GOV.UK error summary, focus management)
- Deselection behavior (true → false transition)

### Out of Scope
- Reason/evidence entry for grounds (Screen 15 responsibility)
- Legal validation of ground combinations
- Ground-specific conditional questions (none on this screen)
- Non-assured journey paths (future enhancement)
- Testing with titleMode='standard' (only 'additional' for assured journey)
- Screen 13.1.1 "No additional grounds" bypass logic (tested in Screen 13.1.1)

---

## Test Types

### 1. Unit/Integration Tests (Jest + Supertest)
- **Route handler logic:** GET and POST for `/claims/grounds-for-possession`
- **Validation logic:** Minimum selection enforcement
- **Session management:** Navigation contract setup, ground persistence, pre-population
- **Navigation flows:** Previous, Continue, Cancel with dynamic routing
- **Error handling:** Validation errors, error summary, focus management

### 2. Session State Tests
- Navigation contract setup (conditional)
- Ground selection persistence (prefixed keys)
- Deselection behavior (false values)
- Pre-population on revisit

### 3. Accessibility Tests
- Error summary rendering
- Error links to checkbox group
- Focus management on validation failure
- Keyboard navigation for checkboxes and buttons

---

## Assumptions

1. **Session structure:** Navigation contract and grounds stored as specified in understanding.md
2. **GOV.UK components:** Using `govukCheckboxes` for grounds, `govukButton` for actions
3. **Ground labels:** Exact text from screen14.png design file
4. **Two groups:** Mandatory (6 grounds) and Discretionary (8 grounds) rendered separately
5. **Navigation contract defaults:** Set conditionally with assured path defaults
6. **Screen 15 placeholder:** Created for `/claims/reasons-for-possession` testing
7. **Checkbox values:** Ground keys (e.g., "mandatoryGround1") used as checkbox values
8. **Pre-population logic:** Checkbox `checked: true` if session value is `true`
9. **Deselection:** Unchecked boxes stored as `false` in session
10. **Title logic:** "Additional grounds for possession" when `titleMode === 'additional'`

---

## Risks and Constraints

### Risks
1. **Dynamic routing complexity:** Navigation contract must be correctly set and used
2. **14 checkboxes:** High number of test combinations (2^14 = 16,384 possible states)
3. **Session state synchronization:** Deselection must correctly update session to `false`
4. **Title mode switching:** Must handle both 'additional' and 'standard' (only testing 'additional' now)
5. **Entry point variability:** Future journeys may have different navigation contracts

### Mitigations
1. Test representative samples (1 ground, multiple grounds, all grounds, deselection)
2. Test navigation contract setup explicitly
3. Test pre-population and deselection scenarios thoroughly
4. Focus on assured journey path ('additional' title mode)
5. Use consistent session setup in test helpers

### Constraints
- **Test framework:** Jest + Supertest (existing)
- **Session handling:** express-session with supertest-session
- **Checkbox count:** 14 grounds (6 mandatory + 8 discretionary)
- **Validation:** Client-side and server-side (server-side tested here)
- **Navigation:** Dynamic routing requires flexible test setup

---

## Test Environments

### Development Environment
- **Runtime:** Node.js
- **Framework:** Express + Nunjucks + GOV.UK Frontend
- **Test Runner:** Jest
- **HTTP Testing:** Supertest + supertest-session
- **Linting:** ESLint

### Test Data
- **Ground selections:** Combinations of 14 checkboxes
- **Navigation contracts:** Various previous/continue/titleMode configurations
- **Session states:** Fresh, pre-existing selections, deselections

---

## Test Approach

### Happy Path Tests
1. Display page with 'additional' title and 14 checkboxes
2. Select single ground and submit successfully
3. Select multiple grounds and submit successfully
4. Navigate using dynamic Previous/Continue/Cancel routes

### Edge and Boundary Cases
1. Select all 14 grounds
2. Deselect previously selected ground (verify false in session)
3. Revisit with pre-existing selections (verify pre-population)
4. Navigation contract not set (verify conditional setup)
5. Navigation contract already set (verify preservation)

### Error and Invalid Scenarios
1. Submit with zero grounds selected (validation error)
2. Validation error preserves selections
3. Error summary displayed with correct link and focus

### Cross-Cutting Concerns
1. Session persistence across request/response cycle
2. Accessibility (error summary, focus, labels)
3. Navigation contract integrity (no corruption on errors)

---

## Success Criteria

### Tests Must
- ✅ Cover all 12 acceptance criteria (AC-1 through AC-12)
- ✅ Run successfully via `npm test`
- ✅ Use realistic session state (navigation contract + grounds)
- ✅ Test dynamic routing behavior explicitly
- ✅ Validate all 14 grounds can be selected individually and in combinations
- ✅ Verify deselection sets values to `false`
- ✅ Confirm pre-population works correctly
- ✅ Test GOV.UK error pattern (summary, inline, focus)
- ✅ Pass baseline run (all failing before implementation)

### Coverage Targets
- **All acceptance criteria:** 12 ACs mapped to tests
- **Ground selection variations:** Single, multiple, all, none (error)
- **Navigation paths:** Previous, Continue, Cancel
- **Session scenarios:** Fresh, pre-existing, modified
- **Error scenarios:** Validation failure, preservation, accessibility

---

## Traceability
All tests will map back to specific acceptance criteria (AC-1 through AC-12). See test-matrix.md and traceability.md for detailed mapping.

---

*Test plan created by Nigel (Tester Agent) on 2026-01-27 for Screen 14.*
