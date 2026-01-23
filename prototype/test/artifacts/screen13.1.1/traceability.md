# Screen 13.1.1: Assured Tenancy Grounds Selection - Traceability Table

## AC-1: Display grounds and explanatory content

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 — Ground 8 displayed | T-1.1 | Serious rent arrears |
| AC-1 — Ground 10 displayed | T-1.2 | Rent arrears |
| AC-1 — Ground 11 displayed | T-1.3 | Persistent delay |
| AC-1 — Explanatory text | T-1.4 | |

## AC-2: All grounds are optional

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-2 — No grounds selected valid | T-2.1 | |
| AC-2 — Single ground valid | T-2.2 | |
| AC-2 — All grounds valid | T-2.3 | |

## AC-3: Selected grounds are persisted

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-3 — Ground 8 stored | T-3.1 | |
| AC-3 — Ground 10 stored | T-3.2 | |
| AC-3 — Ground 11 stored | T-3.3 | |
| AC-3 — Multiple grounds stored | T-3.4 | |
| AC-3 — All grounds stored | T-3.5 | |
| AC-3 — Unselected = false | T-3.6 | |

## AC-4: Ask about other grounds

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-4 — Radio question displayed | T-4.1 | |
| AC-4 — Yes option displayed | T-4.2 | |
| AC-4 — No option displayed | T-4.3 | |

## AC-5: Branching selection required

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-5 — Error when no radio | T-5.1 | |
| AC-5 — Error message text | T-5.2 | |
| AC-5 — Error summary shown | T-5.3 | |
| AC-5 — Error links to radio | T-5.4 | |

## AC-6: Yes path navigation

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-6 — Yes redirects | T-6.1 | /claims/other-tenancy-grounds |
| AC-6 — Yes stores true | T-6.2 | |

## AC-7: No path navigation

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-7 — No redirects | T-7.1 | /claims/reasons-for-possessions |
| AC-7 — No stores false | T-7.2 | |

## AC-8: Previous navigation

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-8 — Previous link present | T-8.1 | |
| AC-8 — Previous navigates | T-8.2 | |
| AC-8 — Preserves selections | T-8.3 | |

## AC-9: Cancel behaviour

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-9 — Cancel link present | T-9.1 | |
| AC-9 — Cancel navigates | T-9.2 | |
| AC-9 — Preserves draft | T-9.3 | |

## AC-10: Accessibility compliance

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-10 — Error summary | T-10.1 | |
| AC-10 — Checkbox labels | T-10.2 | |
| AC-10 — Radio labels | T-10.3 | |
| AC-10 — GOV.UK checkboxes | T-10.4 | |
| AC-10 — GOV.UK radios | T-10.5 | |

## Re-visit Behaviour

| Requirement | Test IDs | Notes |
|-------------|----------|-------|
| Checkboxes pre-populated | T-R.1 | |
| Radio pre-populated | T-R.2 | |
| Mixed state preserved | T-R.3 | |

## Cross-Cutting

| Requirement | Test IDs | Notes |
|-------------|----------|-------|
| Authentication required | T-X.1 | |
| Page title | T-X.2 | "Grounds for possession" |
| Error page title | T-X.3 | |
| Continue button | T-X.4 | |

## Coverage Summary

| Section | ACs Covered | Tests Written | Notes |
|---------|-------------|---------------|-------|
| AC-1 (Display) | 1/1 | 4 | |
| AC-2 (Optional) | 1/1 | 3 | |
| AC-3 (Persist) | 1/1 | 6 | |
| AC-4 (Radio) | 1/1 | 3 | |
| AC-5 (Validation) | 1/1 | 4 | |
| AC-6 (Yes path) | 1/1 | 2 | |
| AC-7 (No path) | 1/1 | 2 | |
| AC-8 (Previous) | 1/1 | 3 | |
| AC-9 (Cancel) | 1/1 | 3 | |
| AC-10 (A11y) | 1/1 | 5 | |
| Re-visit | - | 3 | |
| Cross-cutting | - | 4 | |
| **TOTAL** | **10/10** | **42** | Full coverage |

## Branch Logic Summary

```
POST /claims/assured-tenancy-grounds-selection
├─ hasAdditionalGrounds: 'yes' → 302 /claims/other-tenancy-grounds
│                                session.claim.grounds.hasAdditionalGrounds = true
└─ hasAdditionalGrounds: 'no'  → 302 /claims/reasons-for-possessions
                                 session.claim.grounds.hasAdditionalGrounds = false
```

## Clarifications Applied

| # | Question | Resolution |
|---|----------|------------|
| Q1 | Route | `/claims/assured-tenancy-grounds-selection` |
| Q2 | Typo in user story | Corrected to `/claims/other-tenancy-grounds` |
| Q3 | Re-visit pre-populates | Yes - both checkboxes and radio |
| Q4 | Only radio validated | Yes - checkboxes optional |
| Q5 | Previous preserves | Yes - selections persist |
| Q6 | Page title | "Grounds for possession" |
