# Screen 13.1: Assured Journey Confirmation - Test Behaviour Matrix

## AC-1: Display confirmation question

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-1 | Page displays confirmation question | T-1.1 | Happy |
| AC-1 | Radio options for Yes/No visible | T-1.2 | Happy |
| AC-1 | Supporting explanatory text shown | T-1.3 | UX |

## AC-2: Selection is required

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-2 | Submit without selection shows error summary | T-2.1 | Error |
| AC-2 | Error message "Select whether you want to proceed with assured-tenancy grounds" | T-2.2 | Error |
| AC-2 | Focus moves to error summary | T-2.3 | Error |
| AC-2 | Error links to radio group | T-2.4 | Error |

## AC-3: Yes path - proceed with assured-tenancy grounds

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-3 | Selecting Yes stores assuredProceed = true | T-3.1 | State |
| AC-3 | Selecting Yes redirects to /claims/grounds-for-possession-assured-selection | T-3.2 | Routing |

## AC-4: No path - proceed to alternate grounds flow

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-4 | Selecting No stores assuredProceed = false | T-4.1 | State |
| AC-4 | Selecting No redirects to /claims/grounds-for-possession | T-4.2 | Routing |

## AC-5: Preserve selection on validation failure

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-5 | Yes selection preserved on validation error | T-5.1 | Error |
| AC-5 | No selection preserved on validation error | T-5.2 | Error |

## AC-6: Previous navigation

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-6 | Previous link exists and points to /claims/tenancy | T-6.1 | Navigation |
| AC-6 | Previous preserves form data | T-6.2 | Navigation |

## AC-7: Cancel behaviour

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-7 | Cancel link exists and points to /case-list | T-7.1 | Navigation |
| AC-7 | Cancel preserves claim draft in session | T-7.2 | Navigation |

## AC-8: Accessibility compliance

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-8 | Error summary shown on validation failure | T-8.1 | A11y |
| AC-8 | Error links to radio group | T-8.2 | A11y |
| AC-8 | Focus moves to error summary | T-8.3 | A11y |
| AC-8 | Radio inputs properly labelled | T-8.4 | A11y |
| AC-8 | Radio inputs keyboard accessible | T-8.5 | A11y |

## Cross-Cutting

| Behaviour | Test ID | Type |
|-----------|---------|------|
| Unauthenticated user redirected to sign-in | T-X.1 | Security |
| Page requires SOLICITOR role | T-X.2 | Security |
| Page has correct title pattern | T-X.3 | UX |
| Error page title includes "Error:" prefix | T-X.4 | UX |
| Re-visiting page shows previously selected option | T-X.5 | State |
