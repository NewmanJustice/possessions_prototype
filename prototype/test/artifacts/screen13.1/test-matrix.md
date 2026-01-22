# Screen 13.1: Grounds for Possession - Test Behaviour Matrix

## AC-5: Continue behaviour (branching)

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-5 | Page displays rent arrears question with Yes/No radios | T-5.1 | Happy |
| AC-5 | Yes selection redirects to /claims/assured-tenancy-grounds-selection | T-5.2 | Branch |
| AC-5 | Yes selection stores rentArrears = true in session | T-5.3 | State |
| AC-5 | No selection redirects to /claims/other-tenancy-grounds | T-5.4 | Branch |
| AC-5 | No selection stores rentArrears = false in session | T-5.5 | State |
| - | No radio selected shows error summary | T-5.E.1 | Error |
| - | Error message describes selection required | T-5.E.2 | Error |
| - | Focus moves to error summary | T-5.E.3 | Error |

## Navigation

| Behaviour | Test ID | Type |
|-----------|---------|------|
| Previous link to /claims/tenancy | T-N.1 | Happy |
| Previous preserves session data | T-N.2 | State |
| Cancel link to /case-list | T-N.3 | Happy |
| Cancel preserves claim draft | T-N.4 | State |

## Cross-Cutting

| Behaviour | Test ID | Type |
|-----------|---------|------|
| Unauthenticated user redirected to sign-in | T-X.1 | Security |
| Page requires SOLICITOR role | T-X.2 | Security |
| Page has correct title | T-X.3 | UX |
| Error page title includes "Error:" | T-X.4 | UX |
| Re-visiting page shows previously saved selection | T-X.5 | State |
