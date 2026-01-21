# Test Suite

Comprehensive test suite for the HMCTS Possessions Prototype application.

## Test Coverage

### Public Routes
- ✅ Health check endpoint (`/health`)
- ✅ Access code gate (`/access`)
- ✅ Root redirect (`/`)

### Authentication Flow
- ✅ User type selection (`/select-user-type`)
- ✅ Sign-in (`/auth/sign-in`)
- ✅ Forgot password (`/auth/forgot-password`)
- ✅ Two-factor authentication (`/auth/one-time-code`)
- ✅ Sign out (`/sign-out`)

### Protected Routes
- ✅ Possessions landing page (`/possessions`)
- ✅ Case list dashboard (`/case-list`)

### Claims Journey (Current Flow)
- ✅ Start claim (`/claims/start`)
- ✅ Eligibility warning (`/claims/eligibility`)
- ✅ Border postcode (`/claims/border-postcode`)
- ✅ Claimant type (`/claims/claimant-type`)
  - ✅ Happy path: Registered provider → claim-type
  - ✅ Bad paths: Private landlord, mortgage lender, other → ineligible
- ✅ Claimant ineligible (`/claims/claimant-ineligible`)
- ✅ Claim type (`/claims/claim-type`)
  - ✅ Happy path: Not trespassers → name-of-claimant
  - ✅ Bad path: Trespassers → ineligible
- ✅ Claim type ineligible (`/claims/claim-type-ineligible`)
- ✅ Name of claimant (`/claims/name-of-claimant`) - placeholder

### Complete Journey Tests
- ✅ Full happy path (access → name-of-claimant)
- ✅ Claimant type ineligibility flows
- ✅ Trespasser claim ineligibility flow
- ✅ Session persistence
- ✅ Back navigation

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Test Structure

```
test/
├── setup.js              # Test configuration and environment setup
├── helpers/
│   └── sessionHelper.js  # Authentication and navigation helpers
└── routes/
    ├── access.test.js    # Access code gate tests
    ├── auth.test.js      # Authentication flow tests
    ├── userType.test.js  # User type selection tests
    ├── possessions.test.js # Landing pages tests
    ├── claims.test.js    # Individual claims route tests
    ├── journey.test.js   # End-to-end journey tests
    └── health.test.js    # Health check tests
```

## Test Patterns

### 1. Simple Route Test
```javascript
it('should return 200 status', async () => {
  const response = await request(app).get('/health');
  expect(response.status).toBe(200);
});
```

### 2. Form Validation Test
```javascript
it('should reject empty field', async () => {
  const response = await request(app)
    .post('/access')
    .send({ accessCode: '' });
  expect(response.text).toContain('Enter the access code');
});
```

### 3. Authenticated Request Test
```javascript
it('should access protected route', async () => {
  const testSession = session(app);
  await createAuthenticatedSession(testSession);
  const response = await testSession.get('/possessions');
  expect(response.status).toBe(200);
});
```

### 4. Complete Journey Test
```javascript
it('should complete full journey', async () => {
  const testSession = session(app);
  await testSession.post('/access').send({ accessCode: 'letmein' });
  await testSession.post('/select-user-type').send({ userType: 'professional' });
  // ... continue through all steps
});
```

## Helper Functions

### `createAuthenticatedSession(agent)`
Creates a fully authenticated session (access → user type → sign-in → 2FA).

### `createPartialAuthSession(agent)`
Creates a session up to sign-in step (before 2FA).

### `navigateToClaimsStep(agent, destination)`
Navigates to a specific point in the claims journey.

## Test Data

### Happy Path Values
- Access code: `letmein`
- User type: `professional`
- Email: `test@solicitor.com`
- Password: `password123`
- 2FA code: `123456` (any 6 digits accepted)
- Property location: `england` or `wales`
- Claimant type: `registered-provider`
- Claim type: `no` (not trespassers)

### Bad Path Values (Ineligibility)
- Claimant type: `private-landlord`, `mortgage-lender`, `other`
- Claim type: `yes` (trespassers)

## CI/CD Integration

Tests are run automatically in the GitHub Actions workflow:

```yaml
- name: Run tests
  run: npm test
```

## TODO: Future Tests

The following routes exist but are bypassed in the current journey.
They will need tests when re-implemented:

- [ ] `/claims/property-address`
- [ ] `/claims/claimant`
- [ ] `/claims/defendant`
- [ ] `/claims/grounds`
- [ ] `/claims/key-dates`
- [ ] `/claims/documents`
- [ ] `/claims/check-answers`
- [ ] `/claims/submit`
- [ ] `/claims/confirmation`

### Future Functionality Tests

- [ ] Case list filters (when implemented)
- [ ] Case list sorting (when implemented)
- [ ] Case list pagination (when implemented)
- [ ] Full claim submission with reference generation
- [ ] Document upload integration
- [ ] Address lookup integration
- [ ] Payment integration

## Notes

- All tests run in isolated environments with no shared state
- Sessions are cleared between tests
- This is a prototype application - auth is simulated
- No external dependencies are required for tests
- Coverage threshold: >70% on route files
