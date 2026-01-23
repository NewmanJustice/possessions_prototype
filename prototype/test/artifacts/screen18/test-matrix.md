# Screen 18 — Notice of intention (Test Matrix)

## Display tests (AC-1, AC-2)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| D-1 | Page loads successfully | GET /claims/notice-of-intention | Status 200, correct title | AC-1 |
| D-2 | Guidance text displayed | GET request | Guidance content present | AC-1 |
| D-3 | Warning message displayed | GET request | Warning element present | AC-1 |
| D-4 | External link present | GET request | Link to guidance visible | AC-1 |
| D-5 | Radio question displayed | GET request | Question text visible | AC-2 |
| D-6 | Yes radio option present | GET request | Yes radio exists with correct value | AC-2 |
| D-7 | No radio option present | GET request | No radio exists with correct value | AC-2 |
| D-8 | Continue button present | GET request | Submit button visible | AC-2 |

---

## External link tests (AC-1, Q1)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| L-1 | Link has target blank | GET request | Link has target="_blank" attribute | AC-1, Q1 |
| L-2 | Link has noopener noreferrer | GET request | Link has rel="noopener noreferrer" | AC-1, Q1 |
| L-3 | Link indicates external content | GET request | Link text/context shows it's guidance | AC-1 |

---

## Validation tests (AC-3)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| V-1 | Error when no selection | POST with no radio value | Status 400, error displayed | AC-3 |
| V-2 | Error summary displayed | POST with no selection | Error summary at top of page | AC-3 |
| V-3 | Inline error displayed | POST with no selection | Error message by radio group | AC-3 |
| V-4 | Error message correct | POST with no selection | "Select whether you have served notice to the defendants" | AC-3 |
| V-5 | Focus to error summary | POST with no selection | Error summary receives focus | AC-3 |
| V-6 | Error clears with selection | POST with valid selection | No errors, redirect success | AC-3 |

---

## Yes path tests (AC-4, AC-5)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| Y-1 | Yes stores noticeServed=true | POST noticeServed=true | session.claim.noticeOfIntention.noticeServed = true | AC-4 |
| Y-2 | Yes redirects correctly | POST noticeServed=true | Redirect to /claims/notice-details | AC-5 |
| Y-3 | Yes data persists | POST noticeServed=true, then GET next page | noticeServed=true still in session | AC-4 |

---

## No path tests (AC-4, AC-5)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| N-1 | No stores noticeServed=false | POST noticeServed=false | session.claim.noticeOfIntention.noticeServed = false | AC-4 |
| N-2 | No redirects correctly | POST noticeServed=false | Redirect to /claims/notice-details | AC-5 |
| N-3 | No data persists | POST noticeServed=false, then GET next page | noticeServed=false still in session | AC-4 |

---

## Session update tests

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| S-1 | Initial answer stored | First POST noticeServed=true | Session contains noticeServed=true | - |
| S-2 | Answer can be changed | POST true, then POST false | Session updated to noticeServed=false | - |
| S-3 | No duplicate values | Change answer multiple times | Only single noticeServed value exists | - |

---

## Previous navigation tests (AC-6)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| P-1 | Previous returns to Screen 17 | Click Previous link | Redirect to /claims/mediation-settlement | AC-6 |
| P-2 | Previous preserves selection | Store noticeServed=true, click Previous, return | noticeServed=true still in session | AC-6 |

---

## Cancel tests (AC-7)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| C-1 | Cancel returns to case list | Click Cancel link | Redirect to /case-list | AC-7 |
| C-2 | Cancel preserves session | Store data, click Cancel | Claim draft still in session | AC-7 |

---

## Accessibility tests (AC-8)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| A-1 | Error summary links to field | Error state | Error link has correct href to radio group | AC-8 |
| A-2 | Radio inputs labelled | GET request | Each radio has associated label | AC-8 |
| A-3 | Fieldset structure correct | GET request | Fieldset + legend wraps radio group | AC-8 |
| A-4 | Error focus management | POST with error | Focus moves to error summary | AC-8 |
| A-5 | Keyboard accessible | Keyboard navigation | All controls reachable via keyboard | AC-8 |

---

## Test coverage summary

| Acceptance Criteria | Test IDs | Count |
|---------------------|----------|-------|
| AC-1: Display guidance | D-1, D-2, D-3, D-4, L-1, L-2, L-3 | 7 |
| AC-2: Display question | D-5, D-6, D-7, D-8 | 4 |
| AC-3: Validation | V-1, V-2, V-3, V-4, V-5, V-6 | 6 |
| AC-4: Persist confirmation | Y-1, Y-3, N-1, N-3 | 4 |
| AC-5: Continue navigation | Y-2, N-2 | 2 |
| AC-6: Previous | P-1, P-2 | 2 |
| AC-7: Cancel | C-1, C-2 | 2 |
| AC-8: Accessibility | A-1, A-2, A-3, A-4, A-5 | 5 |
| Session updates | S-1, S-2, S-3 | 3 |
| **Total** | | **35** |
