# Test Plan — Screen 32: Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture

## Scope

### In Scope
- Page content display (heading, caption, case number, question, radio options)
- Validation (required selection)
- Session persistence (storing and pre-populating selection)
- Dynamic Previous navigation (Screen 30 or 31 based on journey path)
- Conditional Continue navigation (Screen 33 or 34 based on selection)
- Cancel behaviour (redirect to case-list)
- Accessibility (error summary, focus management, labelled inputs)

### Out of Scope
- Screen 33 (Upload additional document) implementation
- Screen 34 (Applications) implementation
- Legal validation of forfeiture relief entitlement

## Types of Tests

- Integration tests using Jest + Supertest
- Session-aware testing using supertest-session

## Test Categories

1. **GET Route Tests**
   - Page content verification
   - Pre-population from session

2. **POST Route Tests**
   - Validation failures
   - Successful submission
   - Navigation (Previous, Continue, Cancel)

## Risks

1. Screen 33 and 34 routes may not exist yet - tests should verify redirect location without requiring destination to exist
2. Dynamic Previous navigation requires proper session state setup

## Test Data

### Happy Path
- Selection: 'yes' or 'no'
- Previous session state: `hasUnderlesseeOrMortgagee: 'yes'` or `'no'`

### Error Path
- No selection made
