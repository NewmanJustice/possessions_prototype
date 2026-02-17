# Copilot Instructions for HMCTS Possessions Prototype

## Build, Test, and Lint Commands

- All commands must be run from the `/prototype` directory.
- Install dependencies: `npm install`
- Start development server (auto-reload): `npm run dev`
- Start production server: `npm start`
- Lint code: `npm run lint`
- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Run tests with coverage: `npm run test:coverage`
- Run a single test file: `npm test -- test/routes/<file>.test.js`

## High-Level Architecture

- **Node.js/Express web app** using GOV.UK Frontend and Nunjucks templates.
- **Session-based prototype**: No database, all data stored in `req.session`.
- **Key directories:**
  - `src/routes/` — Route handlers for access, authentication, possessions, claims
  - `src/services/claimService.js` — Claim data management and validation
  - `src/middleware/auth.js` — Route guards for access, user type, authentication, and role
  - `src/views/` — Nunjucks templates (layouts, pages, claims journey)
  - `test/` — Jest + Supertest integration tests, helpers, and setup
  - `public/` — Static assets
- **Request flow:**
  - HTTP request → Route handler → Middleware guard → GET/POST handler
  - GET: `claimService.getClaim()` → Render Nunjucks template
  - POST: Validate → `claimService.updateClaim()` → Redirect or re-render with errors
- **Session structure:**
  - `accessGranted`, `userType`, `user`, `claimDraft`, `errors`, `values` stored in session
- **Validation pattern:**
  - Validation errors are pushed to `req.session.errors` and form values to `req.session.values`, then redirect to re-render with errors
- **Prototype banner:**
  - All pages must display a prominent prototype warning

## Key Conventions

- **Fake authentication:** Any email/password and any 6-digit 2FA code accepted
- **Session-only storage:** All claim data is lost on server restart
- **GOV.UK error handling:** Error summary at top, inline errors, focus moves to error summary, page title prefixed with "Error: " when errors present
- **Feature flags:** Controlled via environment variables (`FEATURE_ADDRESS_LOOKUP`, `FEATURE_PAYMENTS`, `FEATURE_DOCUMENT_UPLOAD`)
- **Multi-agent workflow:** Feature implementation uses Cass (story), Nigel (tests), Claude (code) pipeline; see `MULTI-AGENT-WORKFLOW.md` and `agentinstructions/`
- **Adding screens:** Create Nunjucks template, add route handler, update validation, add test file, update navigation helpers if needed
- **Testing:** Use `supertest-session` for session persistence; helpers in `test/helpers/sessionHelper.js`
- **Health check endpoint:** `GET /health` (no auth required)

## Integration with Other AI Assistant Configs

- **Claude/OpenCode:** See `CLAUDE.md` for detailed agent instructions and conventions

---

This file summarizes build/test/lint commands, architecture, and key conventions for Copilot and other AI assistants. If you want to adjust instructions or add coverage for areas I may have missed, let me know.
