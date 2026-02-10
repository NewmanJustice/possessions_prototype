# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HMCTS Possessions Prototype - a high-fidelity clickable web prototype for solicitors making standard possession claims in England. Built with Node.js, Express, GOV.UK Frontend, and Nunjucks.

**Key constraint**: This is a prototype only - uses session storage (no database), fake authentication, and must display a prototype banner on all pages.

## Commands

```bash
# All commands run from /prototype directory
cd prototype

# Install dependencies
npm install

# Development (with auto-reload)
npm run dev

# Production
npm start

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint
```

## Architecture

```
prototype/
├── src/
│   ├── app.js                    # Express application entry
│   ├── routes/
│   │   ├── access.js             # Access code gate
│   │   ├── auth.js               # Sign-in, 2FA, sign-out
│   │   ├── possessions.js        # Service landing, case list
│   │   └── claims.js             # Claims journey (main routes)
│   ├── services/
│   │   └── claimService.js       # Claim data management & validation
│   ├── middleware/
│   │   └── auth.js               # Route guards (requireAuth, requireAccess)
│   └── views/
│       ├── layouts/main.njk      # Base layout with GOV.UK header/footer
│       └── pages/claims/*.njk    # 47 claim journey templates
├── test/
│   ├── setup.js                  # Jest configuration
│   ├── helpers/sessionHelper.js  # Auth/navigation test helpers
│   └── routes/*.test.js          # Integration tests (Jest + Supertest)
└── public/                       # Static assets
```

### Request Flow Pattern

```
HTTP Request → Route Handler → Middleware Guard → GET/POST Handler
   ↓
GET: claimService.getClaim() → Render Nunjucks template
POST: Validate → claimService.updateClaim() → Redirect (or re-render with errors)
```

### Session Structure

All claim data persists in `req.session.claimDraft`. Key session properties:
- `accessGranted` - Passed access code gate
- `userType` - 'professional' after user type selection
- `user` - `{ email, role: 'SOLICITOR' }` after auth
- `claimDraft` - Current claim data (property, claimant, defendant, grounds, etc.)
- `errors` / `values` - Form validation errors (cleared after render)

### Validation Pattern

```javascript
// In claimService.js validateStep()
const errors = [];
if (!field) {
  errors.push({ field: 'fieldName', message: 'Error message', href: '#fieldName' });
}

// In route handler
if (errors.length > 0) {
  req.session.errors = errors;
  req.session.values = req.body;
  return res.redirect(currentPath);  // Re-render with errors
}
claimService.updateClaim(req.session, 'section', data);
res.redirect(nextPath);
```

## Multi-Agent Workflow

This project uses a three-agent pipeline for implementing features:

1. **Cass** (Story Writer) - Creates user stories from rough requirements
2. **Nigel** (Tester) - Writes executable tests from user stories
3. **Claude** (Developer) - Implements code to pass tests

Run with: `/implement-feature {screenNumber}` (see `MULTI-AGENT-WORKFLOW.md`)

Agent instructions are in `agentinstructions/`:
- `AGENT_Developer.md` - Developer role, workflow, and principles
- `AGENT_TESTER.md` - Tester role and test patterns
- `AGENT_Cass.md` - Story writer role

## Adding a New Screen

1. Create template: `src/views/pages/claims/{screen-name}.njk`
2. Add GET/POST handlers in `src/routes/claims.js`
3. Add validation logic to `claimService.validateStep()` switch statement
4. Create test file: `test/routes/{screenName}.test.js`
5. Update navigation helpers if needed: `test/helpers/sessionHelper.js`

## Testing Patterns

Tests use `supertest-session` for session persistence across requests:

```javascript
const session = require('supertest-session');
const app = require('../../src/app');

it('should complete authenticated journey', async () => {
  const testSession = session(app);
  await createAuthenticatedSession(testSession);  // Helper in sessionHelper.js
  const response = await testSession.get('/claims/start');
  expect(response.status).toBe(200);
});
```

Test data for happy paths:
- Access code: `letmein`
- User type: `professional`
- Any email/password accepted
- Any 6-digit 2FA code accepted

## GOV.UK Frontend Usage

Templates use Nunjucks macros from GOV.UK Frontend:

```nunjucks
{% from "govuk/components/button/macro.njk" import govukButton %}
{% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %}
{% from "govuk/components/radios/macro.njk" import govukRadios %}

{{ govukButton({ text: "Continue" }) }}
```

Error handling follows GOV.UK patterns:
- Error summary at page top with links to fields
- Inline errors on fields with `aria-describedby`
- Focus moves to error summary on validation failure
- Page title prefixed with "Error: " when errors present

## Environment Variables

```env
PORT=3000
NODE_ENV=development
ACCESS_CODE=letmein
SESSION_SECRET=your-secret
FEATURE_ADDRESS_LOOKUP=false    # Future integration flags
FEATURE_PAYMENTS=false
FEATURE_DOCUMENT_UPLOAD=false
```

## Deployment

Deploys to Azure App Service via GitHub Actions (`.github/workflows/deploy.yml`). See `prototype/README.md` for Azure setup instructions.

Health check endpoint: `GET /health` (no auth required)
