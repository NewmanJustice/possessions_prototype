# Screen 16 — Pre-action protocol (Test Matrix)

## Display tests (AC-1, AC-2)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| D-1 | Page loads successfully | GET /claims/preaction-protocol | Status 200, correct title | AC-1 |
| D-2 | Guidance text displayed | GET request | Guidance content present | AC-1 |
| D-3 | Warning message displayed | GET request | Warning element present | AC-1 |
| D-4 | Radio question displayed | GET request | Question text visible | AC-2 |
| D-5 | Yes radio option present | GET request | Yes radio exists with correct value | AC-2 |
| D-6 | No radio option present | GET request | No radio exists with correct value | AC-2 |
| D-7 | Continue button present | GET request | Submit button visible | AC-2 |

---

## Validation tests (AC-3)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| V-1 | Error when no selection | POST with no radio value | Status 400, error displayed | AC-3 |
| V-2 | Error summary displayed | POST with no selection | Error summary at top of page | AC-3 |
| V-3 | Inline error displayed | POST with no selection | Error message by radio group | AC-3 |
| V-4 | Error message correct | POST with no selection | "Select whether you have followed the pre-action protocol" | AC-3 |
| V-5 | Focus to error summary | POST with no selection | Error summary receives focus | AC-3 |
| V-6 | Error clears with selection | POST with valid selection | No errors, redirect success | AC-3 |

---

## Yes path tests (AC-4)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| Y-1 | Yes stores followed=true | POST followed=true | session.claim.preActionProtocol.followed = true | AC-4 |
| Y-2 | Yes redirects correctly | POST followed=true | Redirect to /claims/mediation-settlement | AC-4 |
| Y-3 | Yes data persists | POST followed=true, then GET next page | followed=true still in session | AC-4 |

---

## No path tests (AC-5)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| N-1 | No stores followed=false | POST followed=false | session.claim.preActionProtocol.followed = false | AC-5 |
| N-2 | No redirects correctly | POST followed=false | Redirect to /claims/mediation-settlement | AC-5 |
| N-3 | No data persists | POST followed=false, then GET next page | followed=false still in session | AC-5 |

---

## Session update tests (Q3)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| S-1 | Initial answer stored | First POST followed=true | Session contains followed=true | Q3 |
| S-2 | Answer can be changed | POST true, then POST false | Session updated to followed=false | Q3 |
| S-3 | No duplicate values | Change answer multiple times | Only single followed value exists | Q3 |

---

## Previous navigation tests (AC-6)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| P-1 | Previous returns to Screen 13.1 | Click Previous link | Redirect to /claims/grounds-for-possession-assured-confirmation | AC-6 |
| P-2 | Previous preserves selection | Store followed=true, click Previous, return | followed=true still in session | AC-6 |

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
| AC-1: Display guidance | D-1, D-2, D-3 | 3 |
| AC-2: Display question | D-4, D-5, D-6, D-7 | 4 |
| AC-3: Validation | V-1, V-2, V-3, V-4, V-5, V-6 | 6 |
| AC-4: Yes path | Y-1, Y-2, Y-3 | 3 |
| AC-5: No path | N-1, N-2, N-3 | 3 |
| AC-6: Previous | P-1, P-2 | 2 |
| AC-7: Cancel | C-1, C-2 | 2 |
| AC-8: Accessibility | A-1, A-2, A-3, A-4, A-5 | 5 |
| Q3: Session updates | S-1, S-2, S-3 | 3 |
| **Total** | | **31** |
