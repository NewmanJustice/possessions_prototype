# Screen 13.1.1: Assured Tenancy Grounds Selection - Traceability Table

## AC-1: Display assured-tenancy rent arrears grounds

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 — Display explanatory text | T-1.1 | |
| AC-1 — Display 3 checkbox options | T-1.2, T-1.3, T-1.4 | Grounds 8, 10, 11 |

## AC-2: Grounds are optional

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-2 — No grounds selected accepted | T-2.1 | |
| AC-2 — One or more grounds accepted | T-2.2, T-2.3 | |

## AC-3: Multiple grounds may be selected

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-3 — Single selections | T-3.1, T-3.2, T-3.3 | Each ground individually |
| AC-3 — Multiple selections | T-3.4, T-3.5 | Combinations |

## AC-4: Preserve selections on revisit

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-4 — Checkboxes preserved | T-4.1 | |
| AC-4 — Radio preserved | T-4.2 | |

## AC-5: Persist assured-tenancy grounds

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-5 — Store each ground in session | T-5.1, T-5.2, T-5.3 | |
| AC-5 — Unselected stored as false | T-5.4 | |

## AC-6: Display additional grounds question and button

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-6 — Radio question displayed | T-6.1, T-6.2 | Yes/No options |
| AC-6 — Button displayed | T-6.3 | "Add additional grounds" |
| AC-6 — Button keyboard focusable | T-6.4 | |
| AC-6 — Button has accessible name | T-6.5 | |
| AC-6 — Button styling | T-6.6, T-6.7 | Primary (green), underneath radios |

## AC-7: Branching selection required when using radios

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-7 — Error when neither selected nor pressed | T-7.1, T-7.2, T-7.3 | |
| AC-7 — No error when button pressed | T-7.4 | Validation bypass |

## AC-8: Add additional grounds button behaviour

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-8 — Button stores hasAdditionalGrounds = true | T-8.1 | |
| AC-8 — Button redirects immediately | T-8.2, T-8.3 | To /claims/grounds-for-possession |
| AC-8 — Button bypasses Continue | T-8.4 | |
| AC-8 — Button independent of checkboxes | T-8.5, T-8.6 | Works either way |

## AC-9: Yes path via radio selection

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-9 — Yes stores hasAdditionalGrounds = true | T-9.1 | |
| AC-9 — Yes redirects to additional grounds | T-9.2 | /claims/grounds-for-possession |

## AC-10: No path - proceed to preaction protocol

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-10 — No stores hasAdditionalGrounds = false | T-10.1 | |
| AC-10 — No redirects to preaction protocol | T-10.2 | /claims/preaction-protocol |

## AC-11: Previous navigation

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-11 — Previous link correct | T-11.1 | To assured confirmation |
| AC-11 — Previous preserves data | T-11.2 | |

## AC-12: Cancel behaviour

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-12 — Cancel link correct | T-12.1 | To /case-list |
| AC-12 — Cancel preserves draft | T-12.2 | |

## AC-13: Accessibility compliance

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-13 — Error summary | T-13.1, T-13.2, T-13.3 | |
| AC-13 — Button accessibility | T-13.4, T-13.5 | Keyboard + accessible name |
| AC-13 — Labels | T-13.6, T-13.7 | Checkboxes and radios |

## Cross-Cutting

| Requirement | Test IDs | Notes |
|-------------|----------|-------|
| Authentication required | T-X.1 | |
| SOLICITOR role required | T-X.2 | |
| Page title pattern | T-X.3 | |
| Error page title | T-X.4 | |

## Coverage Summary

| Section | ACs Covered | Tests Written | Notes |
|---------|-------------|---------------|-------|
| AC-1 (Display grounds) | 1/1 | 4 | |
| AC-2 (Optional) | 1/1 | 3 | |
| AC-3 (Multiple selection) | 1/1 | 5 | |
| AC-4 (Preserve) | 1/1 | 2 | |
| AC-5 (Persist) | 1/1 | 4 | |
| AC-6 (Button + radio display) | 1/1 | 7 | NEW |
| AC-7 (Validation) | 1/1 | 4 | UPDATED |
| AC-8 (Button behavior) | 1/1 | 6 | NEW |
| AC-9 (Yes path) | 1/1 | 2 | UPDATED routes |
| AC-10 (No path) | 1/1 | 2 | UPDATED routes |
| AC-11 (Previous) | 1/1 | 2 | UPDATED route |
| AC-12 (Cancel) | 1/1 | 2 | |
| AC-13 (Accessibility) | 1/1 | 7 | |
| Cross-cutting | 4/4 | 4 | |
| **TOTAL** | **13/13** | **54** | Full AC coverage |

## Journey Context

**Previous Screen:** Screen 13.1 (`/claims/grounds-for-possession-assured-confirmation`) - assured confirmation = Yes

**Next Screens:**
- Yes radio OR "Add additional grounds" button → `/claims/grounds-for-possession` (additional grounds page)
- No radio → `/claims/preaction-protocol` (Screen 16)

**Route Update:**
- Old: `/claims/assured-tenancy-grounds-selection`
- New: `/claims/grounds-for-possession-assured-selection`
