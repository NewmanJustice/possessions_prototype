# Screen 13.1: Grounds for Possession - Traceability Table

## AC-5: Continue behaviour (branching)

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-5 — Rent arrears question displayed | T-5.1 | Yes/No radios |
| AC-5 — Yes redirects to assured-tenancy-grounds-selection | T-5.2 | Branch point |
| AC-5 — Yes stores rentArrears = true | T-5.3 | |
| AC-5 — No redirects to other-tenancy-grounds | T-5.4 | Branch point |
| AC-5 — No stores rentArrears = false | T-5.5 | |
| Validation errors | T-5.E.1, T-5.E.2, T-5.E.3 | |

## Navigation

| Requirement | Test IDs | Notes |
|-------------|----------|-------|
| Previous to /claims/tenancy | T-N.1, T-N.2 | |
| Cancel to /case-list | T-N.3, T-N.4 | |

## Cross-Cutting

| Requirement | Test IDs | Notes |
|-------------|----------|-------|
| Authentication required | T-X.1 | |
| SOLICITOR role required | T-X.2 | |
| Page title | T-X.3 | |
| Error page title | T-X.4 | |
| Re-visiting shows saved selection | T-X.5 | |

## Coverage Summary

| Section | ACs Covered | Tests Written | Notes |
|---------|-------------|---------------|-------|
| AC-5 (Branching) | 1/1 | 8 | Both branches + errors |
| Navigation | 2/2 | 4 | Previous + Cancel |
| Cross-cutting | 5/5 | 5 | |
| **TOTAL** | **8/8** | **17** | Full coverage |

## Branch Logic Summary

```
POST /claims/grounds
├─ rentArrears: 'yes' → 302 /claims/assured-tenancy-grounds-selection
│                       session.claim.grounds.rentArrears = true
└─ rentArrears: 'no'  → 302 /claims/other-tenancy-grounds
                        session.claim.grounds.rentArrears = false
```

## Open Questions

| # | Question | Status |
|---|----------|--------|
| Q1 | User story file said "secure-tenancy-grounds" | Resolved: Steve confirmed `/claims/other-tenancy-grounds` |
