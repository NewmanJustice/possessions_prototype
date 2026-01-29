# Screen 26 — Alternatives to Possession
## Test Plan

---

## 1. Scope and Assumptions

### In Scope
- Display of guidance text and question
- Rendering of two checkbox options (Suspension, Demotion)
- Mutual exclusivity enforcement (UI and server-side)
- Optional selection validation (accepting no selection)
- Session persistence of selected alternative
- Navigation routing based on selection
- Previous button navigation and data preservation
- Accessibility compliance (keyboard navigation, ARIA, error announcement)

### Out of Scope
- Eligibility validation for alternatives (business logic deferred to Screens 26a/26c)
- Legal basis determination (handled downstream)
- Court reasoning for appropriateness
- Styling or layout beyond functional elements
- Analytics or logging (unless explicitly stated)

### Assumptions
1. Session is initialized with `alternativesToPossession = { suspensionOfRightToBuy: false, demotionOfTenancy: false }`
2. User has successfully completed Screen 25 and is navigating forward
3. "Previous" button returns to Screen 25 (Defendant's Circumstances)
4. Form submission requires explicit "Continue" click
5. Mutual exclusivity is enforced both client-side (UI) and server-side (validation)
6. GOV.UK patterns apply for form layout, error summary, and accessibility

---

## 2. Test Categories and Types

### A. Happy Path Tests (Navigation & Data Flow)
- [T-1.1] No selection → Continue → routes to /claims/claiming-costs
- [T-1.2] Suspension selected → Continue → routes to /claims/select-housing-act-suspension
- [T-1.3] Demotion selected → Continue → routes to /claims/select-housing-act-demotion
- [T-1.4] No selection → session persists both properties false

### B. Edge and Boundary Cases (Mutual Exclusivity)
- [T-2.1] Select Suspension → attempt to also select Demotion → second option is rejected
- [T-2.2] Select Demotion → attempt to also select Suspension → second option is rejected
- [T-2.3] Select Suspension, deselect, then select Demotion → only Demotion persisted
- [T-2.4] Select both (server-side validation) → validation error if both true

### C. Form Behaviour (State Management)
- [T-3.1] On page load, no checkboxes pre-checked (fresh session)
- [T-3.2] On page load with existing session (Suspension), Suspension pre-checked
- [T-3.3] On page load with existing session (Demotion), Demotion pre-checked
- [T-3.4] Deselect selected checkbox → reverts to unchecked state

### D. Navigation and Data Preservation
- [T-4.1] Click Previous → redirects to /claims/defendants-circumstances (Screen 25)
- [T-4.2] Previous with Suspension selected → session data preserved
- [T-4.3] Previous with Demotion selected → session data preserved
- [T-4.4] Return to Screen 26 after Previous → previously selected option still selected

### E. Validation and Error Handling
- [T-5.1] Submit form with no selection → no error, proceeds to next screen
- [T-5.2] Server receives both checkboxes true → validation error "Cannot select both alternatives"
- [T-5.3] Malformed POST (missing expected fields) → validation error

### F. Display and Guidance (AC-1 & AC-2)
- [T-6.1] Page displays heading "Alternatives to possession"
- [T-6.2] Explanatory text present describing suspension and demotion
- [T-6.3] Question text matches AC-2: "In the alternative to possession, would you like to claim suspension of right to buy or demotion of tenancy? (Optional)"
- [T-6.4] Two checkbox labels visible: "Suspension of right to buy" and "Demotion of tenancy"

### G. Accessibility (AC-10)
- [T-7.1] Checkboxes keyboard accessible (Tab, Space, Arrow keys work)
- [T-7.2] All labels associated with checkboxes (for/id)
- [T-7.3] Mutual exclusivity conveyed to screen readers (ARIA attribute present)
- [T-7.4] Continue button accessible and labeled
- [T-7.5] Previous button accessible and labeled
- [T-7.6] Error summary (if any) announced to screen readers

### H. Session and State Tests
- [T-8.1] Session property `session.claim.alternativesToPossession.suspensionOfRightToBuy` is boolean after selection
- [T-8.2] Session property `session.claim.alternativesToPossession.demotionOfTenancy` is boolean after selection
- [T-8.3] Session structure matches expected format (no extra properties)
- [T-8.4] Session data persists across redirects

### I. Integration Tests (Cross-Screen Flow)
- [T-9.1] Suspension path: Screen 26 (select Suspension) → Screen 26a receives correct routing
- [T-9.2] Demotion path: Screen 26 (select Demotion) → Screen 26c receives correct routing
- [T-9.3] No selection path: Screen 26 (no selection) → Screen 28 receives correct routing
- [T-9.4] Session data from Screen 25 still present after Screen 26 submission

---

## 3. Risks and Unknowns

### Technical Risks
- **Mutual exclusivity enforcement:** If UI doesn't disable second checkbox, server validation must catch both-true cases
- **Session persistence:** Session data must survive across POST/redirect cycle
- **Routing logic:** Conditional routing based on selection requires careful implementation

### Business/Requirements Risks
- **Guidance text wording:** AC-1 refers to explanatory text but exact wording not specified; may need design review
- **Checkbox field names:** Implementation detail not specified (suspensionOfRightToBuy vs. alternatives.suspension, etc.)
- **Mutual exclusivity UI:** Whether checkboxes should disable dynamically or only validate server-side unclear

### Assumptions That Could Break Tests
- If `alternativesToPossession` is undefined instead of false values, pre-population tests will fail
- If Previous button clears session, data preservation tests will fail
- If routing logic is inverted, navigation tests will fail

---

## 4. Traceability Matrix

| Acceptance Criterion | Test IDs | Coverage | Notes |
|----------------------|----------|----------|-------|
| AC-1: Display alternatives guidance | T-6.1, T-6.2 | Partial | Exact wording TBD; tests check presence only |
| AC-2: Display alternative options | T-6.3, T-6.4 | Full | Question and labels verified |
| AC-3: Selection is optional | T-1.1, T-5.1 | Full | No selection accepted; no error raised |
| AC-4: Mutually exclusive selection | T-2.1, T-2.2, T-2.4 | Full | Both UI and server-side enforced |
| AC-5: Persist alternatives selection | T-1.4, T-8.1, T-8.2, T-8.3 | Full | Session structure and values verified |
| AC-6: Previous navigation | T-4.1, T-4.2, T-4.3 | Full | Navigation and data preservation tested |
| AC-7: No selection routes to costs | T-1.1, T-9.3 | Full | Integration verified |
| AC-8: Suspension routes to 26a | T-1.2, T-9.1 | Full | Integration verified |
| AC-9: Demotion routes to 26c | T-1.3, T-9.2 | Full | Integration verified |
| AC-10: Accessibility compliance | T-7.1, T-7.2, T-7.3, T-7.4, T-7.5, T-7.6 | Full | Keyboard, labels, ARIA, screen readers tested |

---

## 5. Test Environment & Setup

### Preconditions for All Tests
1. User is authenticated as a solicitor
2. Session contains a valid claim object
3. User has completed Screen 25 (Defendant's Circumstances) and is navigating forward
4. Database/session store is cleared between test runs

### Test Data
- No special data required (binary checkbox selection)
- Reuse session initialization patterns from other screens

### Test Infrastructure
- Integration tests using supertest + session middleware
- Session store populated with valid claim data
- Mock redirects verified via response status codes and Location header
- Accessibility tests using axe-core or jest-axe

---

## 6. Test Case Templates

### Template: Navigation Test
```
ID: T-1.X
Relates to: AC-7/8/9
Given: User on /claims/alternative-to-possession with session initialized
When: User selects [option] and clicks Continue
Then:
  - Response status 302 (redirect)
  - Location header set to [expected route]
  - Session persisted with correct selection
```

### Template: Mutual Exclusivity Test
```
ID: T-2.X
Relates to: AC-4
Given: User on /claims/alternative-to-possession
When: User POST both suspensionOfRightToBuy=true and demotionOfTenancy=true
Then:
  - Server returns 400 or redirects with error
  - Session NOT updated with both-true state
  - Error message shown to user
```

### Template: Accessibility Test
```
ID: T-7.X
Relates to: AC-10
Given: Page loaded in screen reader / keyboard-only mode
When: User navigates form via [Tab/Arrow/Space]
Then:
  - All controls reachable
  - Labels announced
  - Mutual exclusivity conveyed
```

---

## 7. Open Questions for Developer

1. **Q-1:** What form field names should be used for the checkboxes?
   - Proposed: `suspensionOfRightToBuy`, `demotionOfTenancy`

2. **Q-2:** Should mutual exclusivity be enforced via UI (disable second checkbox) or only server-side validation?
   - Proposed: Both for UX clarity

3. **Q-3:** What is the exact guidance text to display under the heading?
   - Awaiting design specification

4. **Q-4:** Should Previous button clear selection or preserve it?
   - Proposed: Preserve (standard pattern)

5. **Q-5:** Is a Cancel button present (standard navigation)?
   - Proposed: Yes, returns to case-list (needs confirmation)

---

## 8. Test Execution Priority

1. **High Priority (Happy Path):** T-1.1, T-1.2, T-1.3, T-5.1, T-6.1 through T-6.4
2. **High Priority (Mutual Exclusivity):** T-2.1, T-2.2, T-2.4
3. **High Priority (Navigation):** T-4.1, T-9.1, T-9.2, T-9.3
4. **Medium Priority (State Management):** T-3.1 through T-3.4, T-8.1 through T-8.4
5. **Medium Priority (Accessibility):** T-7.1 through T-7.6
6. **Low Priority (Edge Cases):** T-2.3, T-5.2, T-5.3, T-4.2, T-4.3, T-4.4

---

*This test plan was created by Nigel (Tester Agent) on 2026-01-29 based on user story screen26.txt and existing Screen 26c pattern.*
