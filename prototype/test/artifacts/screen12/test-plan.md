# Screen 12: Tenancy or Licence Details - Test Plan

## Scope

### In Scope
- GET `/claims/tenancy` - Page rendering and content
- POST `/claims/tenancy` - Form submission and validation
- Tenancy type radio selection and validation
- "Other" conditional reveal field
- Optional date validation (partial vs complete)
- Simulated file upload UI and metadata storage
- File removal functionality
- **Grounds model determination** (AC-13, AC-14, AC-15)
- **State clearing on tenancy change** (AC-16)
- **Conditional routing based on groundsModel**
- Navigation (Previous, Continue, Cancel)
- GOV.UK error summary and inline error display
- Focus management on validation failure

### Out of Scope
- Actual file upload/storage
- File content validation
- Multiple tenancy records

## Types of Tests

| Type | Purpose |
|------|---------|
| Integration | Route behaviour, session handling, redirects |
| Validation | Input validation for type, date, uploads |
| State | Session data persistence, file metadata storage, groundsModel determination |
| Navigation | Previous/Continue/Cancel link behaviour |
| Conditional | "Other" field reveal, date field interaction |
| Boundary | Date year limits (1800-2100) |
| Mapping | Tenancy type to groundsModel mapping verification |
| Routing | Conditional redirects based on groundsModel |
| State Clearing | Incompatible grounds data clearing on tenancy change |

## Risks and Constraints

| Risk | Mitigation |
|------|------------|
| File upload simulation complexity | Test UI presence and metadata only |
| Date validation edge cases | Test partial dates and year boundaries |
| Conditional reveal timing | Test field presence in HTML |
| groundsModel mapping accuracy | Test all 6 tenancy types map correctly |
| State clearing logic complexity | Test transitions between all groundsModel combinations |
| Routing to unimplemented screens | Use placeholder routes for SECURE_LIKE and OTHER_UNSUPPORTED |

## Test Environment

- **Framework**: Jest + Supertest + supertest-session
- **Session setup**: Extend `sessionHelper.js` with `navigateToTenancy()`
- **Fixtures**: Defendant details must be completed before tests

## Assumptions for Testing

1. Previous page: `/claims/defendant-details`
2. Next page: **Conditional based on groundsModel**:
   - ASSURED → `/claims/grounds-for-possession-assured`
   - SECURE_LIKE → `/claims/grounds-for-possession-secure-flexible`
   - OTHER_UNSUPPORTED → `/claims/grounds-for-possession-intro-demoted-other`
3. Tenancy type values: `assured-tenancy`, `secure-tenancy`, `introductory-tenancy`, `flexible-tenancy`, `demoted-tenancy`, `other`
4. Date stored as object: `{ day, month, year }`
5. Documents stored as array: `[{ id, name, uploadedAt }]`
6. File upload is simulated via form field
7. groundsModel values: `ASSURED`, `SECURE_LIKE`, `OTHER_UNSUPPORTED`
8. Mapping is deterministic and cannot be overridden by user
9. State clearing only affects incompatible grounds data when groundsModel changes
