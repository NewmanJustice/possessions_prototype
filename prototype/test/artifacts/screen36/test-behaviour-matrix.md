# Screen 36: Completing Your Claim - Test Behaviour Matrix

## AC-1: Display page heading, caption, and case number

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-1.1 | Page heading "Completing your claim" is displayed | Happy path |
| T-1.2 | Caption "Make a claim" is displayed | Happy path |
| T-1.3 | Case number is displayed | Happy path |

## AC-2: Display explanatory text

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-2.1 | Explanatory text "There are two options for what do to next:" is displayed | Happy path |
| T-2.2 | First bullet point about statement of truth and submit now is displayed | Happy path |
| T-2.3 | Second bullet point about save as draft is displayed | Happy path |

## AC-3: Display question with radio options

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-3.1 | Question "What would you like to do next?" is displayed | Happy path |
| T-3.2 | "Submit and pay for my claim now" radio option is displayed with value="submit-now" | Happy path |
| T-3.3 | "Save it for later" radio option is displayed with value="save-for-later" | Happy path |
| T-3.4 | Radio buttons use correct name attribute | Happy path |
| T-3.5 | No option is pre-selected on first visit | Happy path |

## AC-4: Selection is required (Validation)

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-4.1 | Error message "Select what you would like to do next" when no selection made | Error case |
| T-4.2 | GOV.UK error summary is displayed on validation failure | Error case |
| T-4.3 | Error link targets the radio group | Error case |

## AC-5: Persist completion preference

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-5.1 | Session stores "submit-now" when "Submit and pay for my claim now" selected | Happy path |
| T-5.2 | Session stores "save-for-later" when "Save it for later" selected | Happy path |

## AC-6: Preserve selection on revisit

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-6.1 | "Submit and pay for my claim now" is pre-selected when previously chosen | Happy path |
| T-6.2 | "Save it for later" is pre-selected when previously chosen | Happy path |
| T-6.3 | No pre-selection on first visit (duplicate of T-3.5) | Happy path |

## AC-7: Previous navigation

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-7.1 | Redirects to /claims/language-used when Previous clicked | Happy path |

## AC-8: Continue navigation

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-8.1 | Redirects to /claims/statement-of-truth when "submit-now" selected | Happy path |
| T-8.2 | Redirects to /claims/statement-of-truth when "save-for-later" selected | Happy path |

## AC-9: Cancel behaviour

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-9.1 | Redirects to /case-list when Cancel clicked | Happy path |

## AC-10: Accessibility compliance

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-10.1 | GOV.UK error summary displayed on validation failure | Accessibility |
| T-10.2 | Error summary has tabindex for focus management | Accessibility |
| T-10.3 | Radio inputs have proper GOV.UK classes and labels | Accessibility |

## AC-11: Page title reflects error state

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-11.1 | Page title prefixed with "Error: " on validation failure | Accessibility |

---

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2, T-1.3 | Page content display |
| AC-2 | T-2.1, T-2.2, T-2.3 | Explanatory text and bullets |
| AC-3 | T-3.1, T-3.2, T-3.3, T-3.4, T-3.5 | Question and radio options |
| AC-4 | T-4.1, T-4.2, T-4.3 | Validation error handling |
| AC-5 | T-5.1, T-5.2 | Session persistence |
| AC-6 | T-6.1, T-6.2, T-6.3 | Selection preservation |
| AC-7 | T-7.1 | Previous navigation |
| AC-8 | T-8.1, T-8.2 | Continue navigation |
| AC-9 | T-9.1 | Cancel behaviour |
| AC-10 | T-10.1, T-10.2, T-10.3 | Accessibility |
| AC-11 | T-11.1 | Error title prefix |

**Total: 21 test cases covering 11 acceptance criteria**
