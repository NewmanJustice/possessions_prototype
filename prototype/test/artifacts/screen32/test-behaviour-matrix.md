# Test Behaviour Matrix — Screen 32

## AC to Test Mapping

| AC | Description | Test IDs |
|----|-------------|----------|
| AC-1 | Display page heading and caption | T-1.1, T-1.2, T-1.3 |
| AC-2 | Display question and radio options | T-2.1, T-2.2, T-2.3, T-2.4 |
| AC-3 | Yes/No selection is required | T-3.1, T-3.2, T-3.3 |
| AC-4 | Persist selection | T-4.1, T-4.2, T-4.3 |
| AC-5 | Preserve selection on revisit | T-5.1, T-5.2, T-5.3 |
| AC-6 | Previous navigation (from Screen 31 path) | T-6.1, T-6.2 |
| AC-7 | Previous navigation (from Screen 30 path) | T-7.1, T-7.2 |
| AC-8 | Continue navigation when Yes is selected | T-8.1 |
| AC-9 | Continue navigation when No is selected | T-9.1 |
| AC-10 | Cancel behaviour | T-10.1 |
| AC-11 | Accessibility compliance | T-11.1, T-11.2, T-11.3 |

## Test Cases

### T-1: Page Content (AC-1)
- T-1.1: Page heading displays correctly
- T-1.2: Caption "Make a claim" displays
- T-1.3: Case number displays

### T-2: Question and Options (AC-2)
- T-2.1: Question text displays
- T-2.2: Yes radio option displays
- T-2.3: No radio option displays
- T-2.4: Radio buttons have correct name attribute

### T-3: Validation (AC-3)
- T-3.1: Error shown when no selection made
- T-3.2: GOV.UK error summary displays
- T-3.3: Error link targets radio group

### T-4: Persistence (AC-4)
- T-4.1: Store 'yes' when Yes selected
- T-4.2: Store 'no' when No selected
- T-4.3: Update stored value when changing selection

### T-5: Pre-population (AC-5)
- T-5.1: Pre-select Yes when previously selected
- T-5.2: Pre-select No when previously selected
- T-5.3: No pre-selection on first visit

### T-6: Previous from Screen 31 Path (AC-6)
- T-6.1: Redirect to underlessee-or-mortgagee-details when coming from Screen 31
- T-6.2: Preserve data when navigating back

### T-7: Previous from Screen 30 Path (AC-7)
- T-7.1: Redirect to underlessee-or-mortgagee when coming from Screen 30
- T-7.2: Preserve data when navigating back

### T-8: Continue with Yes (AC-8)
- T-8.1: Redirect to upload-additional-document when Yes selected

### T-9: Continue with No (AC-9)
- T-9.1: Redirect to applications when No selected

### T-10: Cancel (AC-10)
- T-10.1: Redirect to case-list when Cancel clicked

### T-11: Accessibility (AC-11)
- T-11.1: Error summary displays on validation failure
- T-11.2: Error summary has tabindex for focus
- T-11.3: Radio inputs have proper labels
