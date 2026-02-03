# Test Behaviour Matrix - Screen 35: Language Used

## AC to Test Mapping

| AC | Description | Test IDs |
|----|-------------|----------|
| AC-1 | Display page heading and caption | T-1.1, T-1.2, T-1.3 |
| AC-2 | Display question with hint text | T-2.1, T-2.2 |
| AC-3 | Display radio options | T-3.1, T-3.2, T-3.3, T-3.4, T-3.5 |
| AC-4 | Language selection is required | T-4.1, T-4.2, T-4.3 |
| AC-5 | Persist language selection | T-5.1, T-5.2, T-5.3 |
| AC-6 | Preserve selection on revisit | T-6.1, T-6.2, T-6.3, T-6.4 |
| AC-7 | Previous navigation | T-7.1 |
| AC-8 | Continue navigation | T-8.1, T-8.2, T-8.3 |
| AC-9 | Cancel behaviour | T-9.1 |
| AC-10 | Accessibility compliance | T-10.1, T-10.2, T-10.3 |
| AC-11 | Page title reflects error state | T-11.1 |

## Test Cases Summary

### GET Route Tests (T-1.x to T-3.x, T-6.x)
- T-1.1: Page displays heading "Language used"
- T-1.2: Page displays caption "Make a claim"
- T-1.3: Page displays case number
- T-2.1: Page displays question legend
- T-2.2: Page displays hint text
- T-3.1: Page displays English radio option
- T-3.2: Page displays Welsh radio option
- T-3.3: Page displays "English and Welsh" radio option
- T-3.4: Radio buttons have correct values
- T-3.5: No option pre-selected on first visit
- T-6.1: English pre-selected when previously selected
- T-6.2: Welsh pre-selected when previously selected
- T-6.3: "English and Welsh" pre-selected when previously selected
- T-6.4: No pre-selection on first visit (duplicate of T-3.5)

### POST Route Tests (T-4.x, T-5.x, T-7.x to T-11.x)
- T-4.1: Error shown when no selection made
- T-4.2: GOV.UK error summary displayed
- T-4.3: Error link targets radio group
- T-5.1: Session stores 'english' when English selected
- T-5.2: Session stores 'welsh' when Welsh selected
- T-5.3: Session stores 'english-and-welsh' when "English and Welsh" selected
- T-7.1: Previous redirects to /claims/applications
- T-8.1: Continue redirects to /claims/completing-your-claim (English)
- T-8.2: Continue redirects to /claims/completing-your-claim (Welsh)
- T-8.3: Continue redirects to /claims/completing-your-claim (English and Welsh)
- T-9.1: Cancel redirects to /case-list
- T-10.1: Error summary displayed on validation failure
- T-10.2: Error summary has tabindex for focus
- T-10.3: Radio inputs have proper labels
- T-11.1: Page title prefixed with "Error:" on validation failure

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2, T-1.3 | Page content verified |
| AC-2 | T-2.1, T-2.2 | Question and hint text verified |
| AC-3 | T-3.1, T-3.2, T-3.3, T-3.4, T-3.5 | All radio options verified |
| AC-4 | T-4.1, T-4.2, T-4.3 | Validation tested |
| AC-5 | T-5.1, T-5.2, T-5.3 | Persistence for all values |
| AC-6 | T-6.1, T-6.2, T-6.3, T-6.4 | Pre-selection for all values |
| AC-7 | T-7.1 | Previous navigation |
| AC-8 | T-8.1, T-8.2, T-8.3 | Continue for all selections |
| AC-9 | T-9.1 | Cancel behaviour |
| AC-10 | T-10.1, T-10.2, T-10.3 | Accessibility |
| AC-11 | T-11.1 | Error page title |
