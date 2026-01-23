# Screen 17 — Mediation and settlement (Test Matrix)

## Display tests (AC-1, AC-2, AC-6, AC-7)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| D-1 | Page loads successfully | GET /claims/mediation-settlement | Status 200, correct title | AC-1 |
| D-2 | Mediation guidance displayed | GET request | Mediation guidance text present | AC-1 |
| D-3 | Mediation question displayed | GET request | Question with Yes/No radios | AC-2 |
| D-4 | Settlement guidance displayed | GET request | Settlement guidance text present (generic) | AC-6 |
| D-5 | Settlement question displayed | GET request | Question with Yes/No radios | AC-7 |
| D-6 | Continue button present | GET request | Submit button visible | - |
| D-7 | Previous and Cancel links present | GET request | Both navigation links visible | - |

---

## Conditional display tests (AC-3, AC-8, Q4)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| CD-1 | Mediation details hidden by default | GET request, no selection | Text area not visible | Q4 |
| CD-2 | Mediation details shown when Yes | Select mediation=Yes | Text area visible with label & hint | AC-3 |
| CD-3 | Mediation details hidden when No | Select mediation=No | Text area not visible | Q4 |
| CD-4 | Settlement details hidden by default | GET request, no selection | Text area not visible | Q4 |
| CD-5 | Settlement details shown when Yes | Select settlement=Yes | Text area visible with label & hint | AC-8 |
| CD-6 | Settlement details hidden when No | Select settlement=No | Text area not visible | Q4 |
| CD-7 | Mediation helper text shown | Select mediation=Yes | "You can enter up to 250 characters" | AC-3 |
| CD-8 | Settlement helper text shown | Select settlement=Yes | "You can enter up to 250 characters" | AC-8 |

---

## Required field validation (AC-11)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| RV-1 | Error when mediation not answered | POST, no mediationAttempted | Error: "Select whether you have attempted mediation" | AC-11 |
| RV-2 | Error when settlement not answered | POST, no settlementAttempted | Error: "Select whether you have tried to reach a settlement" | AC-11 |
| RV-3 | Errors when both not answered | POST, neither selected | Both errors shown | AC-11 |
| RV-4 | Error summary displayed | POST with missing fields | Error summary at top | AC-11 |
| RV-5 | Inline errors displayed | POST with missing fields | Errors next to radio groups | AC-11 |
| RV-6 | Focus to error summary | POST with error | Focus moves to summary | AC-11 |
| RV-7 | Mediation error links correctly | POST with mediation error | Error link to #mediationAttempted | AC-11 |
| RV-8 | Settlement error links correctly | POST with settlement error | Error link to #settlementAttempted | AC-11 |

---

## Character limit validation (AC-5, AC-10, Q5)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| CV-1 | 250 chars in mediation valid | mediation=Yes, 250 char details | No error, successful submit | AC-4 |
| CV-2 | 251 chars in mediation invalid | mediation=Yes, 251 char details | Error: "Enter 250 characters or fewer" | AC-5 |
| CV-3 | 250 chars in settlement valid | settlement=Yes, 250 char details | No error, successful submit | AC-9 |
| CV-4 | 251 chars in settlement invalid | settlement=Yes, 251 char details | Error: "Enter 250 characters or fewer" | AC-10 |
| CV-5 | Both fields over limit | Both 251+ chars | Two character limit errors | AC-5, AC-10 |
| CV-6 | Character limit error message | 251+ chars in either field | Correct error text displayed | AC-5, AC-10 |

---

## Optional field tests (AC-4, AC-9)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| OF-1 | Mediation Yes + empty details valid | mediation=Yes, details="" | No error, successful submit | AC-4 |
| OF-2 | Settlement Yes + empty details valid | settlement=Yes, details="" | No error, successful submit | AC-9 |
| OF-3 | Both Yes + both empty valid | Both Yes, both details="" | No error, successful submit | AC-4, AC-9 |
| OF-4 | No selections ignore details | mediation=No with stale details | Details ignored/cleared | Q4 |

---

## Data clearing tests (Q4)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| DC-1 | Mediation Yes→No clears details | Submit Yes+details, then No | mediationDetails = null | Q4 |
| DC-2 | Settlement Yes→No clears details | Submit Yes+details, then No | settlementDetails = null | Q4 |
| DC-3 | Both Yes→No clears both | Submit both Yes+details, then both No | Both details = null | Q4 |
| DC-4 | No→Yes starts fresh | Submit No, then Yes | Details field empty (not restored) | Q4 |

---

## Input preservation tests (AC-12)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| IP-1 | Radio selections preserved on error | Submit with char limit error | Radio selections still checked | AC-12 |
| IP-2 | Text area content preserved on error | Submit with char limit error | Text content still in fields | AC-12 |
| IP-3 | All inputs preserved together | Multiple errors | All radios + text preserved | AC-12 |
| IP-4 | Preserved with required field error | Submit missing radios with text | Text areas preserve content | AC-12 |

---

## Session storage tests (AC-13)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| SS-1 | Both No stored correctly | mediation=No, settlement=No | Both booleans false, details null | AC-13 |
| SS-2 | Mediation Yes + details stored | mediation=Yes + details | Boolean true, details string stored | AC-13 |
| SS-3 | Settlement Yes + details stored | settlement=Yes + details | Boolean true, details string stored | AC-13 |
| SS-4 | All four values stored | Both Yes + both details | All four fields populated | AC-13 |
| SS-5 | Session persists after redirect | Submit, then navigate back | Data still in session | AC-13 |
| SS-6 | Previous answers can change | Submit, change answers, submit | New values replace old | AC-13 |

---

## Forward navigation tests (AC-14)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| FN-1 | Valid submission redirects | Valid data | Redirect to /claims/notice-of-intention | AC-14 |
| FN-2 | Session stored before redirect | Valid submission | Data in session before redirect | AC-14 |
| FN-3 | Data persists after redirect | Submit, then check session | Data still present | AC-14 |

---

## Backward navigation tests (AC-15, AC-16)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| BN-1 | Previous returns to Screen 16 | Click Previous | Redirect to /claims/preaction-protocol | AC-15 |
| BN-2 | Previous preserves data | Enter data, click Previous, return | Data preserved | AC-15 |
| BN-3 | Cancel returns to case-list | Click Cancel | Redirect to /case-list | AC-16 |
| BN-4 | Cancel preserves claim draft | Enter data, Cancel | Session data preserved | AC-16 |

---

## Accessibility tests (AC-17)

| Test ID | Description | Input | Expected outcome | AC |
|---------|-------------|-------|------------------|-----|
| A-1 | Error summary links to radios | Error state | Links have correct href to radio groups | AC-17 |
| A-2 | Error summary links to text areas | Char limit error | Links have correct href to text areas | AC-17 |
| A-3 | Radio inputs labelled | GET request | Each radio has associated label | AC-17 |
| A-4 | Text areas labelled | Display text areas | Labels and hints present | AC-17 |
| A-5 | Fieldset structure correct | GET request | Fieldsets + legends wrap groups | AC-17 |
| A-6 | Focus management on error | POST with error | Focus moves to error summary | AC-17 |
| A-7 | Keyboard accessible | Keyboard navigation | All controls reachable | AC-17 |
| A-8 | Character count accessible | Text areas visible | Hint text associated with fields | AC-17 |

---

## Test coverage summary

| Category | Test IDs | Count |
|----------|----------|-------|
| Display | D-1 to D-7 | 7 |
| Conditional display | CD-1 to CD-8 | 8 |
| Required validation | RV-1 to RV-8 | 8 |
| Character limits | CV-1 to CV-6 | 6 |
| Optional fields | OF-1 to OF-4 | 4 |
| Data clearing | DC-1 to DC-4 | 4 |
| Input preservation | IP-1 to IP-4 | 4 |
| Session storage | SS-1 to SS-6 | 6 |
| Forward navigation | FN-1 to FN-3 | 3 |
| Backward navigation | BN-1 to BN-4 | 4 |
| Accessibility | A-1 to A-8 | 8 |
| **Total** | | **62** |

---

## Acceptance Criteria mapping

| AC | Description | Test IDs | Count |
|----|-------------|----------|-------|
| AC-1 | Display mediation guidance | D-1, D-2 | 2 |
| AC-2 | Ask mediation question | D-3 | 1 |
| AC-3 | Mediation details when Yes | CD-2, CD-7 | 2 |
| AC-4 | Mediation details optional | OF-1, CV-1 | 2 |
| AC-5 | Mediation char limit | CV-2, CV-6 | 2 |
| AC-6 | Display settlement guidance | D-4 | 1 |
| AC-7 | Ask settlement question | D-5 | 1 |
| AC-8 | Settlement details when Yes | CD-5, CD-8 | 2 |
| AC-9 | Settlement details optional | OF-2, CV-3 | 2 |
| AC-10 | Settlement char limit | CV-4, CV-6 | 2 |
| AC-11 | Both selections required | RV-1 to RV-8 | 8 |
| AC-12 | Preserve inputs on error | IP-1 to IP-4 | 4 |
| AC-13 | Persist responses | SS-1 to SS-6 | 6 |
| AC-14 | Continue navigation | FN-1 to FN-3 | 3 |
| AC-15 | Previous navigation | BN-1, BN-2 | 2 |
| AC-16 | Cancel behaviour | BN-3, BN-4 | 2 |
| AC-17 | Accessibility | A-1 to A-8 | 8 |
| **Total** | | | **50** |

Additional coverage: Q4 (data clearing) = 12 tests
