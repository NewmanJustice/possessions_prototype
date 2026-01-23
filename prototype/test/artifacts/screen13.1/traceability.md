# Screen 13.1: Assured Journey Confirmation - Traceability Table

## AC-1: Display confirmation question

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 — Question and radio options displayed | T-1.1, T-1.2, T-1.3 | With explanatory text |

## AC-2: Selection is required

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-2 — Error on empty submission | T-2.1, T-2.2 | Specific error message |
| AC-2 — Accessibility on error | T-2.3, T-2.4 | Focus + links |

## AC-3: Yes path - proceed with assured-tenancy grounds

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-3 — Store assuredProceed = true | T-3.1 | Session state |
| AC-3 — Redirect to Screen 13.1.1 | T-3.2 | Assured selection page |

## AC-4: No path - proceed to alternate grounds flow

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-4 — Store assuredProceed = false | T-4.1 | Session state |
| AC-4 — Redirect to Screen 14.1 | T-4.2 | General grounds page |

## AC-5: Preserve selection on validation failure

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-5 — Yes preserved | T-5.1 | On validation error |
| AC-5 — No preserved | T-5.2 | On validation error |

## AC-6: Previous navigation

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-6 — Previous link to tenancy | T-6.1, T-6.2 | Preserves data |

## AC-7: Cancel behaviour

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-7 — Cancel link to case-list | T-7.1, T-7.2 | Preserves draft |

## AC-8: Accessibility compliance

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-8 — Error summary | T-8.1, T-8.2, T-8.3 | Focus + links |
| AC-8 — Labels and keyboard | T-8.4, T-8.5 | |

## Cross-Cutting

| Requirement | Test IDs | Notes |
|-------------|----------|-------|
| Authentication required | T-X.1 | |
| SOLICITOR role required | T-X.2 | |
| Page title pattern | T-X.3 | |
| Error page title | T-X.4 | |
| Re-visiting shows saved selection | T-X.5 | |

## Coverage Summary

| Section | ACs Covered | Tests Written | Notes |
|---------|-------------|---------------|-------|
| AC-1 (Display question) | 1/1 | 3 | |
| AC-2 (Required validation) | 1/1 | 4 | |
| AC-3 (Yes path) | 1/1 | 2 | |
| AC-4 (No path) | 1/1 | 2 | |
| AC-5 (Preserve selection) | 1/1 | 2 | |
| AC-6 (Previous) | 1/1 | 2 | |
| AC-7 (Cancel) | 1/1 | 2 | |
| AC-8 (Accessibility) | 1/1 | 5 | |
| Cross-cutting | 5/5 | 5 | |
| **TOTAL** | **8/8** | **27** | Full AC coverage |

## Open Questions

None - all clarified with Steve.

## Journey Context

**Previous Screen:** Screen 12 (Tenancy details) - with groundsModel = 'ASSURED'

**Next Screens:**
- Yes path → Screen 13.1.1 (`/claims/grounds-for-possession-assured-selection`)
- No path → Screen 14.1 (`/claims/grounds-for-possession`)

**Route Rename Note:**
The old `/claims/grounds` route is being renamed to `/claims/grounds-for-possession` for the general grounds flow.
