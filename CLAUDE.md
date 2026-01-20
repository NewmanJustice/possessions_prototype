# CLAUDE.md

You are Claude Code acting as a senior prototype engineer. Build a high-fidelity clickable web prototype for the HMCTS Possessions service “Make a claim” journey (professional user: Solicitor) using Node.js, Express, GOV.UK Frontend, and Nunjucks.

## Project Overview

### NON-NEGOTIABLES
- Single-app repo (not monorepo).
- Express + Nunjucks templates.
- GOV.UK Frontend for styling and components.
- Accessibility behaviours must follow GOV.UK Design System patterns (error summary, focus management, form validation messaging, etc.).
- Prototype-only: use fake data, no real PII, include a prominent PROTOTYPE banner on all pages.
- Must be deployable to Azure App Service (Linux, code-based) via GitHub Actions + Publish Profile secret, following this style:
  - app listens on process.env.PORT
  - workflow at repo root: .github/workflows/deploy.yml
  - uses azure/webapps-deploy@v3 with publish-profile secret
  - serves static assets correctly (avoid missing CSS MIME type issues). Guidance is available here: https://github.com/NewmanJustice/DeployingToAzure/pull/1

### SCOPE (Iteration 1)
1) Implement “Integration #1: IDAM sign-in / roles” only.
   - Start with a simple “Access code” gate page (like a wrapper) before the sign-in flow.
   - After correct access code, present a sign-in experience that mimics HMCTS IDAM look/flow as best you can WITHOUT knowing the exact IDAM UI. Use GOV.UK styling and a plausible “HMCTS Sign in” flow:
     - Page: “Sign in to HMCTS”
     - Inputs: Email + Password
     - Optional: “One-time code” step (2FA) (fake)
   - Roles: only one role for now: SOLICITOR. Store role in the server session.
   - Add route guards: anything under /claims/* requires authenticated session with role=SOLICITOR.

2) After sign-in, provide a service landing page:
   - “Possessions” landing page with “Start now” CTA to “Make a claim”.
   - Keep IA simple and realistic: header, breadcrumb where appropriate, user sign-out link.

3) Implement an end-to-end “Make a claim” journey for SOLICITOR (England standard possession claim) with:
   - Start point: signed in → service landing → start claim
   - End point: submission confirmation page with generated reference number
   - Keep version 1 to a single claimant and single defendant.

4) Business process diagram is available in the businessArtifacts directory.

5) Screens can be found at: https://www.figma.com/proto/MHSqNylYUQUmLbWCQeBHqq/HP---Claimant-journey-v5.0?page-id=0%3A1&node-id=1-17652&p=f&viewport=2351%2C4311%2C0.1&t=IZnoTjP3WLpxCKfQ-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A17652&show-proto-sidebar=1

### DATA & STATE (Iteration 1)
- Use server-side session persistence only (express-session) (prototype acceptable). No DB.
- Maintain a single “claimDraft” object in session. It should collect fields step-by-step and be shown in “Check your answers” summary before submit.
- Provide a simple service-layer structure so we can later evolve to a mock API without rewrite:
  - /src/services/claimService.js handles create/update/validate/submit for the claimDraft.
  - /src/integrations/* contains stubs for future integrations (address lookup, payments, document upload), but DO NOT implement them yet.

### INTEGRATION SEQUENCING
- Implement integrations one at a time. In this iteration ONLY implement IDAM simulation.
- Create feature flags (config-based) for future integrations:
  - FEATURE_ADDRESS_LOOKUP=false
  - FEATURE_PAYMENTS=false
  - FEATURE_DOCUMENT_UPLOAD=false
  Use them only to show placeholders (“This will be added in a later iteration”) without building the integration.

PAGES (Minimum set for Iteration 1)
A) Access wrapper
- GET/POST /access
  - Enter access code (single input)
  - Validate against env var ACCESS_CODE (fallback default “letmein” for local only)
  - On success redirect to /auth/sign-in

B) IDAM-like sign-in flow
- GET/POST /auth/sign-in (email + password)
- GET/POST /auth/one-time-code (can always accept any 6 digits)
- After success: set session.user = { email, role: "SOLICITOR" } and redirect to /possessions

C) Service landing
- GET /possessions
  - Copy: “Possessions”
  - CTA to start claim: /claims/start
  - Include “Sign out” link

D) Claim journey (simple, realistic, GOV.UK patterns)
- GET/POST /claims/start
  - Explain what you need to make a claim, “Start claim” button
- Claim type (pre-set England standard possession claim; present as a radio anyway)
  - /claims/claim-type (radio; default “Standard possession claim (England)”)
- Property details
  - /claims/property-address (manual entry for now; include a placeholder note re address lookup integration)
- Claimant details (single)
  - /claims/claimant (organisation name, reference, contact)
- Defendant details (single)
  - /claims/defendant (full name + address)
- Ground for claim (simple set; don’t overcomplicate)
  - /claims/grounds (radio/checkboxes with help text)
- Key dates (as needed)
  - /claims/key-dates (date inputs; validate day/month/year)
- Upload documents (NOT implemented; placeholder only)
  - /claims/documents shows feature-flag placeholder
- Check your answers
  - /claims/check-answers (GOV.UK summary list)
- Submit
  - POST /claims/submit (sets status “submitted”, generates ref like “PCS-ENG-XXXXXX”, stores confirmation timestamp)
- Confirmation
  - GET /claims/confirmation (reference number, what happens next)

### VALIDATION & ACCESSIBILITY REQUIREMENTS
- Use GOV.UK error summary component on validation failures.
- Set focus to the error summary on error.
- Inline error messages must be associated with fields (aria-describedby).
- Preserve entered values when validation fails.
- Use GOV.UK Frontend macros for inputs/radios/checkboxes/errorSummary/summaryList.
- Use proper page titles (“Error: … - Service name - GOV.UK” pattern).
- Include basic content design: concise, realistic, not lorem ipsum unless unavoidable.

### TECHNICAL REQUIREMENTS
- Node.js 20 compatible.
- Repo structure:
  /src
    /routes
    /controllers
    /services
    /integrations
    /views (nunjucks)
    /middleware
    app.js
  /public (static assets you control)
  package.json
  .github/workflows/deploy.yml
  README.md
  .gitignore

- GOV.UK Frontend setup:
  - Install govuk-frontend via npm.
  - Configure Nunjucks to load GOV.UK Frontend macros.
  - Serve GOV.UK Frontend assets (CSS/JS/fonts) via Express static routes so it works on Azure.
  - Include the standard GOV.UK layout with header/footer and a service name “Possessions Prototype”.

- Session & security (prototype):
  - express-session with MemoryStore is fine, but display PROTOTYPE warning.
  - Use helmet with relaxed CSP if needed for GOV.UK assets (keep simple).
  - No real auth; all fake.

### AZURE DEPLOYMENT REQUIREMENTS
- App MUST listen on process.env.PORT with fallback 3000.
- Create .github/workflows/deploy.yml that:
  - triggers on push to main and workflow_dispatch
  - uses actions/setup-node@v4 with node-version "20"
  - runs npm ci
  - runs npm test (if you include tests) or skip if none
  - runs npm run build --if-present
  - deploys package: .
  - uses azure/webapps-deploy@v3 with:
    - app-name: <AZURE_WEBAPP_NAME_PLACEHOLDER>
    - publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
- README must explain how to create the Azure Web App (placeholders ok) and how to set:
  - AZURE_WEBAPP_PUBLISH_PROFILE GitHub secret
  - AZURE_WEBAPP_NAME placeholder
  - ACCESS_CODE env var
  - NODE_ENV=production

### TESTING
- Add a minimal smoke test approach:
  - either supertest-based route tests for a couple pages, OR
  - a simple “npm run lint” + “npm test” that at least validates server starts.
Keep it lightweight.

### DELIVERABLES
1) Working app runnable locally:
   - npm install
   - npm run dev (nodemon) and npm start
2) Clickable end-to-end prototype for the above flow.
3) Deployed-ready workflow + README (placeholders for Azure names).
4) Prominent prototype banner + fake data warning.
5) Clean, readable code with comments where helpful.

### IMPLEMENT NOW
- Generate the full repo content described above.
- Provide the file tree.
- Provide key file contents (app.js, routes, views templates, workflow, README, package.json).
- Ensure GOV.UK styling actually loads locally and will load on Azure (static routes correct).
- Ensure all journey steps are connected with Back links and consistent navigation.

### DO NOT IMPLEMENT YET
- Address lookup integration
- Payments integration
- Document upload integration (just placeholder page)
- Multi-party, counterclaims, Welsh journey (out of scope for iteration 1)

# For additional context

## Deployment

### Deployment Approach
This application deploys to **Azure App Service (Linux, code-based)** using **GitHub Actions** with a Publish Profile. This approach avoids Docker, ACR, and container complexity, making it ideal for secured environments.

### Prerequisites
- Azure CLI installed and up to date:
  ```bash
  az version  # Check current version
  az upgrade  # Update if needed
  az login
  ```
- GitHub repo with Express app
- App must listen on `process.env.PORT` (already configured in server.js)

### Key Deployment Requirements
- `.github/workflows` must live at repo root
- Deploy subfolder (`prototype/`), not repo root, in monorepo setup
- Publish profile secret must be a repository secret
- Static assets must be explicitly served (already configured)

### Step-by-Step Azure Deployment

**1. Define Variables**
```bash
# Azure
RG="CFT-software-engineering"
LOCATION="uksouth"

# App Service
PLAN_NAME="hmctsdesignsystem-plan"
WEBAPP_NAME="hmctsdesignsystem-code"   # must be globally unique

# Runtime
RUNTIME="NODE:20-lts"

# Monorepo path (folder containing package.json)
APP_DIR="prototype"

# (Optional) Set subscription:
az account set --subscription <SUBSCRIPTION_ID>
```

**2. Create App Service Plan (Linux)**
```bash
az appservice plan create \
  --name "$PLAN_NAME" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --is-linux \
  --sku B1
```

**3. Create Code-Based Linux Web App (NOT container)**
```bash
az webapp create \
  --resource-group "$RG" \
  --plan "$PLAN_NAME" \
  --name "$WEBAPP_NAME" \
  --runtime "$RUNTIME"

# Verify it is not container-based
az webapp show \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG" \
  --query "{kind:kind, linuxFxVersion:siteConfig.linuxFxVersion}" \
  -o json
```
Expected: `kind` includes `app,linux` and `linuxFxVersion` is NOT `DOCKER|...`

**4. Enable SCM Basic Authentication**
⚠️ **Critical**: Without this step, you will get `401 Unauthorized` errors during deployment.
```bash
# Enable Basic Auth for SCM (deployment)
az resource update \
  --resource-group "$RG" \
  --name scm \
  --namespace Microsoft.Web \
  --resource-type basicPublishingCredentialsPolicies \
  --parent sites/"$WEBAPP_NAME" \
  --set properties.allow=true

# Enable Basic Auth for FTP
az resource update \
  --resource-group "$RG" \
  --name ftp \
  --namespace Microsoft.Web \
  --resource-type basicPublishingCredentialsPolicies \
  --parent sites/"$WEBAPP_NAME" \
  --set properties.allow=true
```

**5. Download Publish Profile**
⚠️ **Security**: DO NOT commit this file. Treat it like a password.
```bash
az webapp deployment list-publishing-profiles \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG" \
  --xml > publishProfile.xml
```

Add to `.gitignore`:
```bash
echo "publishProfile.xml" >> .gitignore
git add .gitignore
git commit -m "Ignore Azure publish profile"
```

Copy to clipboard (Mac):
```bash
pbcopy < publishProfile.xml
```

**6. Add Publish Profile to GitHub Secrets**
1. Go to Repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Value: paste the full XML content from publishProfile.xml

**7. GitHub Actions Workflow**
The workflow is already configured at `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Azure Web App

on:
  push:
    branches: ["main"]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: prototype/package-lock.json

      - name: Install dependencies
        working-directory: prototype
        run: npm ci

      - name: Build (if present)
        working-directory: prototype
        run: npm run build --if-present

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v3
        with:
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: prototype
```

Note: The `app-name` parameter is optional since the publish profile already contains this information.

**8. Enable and Monitor Logs**
```bash
# Enable application logging
az webapp log config \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG" \
  --application-logging filesystem

# Tail logs in real-time
az webapp log tail \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG"

# Restart app if needed
az webapp restart \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG"
```

**9. Verify Deployment**
```bash
# Check if app is running
az webapp show \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG" \
  --query "state" -o tsv

# Verify runtime configuration
az webapp show \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG" \
  --query "siteConfig.linuxFxVersion" -o tsv
```
Expected: `NODE|20-lts`

### Health Check
- Endpoint: `/health`
- Returns: `{"status": "healthy", "timestamp": "..."}`
- No authentication required
- Use this for Azure health probes and monitoring

### Troubleshooting
For detailed troubleshooting of common deployment issues (API version errors, 401 unauthorized, publish profile errors, missing environment variables, CSS/asset loading issues), see the comprehensive guide at:
**`DeployingToAzure/README.md`**

Common issues covered:
- Outdated Azure CLI causing API version errors
- Missing resource group in URI
- 401 Unauthorized during deployment (SCM auth not enabled)
- Invalid publish profile errors
- App crashes on startup due to missing environment variables
- CSS/static assets not loading (MIME type issues)

## Working with Features

When modifying routes or adding features:
1. All routes are in `server.js` - it's a single-file Express app
2. Add/modify templates in `views/` directory
3. Use Nunjucks macro imports from GOV.UK Frontend: `{% from "govuk/components/button/macro.njk" import govukButton %}`
4. Static assets go in `public/`
5. Database changes require manual SQLite schema updates (no migrations framework)
6. Always use parameterized queries (`?` placeholders) to prevent SQL injection
7. Audit log all admin data changes using the `logAuditEvent` helper

## Testing Notes

No automated test suite exists. Manual testing workflow:
1. Start server: `npm start`
2. Test public features at `http://localhost:3000/features`
3. Test admin at `http://localhost:3000/admin/login` (password: snowball)
4. Check database: `sqlite3 data/catalogue.db`

## Common Gotchas

- **Port conflicts**: Default port 3000, override with `PORT` env var
- **Missing database**: Run `npm run import` if catalogue.db doesn't exist (requires Catalogue.xlsx)
- **Node modules**: GOV.UK Frontend paths are served from node_modules, don't delete them in deployed environments
- **File uploads**: Uploads go to `uploads/` directory, cleaned up after processing
- **Nunjucks caching**: Set to `noCache: true` in development, consider enabling for production
