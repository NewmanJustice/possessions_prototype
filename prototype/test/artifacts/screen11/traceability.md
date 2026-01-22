# Screen 11: Defendant Details - Traceability Table

## Defendant Name (AC-1 to AC-3)

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 — Ask whether name is known | T-1.1 | |
| AC-2 — Name known: require first and last name | T-2.1, T-2.2, T-2.3, T-2.4, T-2.5, T-2.6 | |
| AC-3 — Name unknown: hide and clear | T-3.1, T-3.2 | |
| Edge cases (whitespace, length, special chars, preserve) | T-2.E.1 to T-2.E.7 | |

## Defendant Address - Known/Unknown (AC-4 to AC-5)

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-4 — Ask whether address is known | T-4.1 | |
| AC-5 — Address unknown: allow continuation | T-5.1, T-5.2, T-5.3 | |
| Edge cases (no radio selected) | T-5.E.1 | |

## Same as Property Address (AC-6 to AC-8)

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-6 — Address known: ask if same as property | T-6.1 | |
| AC-7 — Same as property: copy and clear | T-7.1, T-7.2 | |
| AC-8 — Different address: show fields | T-8.1, T-8.2 | |
| Edge cases (no same-as-property radio) | T-8.E.1 | |

## Address Entry and Validation (AC-9 to AC-12)

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-9 — Postcode lookup (simulated) | T-9.1 | UI only |
| AC-10 — Manual address entry allowed | T-10.1 | |
| AC-11 — Required address fields | T-11.1, T-11.2, T-11.3, T-11.4, T-11.5 | |
| AC-12 — Address validation behaviour | T-12.1, T-12.2 | |
| Edge cases (preserve values) | T-12.E.1 | |

## Additional Defendants (AC-13 to AC-15)

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-13 — Ask about additional defendants | T-13.1 | |
| AC-14 — Additional defendants not yet supported | T-14.1, T-14.2 | JS reveal on same page |
| AC-15 — Single defendant happy path | T-15.1 | |
| Edge cases (no radio selected) | T-15.E.1 | |

## Navigation and Submission (AC-16 to AC-18)

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-16 — Continue saves and proceeds | T-16.1, T-16.2 | Redirects to /claims/grounds |
| AC-17 — Previous navigation | T-17.1, T-17.2 | Previous = /claims/contact-preferences |
| AC-18 — Cancel behaviour | T-18.1, T-18.2 | |

## Accessibility and Persistence (AC-19 to AC-20)

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-19 — Error handling and accessibility | T-19.1, T-19.2, T-19.3, T-19.4 | |
| AC-20 — Session storage structure | T-20.1, T-20.2 | Defendants stored as array |

## Cross-Cutting

| Requirement | Test IDs | Notes |
|-------------|----------|-------|
| Authentication required | T-X.1 | |
| SOLICITOR role required | T-X.2 | |
| Page title pattern | T-X.3 | |
| Error page title includes "Error:" | T-X.4 | |
| Re-visiting shows saved data | T-X.5 | |

## Coverage Summary

| Section | ACs Covered | Tests Written | Notes |
|---------|-------------|---------------|-------|
| Defendant Name (AC-1 to AC-3) | 3/3 | 16 | + 7 edge cases |
| Address Known/Unknown (AC-4 to AC-5) | 2/2 | 5 | |
| Same as Property (AC-6 to AC-8) | 3/3 | 5 | |
| Address Entry (AC-9 to AC-12) | 4/4 | 9 | |
| Additional Defendants (AC-13 to AC-15) | 3/3 | 5 | |
| Navigation (AC-16 to AC-18) | 3/3 | 6 | |
| Accessibility (AC-19 to AC-20) | 2/2 | 6 | |
| Cross-cutting | 5/5 | 5 | |
| **TOTAL** | **20/20** | **57** | Full AC coverage |

## Open Questions

| # | Question | Status |
|---|----------|--------|
| Q1 | What exact message shows for "additional defendants not supported"? | Assumption: Generic placeholder text |
| Q2 | Should property address be displayed on page for reference? | Not specified - assume not required |
| Q3 | What if user navigates directly to page without property address? | Assumption: Claude handles gracefully |
