# Screen 12: Tenancy or Licence Details - Traceability Table

## AC-1: Tenancy/licence type required

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 — Radio options displayed | T-1.1, T-1.2 | All 6 types shown |
| AC-1 — Error on empty submission | T-1.3, T-1.4, T-1.5 | |
| AC-1 — Each type accepted | T-1.6 to T-1.10 | 5 happy path tests |

## AC-2: "Other" reveals optional free-text

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-2 — Conditional reveal | T-2.1, T-2.2 | |
| AC-2 — Blank free-text accepted | T-2.3 | |
| AC-2 — Populated free-text accepted | T-2.4 | |
| Edge cases (length, preserve) | T-2.E.1, T-2.E.2 | |

## AC-3: Optional start date validation

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-3 — Empty date allowed | T-3.1 | |
| AC-3 — Valid complete date | T-3.2, T-3.3 | |
| AC-3 — Partial dates rejected | T-3.4 to T-3.8 | |
| Boundary cases (year limits) | T-3.E.1 to T-3.E.4 | 1799/1800/2100/2101 |
| Boundary cases (day/month) | T-3.E.5 to T-3.E.8 | 0/32 day, 0/13 month |
| Preserve on error | T-3.E.9 | |

## AC-4: Upload tenancy/licence agreement (simulated)

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-4 — Upload UI present | T-4.1 | |
| AC-4 — Upload optional | T-4.2 | |
| AC-4 — Metadata stored | T-4.3, T-4.4 | |
| AC-4 — Invalid type rejected | T-4.5 | |
| AC-4 — Oversize rejected | T-4.6 | |
| File types accepted | T-4.E.1 to T-4.E.5 | pdf, doc, docx, jpg, png |
| File removal | T-4.E.6 | |
| Multiple files | T-4.E.7 | |

## AC-5: Preserve inputs on validation error

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-5 — Type preserved | T-5.1 | |
| AC-5 — Date preserved | T-5.2 | |
| AC-5 — Files preserved | T-5.3 | |
| AC-5 — Other text preserved | T-5.4 | |

## AC-6: Continue saves and redirects

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-6 — Saves to session | T-6.1 to T-6.4 | |
| AC-6 — Redirects based on groundsModel | T-R.1, T-R.2, T-R.3 | Conditional routing |

## AC-7: Previous & Cancel behaviour

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-7 — Previous link | T-7.1, T-7.2 | To /claims/defendant-details |
| AC-7 — Cancel link | T-7.3, T-7.4 | To /case-list |

## AC-8: Accessibility

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-8 — Error summary | T-8.1, T-8.2, T-8.3 | |
| AC-8 — Labels | T-8.4 | |

## AC-13, AC-14: Grounds model determination and persistence

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-13 — System determines groundsModel | T-13.1 | |
| AC-14 — groundsModel stored in session | T-13.2 | |

## AC-15: Grounds model mapping

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-15 — Assured → ASSURED | T-15.1 | |
| AC-15 — Secure → SECURE_LIKE | T-15.2 | |
| AC-15 — Introductory → SECURE_LIKE | T-15.3 | |
| AC-15 — Flexible → SECURE_LIKE | T-15.4 | |
| AC-15 — Demoted → OTHER_UNSUPPORTED | T-15.5 | |
| AC-15 — Other → OTHER_UNSUPPORTED | T-15.6 | |

## AC-16: State clearing on tenancy change

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-16 — Clear incompatible grounds data | T-16.1 to T-16.5 | When groundsModel changes |

## Cross-Cutting

| Requirement | Test IDs | Notes |
|-------------|----------|-------|
| Authentication required | T-X.1 | |
| SOLICITOR role required | T-X.2 | |
| Page title pattern | T-X.3 | |
| Error page title | T-X.4 | |
| Re-visiting shows saved data | T-X.5 | |

## Coverage Summary

| Section | ACs Covered | Tests Written | Notes |
|---------|-------------|---------------|-------|
| AC-1 (Type required) | 1/1 | 10 | All 6 types + errors |
| AC-2 (Other free-text) | 1/1 | 6 | + edge cases |
| AC-3 (Start date) | 1/1 | 18 | + boundary tests |
| AC-4 (Upload) | 1/1 | 13 | + file type tests |
| AC-5 (Preserve inputs) | 1/1 | 4 | |
| AC-6 (Save/redirect) | 1/1 | 4 | Conditional routing |
| AC-7 (Navigation) | 1/1 | 4 | |
| AC-8 (Accessibility) | 1/1 | 4 | |
| AC-13, AC-14 (Determine/persist) | 2/2 | 2 | |
| AC-15 (Mapping) | 1/1 | 6 | All 6 tenancy types |
| AC-16 (State clearing) | 1/1 | 5 | |
| Routing | - | 3 | groundsModel-based |
| Cross-cutting | 5/5 | 5 | |
| **TOTAL** | **12/12** | **84** | Full AC coverage |

## Open Questions

| # | Question | Status |
|---|----------|--------|
| Q1 | How is file upload simulated in form? | Assumption: uploadedFileName field |
| Q2 | File removal endpoint? | Assumption: POST /claims/tenancy/remove-document |
| Q3 | What if same file uploaded twice? | Not specified - assume allowed |

## Journey Update Note

**IMPORTANT**: This screen now routes conditionally based on the `groundsModel` determined from tenancy type:

```
defendant-details → tenancy
                      ├─ ASSURED → /claims/grounds-for-possession-assured
                      ├─ SECURE_LIKE → /claims/grounds-for-possession-secure-flexible
                      └─ OTHER_UNSUPPORTED → /claims/grounds-for-possession-intro-demoted-other
```

**Route Renames**:
- Screen 13.1: `/claims/grounds` → `/claims/grounds-for-possession-assured`
- Screen 13.1.1: `/claims/assured-tenancy-grounds-selection` → `/claims/grounds-for-possession-assured-selection`
