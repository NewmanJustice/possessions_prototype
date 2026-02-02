# Test Plan — Screen 33: Upload additional documents

## Scope

### In Scope
- Page content display (heading, caption, case number, instructional text)
- Add document functionality
- Document entry form fields (type, file, description)
- Remove document functionality
- Validation (document type required, at least one document if from Screen 32 Yes path)
- Session persistence
- Navigation (Previous, Continue, Cancel)
- Accessibility

### Out of Scope
- Actual file upload/storage functionality
- File type/size validation
- Complex multi-user scenarios

## Types of Tests

- Integration tests using Jest + Supertest
- Session-aware testing using supertest-session

## Test Categories

1. **GET Route Tests** - Page content, empty state, pre-population
2. **POST Route Tests** - Add document, remove document, validation, navigation

## Risks

1. Screen 34 route may not exist yet
2. Complex form state management with multiple documents

## Test Data

### Document Types
- contact-log, tenancy-agreement, correspondence, court-order, notice-to-tenant, proof-of-service, other

### Happy Path
- Add one document with type and description
- Add multiple documents

### Error Paths
- No document type selected
- No documents when required (Yes on Screen 32)
