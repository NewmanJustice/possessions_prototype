# Screen 13.1.1: Assured Tenancy Grounds Selection - Test Behaviour Matrix

## AC-1: Display assured-tenancy rent arrears grounds

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-1 | Page displays explanatory text | T-1.1 | Happy |
| AC-1 | Ground 8 checkbox displayed | T-1.2 | Happy |
| AC-1 | Ground 10 checkbox displayed | T-1.3 | Happy |
| AC-1 | Ground 11 checkbox displayed | T-1.4 | Happy |

## AC-2: Grounds are optional

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-2 | Submit with no grounds selected accepted | T-2.1 | Happy |
| AC-2 | Submit with one ground selected accepted | T-2.2 | Happy |
| AC-2 | Submit with multiple grounds accepted | T-2.3 | Happy |

## AC-3: Multiple grounds may be selected

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-3 | Select ground 8 only | T-3.1 | Happy |
| AC-3 | Select ground 10 only | T-3.2 | Happy |
| AC-3 | Select ground 11 only | T-3.3 | Happy |
| AC-3 | Select multiple grounds (8+10) | T-3.4 | Happy |
| AC-3 | Select all three grounds | T-3.5 | Happy |

## AC-4: Preserve selections on revisit

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-4 | Checkboxes pre-selected on revisit | T-4.1 | State |
| AC-4 | Radio pre-selected on revisit | T-4.2 | State |

## AC-5: Persist assured-tenancy grounds

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-5 | ground8 stored in session | T-5.1 | State |
| AC-5 | ground10 stored in session | T-5.2 | State |
| AC-5 | ground11 stored in session | T-5.3 | State |
| AC-5 | Unselected grounds stored as false | T-5.4 | State |

## AC-6: Display additional grounds question and button

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-6 | Radio question displayed | T-6.1 | Happy |
| AC-6 | Yes/No radio options displayed | T-6.2 | Happy |
| AC-6 | "Add additional grounds" button displayed | T-6.3 | Happy |
| AC-6 | Button is keyboard focusable | T-6.4 | A11y |
| AC-6 | Button has accessible name | T-6.5 | A11y |
| AC-6 | Button is primary style (green) | T-6.6 | UX |
| AC-6 | Button positioned underneath radios | T-6.7 | UX |

## AC-7: Branching selection required when using radios

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-7 | Error when no radio selected and button not pressed | T-7.1 | Error |
| AC-7 | Error message correct | T-7.2 | Error |
| AC-7 | Focus moves to error summary | T-7.3 | Error |
| AC-7 | NO error when button pressed (bypasses radio requirement) | T-7.4 | Happy |

## AC-8: Add additional grounds button behaviour

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-8 | Button click stores hasAdditionalGrounds = true | T-8.1 | State |
| AC-8 | Button click redirects immediately | T-8.2 | Routing |
| AC-8 | Button redirects to /claims/grounds-for-possession | T-8.3 | Routing |
| AC-8 | Button bypasses Continue button | T-8.4 | Happy |
| AC-8 | Button works with checkboxes selected | T-8.5 | Happy |
| AC-8 | Button works with no checkboxes selected | T-8.6 | Happy |

## AC-9: Yes path via radio selection

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-9 | Radio Yes stores hasAdditionalGrounds = true | T-9.1 | State |
| AC-9 | Radio Yes redirects to /claims/grounds-for-possession | T-9.2 | Routing |

## AC-10: No path - proceed to preaction protocol

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-10 | Radio No stores hasAdditionalGrounds = false | T-10.1 | State |
| AC-10 | Radio No redirects to /claims/preaction-protocol | T-10.2 | Routing |

## AC-11: Previous navigation

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-11 | Previous link to assured confirmation page | T-11.1 | Navigation |
| AC-11 | Previous preserves selections | T-11.2 | Navigation |

## AC-12: Cancel behaviour

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-12 | Cancel link to /case-list | T-12.1 | Navigation |
| AC-12 | Cancel preserves claim draft | T-12.2 | Navigation |

## AC-13: Accessibility compliance

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-13 | Error summary on validation failure | T-13.1 | A11y |
| AC-13 | Error links to radio group | T-13.2 | A11y |
| AC-13 | Focus moves to error summary | T-13.3 | A11y |
| AC-13 | Button keyboard accessible | T-13.4 | A11y |
| AC-13 | Button has accessible name | T-13.5 | A11y |
| AC-13 | Checkboxes properly labelled | T-13.6 | A11y |
| AC-13 | Radios properly labelled | T-13.7 | A11y |

## Cross-Cutting

| Behaviour | Test ID | Type |
|-----------|---------|------|
| Unauthenticated user redirected to sign-in | T-X.1 | Security |
| Page requires SOLICITOR role | T-X.2 | Security |
| Page has correct title pattern | T-X.3 | UX |
| Error page title includes "Error:" prefix | T-X.4 | UX |
