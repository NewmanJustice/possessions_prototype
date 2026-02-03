# Screen 38: Check Your Answers - Test Behaviour Matrix

## AC-1: Display page heading and case number

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-1.1 | Page heading "Check your answers" is displayed | Happy path |
| T-1.2 | Case number is displayed | Happy path |

## AC-2: Display summary in GOV.UK summary list format

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-2.1 | Summary list uses GOV.UK summary list CSS class | Happy path |
| T-2.2 | Summary list uses semantic dl element | Accessibility |
| T-2.3 | Summary rows contain key, value, and actions columns | Happy path |

## AC-3: Display property address section

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-3.1 | Property address question is displayed | Happy path |
| T-3.2 | Property address value is displayed | Happy path |
| T-3.3 | Property address has Change link | Happy path |

## AC-4: Display claimant details section

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-4.1 | Claimant-related questions are displayed | Happy path |
| T-4.2 | Each claimant question has a Change link | Happy path |

## AC-5: Display defendant details section

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-5.1 | Defendant-related questions are displayed | Happy path |
| T-5.2 | Each defendant question has a Change link | Happy path |

## AC-6: Display tenancy information section

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-6.1 | Tenancy type question is displayed | Happy path |
| T-6.2 | Tenancy start date question is displayed | Happy path |
| T-6.3 | Each tenancy question has a Change link | Happy path |

## AC-7: Display grounds for possession section

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-7.1 | Grounds for possession question is displayed | Happy path |
| T-7.2 | Pre-action protocol question is displayed | Happy path |
| T-7.3 | Each grounds question has a Change link | Happy path |

## AC-8: Display rent arrears section

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-8.1 | Rent amount question is displayed | Happy path |
| T-8.2 | Total rent arrears question is displayed | Happy path |
| T-8.3 | Each rent question has a Change link | Happy path |

## AC-9: Display applications section

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-9.1 | Money judgement question is displayed | Happy path |
| T-9.2 | Each application question has a Change link | Happy path |

## AC-10: Display statement of truth section

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-10.1 | Statement of truth completed by question is displayed | Happy path |
| T-10.2 | Statement of truth has Change link | Happy path |

## AC-11: Change links are illustrative only

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-11.1 | Change links are present on the page | Happy path |
| T-11.2 | Multiple Change links exist across summary sections | Happy path |

## AC-12: Summary data can be hardcoded for prototype

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-12.1 | Summary list displays illustrative data values | Happy path |

## AC-13: Previous navigation

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-13.1 | Redirects to /claims/statement-of-truth when Previous clicked | Happy path |

## AC-14: Submit and pay navigation

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-14.1 | Redirects to /claims/pay-claim-fee when Submit and pay clicked | Happy path |
| T-14.2 | Submit and pay button is displayed with correct text | Happy path |

## AC-15: Cancel behaviour

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-15.1 | Redirects to /case-list when Cancel clicked | Happy path |

## AC-16: Accessibility compliance

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-16.1 | Summary list uses proper semantic HTML (dl element) | Accessibility |
| T-16.2 | Change links have accessible text (visually hidden context) | Accessibility |
| T-16.3 | Page is navigable by keyboard (form elements, links present) | Accessibility |

---

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2 | Page heading and case number |
| AC-2 | T-2.1, T-2.2, T-2.3 | GOV.UK summary list format |
| AC-3 | T-3.1, T-3.2, T-3.3 | Property address section |
| AC-4 | T-4.1, T-4.2 | Claimant details section |
| AC-5 | T-5.1, T-5.2 | Defendant details section |
| AC-6 | T-6.1, T-6.2, T-6.3 | Tenancy information section |
| AC-7 | T-7.1, T-7.2, T-7.3 | Grounds for possession section |
| AC-8 | T-8.1, T-8.2, T-8.3 | Rent arrears section |
| AC-9 | T-9.1, T-9.2 | Applications section |
| AC-10 | T-10.1, T-10.2 | Statement of truth section |
| AC-11 | T-11.1, T-11.2 | Change links (illustrative) |
| AC-12 | T-12.1 | Hardcoded data display |
| AC-13 | T-13.1 | Previous navigation |
| AC-14 | T-14.1, T-14.2 | Submit and pay navigation |
| AC-15 | T-15.1 | Cancel behaviour |
| AC-16 | T-16.1, T-16.2, T-16.3 | Accessibility compliance |

**Total: 28 test cases covering 16 acceptance criteria**
