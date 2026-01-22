# Screen 10: Contact Preferences - Traceability Table

## Story 1: Notifications Email

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1.1 — Registered email displayed | T-1.1.1, T-1.1.2 | |
| AC-1.2 — Use registered email (Yes) clears alternate | T-1.2.1, T-1.2.2 | |
| AC-1.3 — Use alternate email (No) reveals input, validates | T-1.3.1, T-1.3.2, T-1.3.3, T-1.3.4, T-1.3.5, T-1.3.6 | |
| AC-1.4 — Single address only | T-1.4.1 | |
| Edge cases (empty, whitespace, length, preserve) | T-1.E.1, T-1.E.2, T-1.E.3, T-1.E.4, T-1.E.5 | |

## Story 2: Correspondence Address

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-2.1 — Registered address shown | T-2.1.1, T-2.1.2 | |
| AC-2.2 — Choosing registered address (Yes) clears alternate | T-2.2.1, T-2.2.2 | |
| AC-2.3 — Choosing alternate (No) reveals postcode lookup & fields | T-2.3.1, T-2.3.2 | |
| AC-2.4 — Postcode lookup returns dummy addresses | T-2.4.1, T-2.4.2 | Lookup endpoint may be separate route |
| AC-2.5 — Manual edit allowed after selection | T-2.5.1 | |
| AC-2.6 — Required address validation | T-2.6.1, T-2.6.2, T-2.6.3, T-2.6.4 | |
| AC-2.7 — UK-only validation (not enforced) | N/A | Out of scope for prototype |
| Edge cases (preserve values, no radio) | T-2.E.1, T-2.E.2 | |

## Story 3: Contact Phone Number

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-3.1 — Phone option present and optional | T-3.1.1, T-3.1.2 | |
| AC-3.2 — Select Yes requires valid phone | T-3.2.1, T-3.2.2, T-3.2.3 | |
| AC-3.3 — Select No retains-but-ignored | T-3.3.1, T-3.3.2 | |
| AC-3.4 — Phone stored in session | T-3.4.1, T-3.4.2 | |
| Boundary cases (6/7/15/16 digits, formatting) | T-3.E.1, T-3.E.2, T-3.E.3, T-3.E.4, T-3.E.5, T-3.E.6 | |

## Story 4: Save / Navigation Behaviour

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-4.1 — Continue saves and redirects | T-4.1.1, T-4.1.2 | |
| AC-4.2 — Previous navigates to preceding page | T-4.2.1, T-4.2.2 | Previous = /claims/name-of-claimant |
| AC-4.3 — Cancel returns to case list, preserves draft | T-4.3.1, T-4.3.2 | |
| AC-4.4 — No mandatory fields if using registered/no phone | T-4.4.1 | |
| Edge cases (re-visit shows saved data) | T-4.E.1 | |

## Cross-Cutting

| Requirement | Test IDs | Notes |
|-------------|----------|-------|
| Authentication required | T-X.1 | |
| SOLICITOR role required | T-X.2 | |
| Page title pattern | T-X.3 | |
| Error page title includes "Error:" | T-X.4 | |

## Coverage Summary

| Story | ACs Covered | Tests Written | Notes |
|-------|-------------|---------------|-------|
| Story 1 (Email) | 4/4 | 16 | All ACs covered + edge cases |
| Story 2 (Address) | 6/7 | 12 | AC-2.7 not enforced (out of scope) |
| Story 3 (Phone) | 4/4 | 12 | All ACs covered + boundary tests |
| Story 4 (Navigation) | 4/4 | 9 | All ACs covered |
| Cross-cutting | 4/4 | 4 | Auth, role, title patterns |
| **TOTAL** | **18/19** | **53** | AC-2.7 intentionally excluded |

## Open Questions

| # | Question | Status |
|---|----------|--------|
| Q1 | Should postcode lookup have its own endpoint `/claims/contact-preferences/lookup-address`? | Assumption: Yes, separate POST endpoint |
| Q2 | What happens if user has no `registeredAddress` in session? | Assumption: Claude handles gracefully, shows error or uses defaults |
| Q3 | Should the test verify exact session structure for `contactPreferences`? | Deferred: Tests verify behaviour, not internal structure |
