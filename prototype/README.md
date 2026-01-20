# HMCTS Possessions Prototype

A high-fidelity clickable web prototype for the HMCTS Possessions service "Make a claim" journey for solicitors.

## Overview

This prototype demonstrates the end-to-end journey for a solicitor making a standard possession claim in England through the HMCTS digital service. Built with Node.js, Express, GOV.UK Frontend, and Nunjucks.

**⚠️ IMPORTANT: This is a prototype only. Do not enter real personal information. All data is fake and stored in session only.**

## Features

### Iteration 1 - Implemented

- ✅ **Access code gate** - Prototype access control
- ✅ **IDAM-like authentication** - Sign in flow with email, password, and one-time code (2FA simulation)
- ✅ **Role-based access** - SOLICITOR role with route guards
- ✅ **Service landing page** - Possessions service home with "Start now" button
- ✅ **Complete claim journey**:
  - Claim type selection (Standard possession claim - England)
  - Property address (manual entry)
  - Claimant details (organisation, reference, contact)
  - Defendant details (single defendant)
  - Grounds for possession (rent arrears, anti-social behaviour, breach of tenancy, property damage, end of fixed-term)
  - Key dates (tenancy start, notice served, notice expiry)
  - Documents (placeholder only)
  - Check your answers
  - Submit and confirmation
- ✅ **Validation** - GOV.UK error patterns with error summary and inline errors
- ✅ **Accessibility** - Focus management, aria-describedby, proper page titles
- ✅ **Prototype banner** - Prominent warning on all pages
- ✅ **Feature flags** - Config-based flags for future integrations

### Future Iterations (Not Implemented)

- ❌ Address lookup integration
- ❌ Payments integration
- ❌ Document upload functionality
- ❌ Multiple parties (claimants/defendants)
- ❌ Welsh language journey

## Tech Stack

- **Node.js 20** - Runtime environment
- **Express 4** - Web framework
- **Nunjucks 3** - Templating engine
- **GOV.UK Frontend 5** - Design system components and styles
- **express-session** - Session management (memory store)
- **Helmet** - Security headers
- **dotenv** - Environment configuration

## Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

## Local Development Setup

### 1. Clone and Install

```bash
cd prototype
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```env
PORT=3000
NODE_ENV=development
ACCESS_CODE=letmein
SESSION_SECRET=your-random-secret-here
FEATURE_ADDRESS_LOOKUP=false
FEATURE_PAYMENTS=false
FEATURE_DOCUMENT_UPLOAD=false
```

### 3. Run the Application

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The application will be available at: `http://localhost:3000`

### 4. Access the Prototype

1. Navigate to `http://localhost:3000`
2. Enter access code: `letmein` (or your configured code)
3. Sign in with any email and password
4. Enter any 6-digit code for 2FA
5. Start making a claim

## Project Structure

```
prototype/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Azure deployment workflow
├── public/
│   ├── css/
│   │   └── custom.css          # Custom styles
│   ├── js/                     # Custom JavaScript (empty)
│   └── images/                 # Images (empty)
├── src/
│   ├── integrations/           # Integration stubs
│   │   ├── addressLookup.js
│   │   ├── payments.js
│   │   └── documentUpload.js
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── routes/
│   │   ├── access.js           # Access code gate
│   │   ├── auth.js             # Sign-in routes
│   │   ├── possessions.js      # Service landing
│   │   └── claims.js           # Claims journey
│   ├── services/
│   │   └── claimService.js     # Claim data management
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.njk        # Main layout template
│   │   └── pages/              # Page templates
│   │       ├── access/
│   │       ├── auth/
│   │       ├── possessions/
│   │       └── claims/
│   └── app.js                  # Express application
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## User Journey

```
1. Access code gate (/access)
   ↓
2. Sign in (/auth/sign-in)
   ↓
3. One-time code (/auth/one-time-code)
   ↓
4. Service landing (/possessions)
   ↓
5. Start claim (/claims/start)
   ↓
6. Claim type (/claims/claim-type)
   ↓
7. Property address (/claims/property-address)
   ↓
8. Claimant details (/claims/claimant)
   ↓
9. Defendant details (/claims/defendant)
   ↓
10. Grounds for possession (/claims/grounds)
    ↓
11. Key dates (/claims/key-dates)
    ↓
12. Documents placeholder (/claims/documents)
    ↓
13. Check your answers (/claims/check-answers)
    ↓
14. Confirmation (/claims/confirmation)
```

## Azure Deployment

### Prerequisites

- Azure CLI installed and up to date
- Azure subscription with access to create resources
- GitHub repository

### 1. Create Azure Resources

**Define variables:**

```bash
RG="CFT-software-engineering"
LOCATION="uksouth"
PLAN_NAME="hmcts-possessions-plan"
WEBAPP_NAME="hmcts-possessions-prototype"  # Must be globally unique
RUNTIME="NODE:20-lts"
```

**Create App Service Plan:**

```bash
az appservice plan create \
  --name "$PLAN_NAME" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --is-linux \
  --sku B1
```

**Create Web App:**

```bash
az webapp create \
  --resource-group "$RG" \
  --plan "$PLAN_NAME" \
  --name "$WEBAPP_NAME" \
  --runtime "$RUNTIME"
```

### 2. Enable Basic Authentication

**Critical step to avoid 401 errors:**

```bash
# Enable SCM basic auth
az resource update \
  --resource-group "$RG" \
  --name scm \
  --namespace Microsoft.Web \
  --resource-type basicPublishingCredentialsPolicies \
  --parent sites/"$WEBAPP_NAME" \
  --set properties.allow=true

# Enable FTP basic auth
az resource update \
  --resource-group "$RG" \
  --name ftp \
  --namespace Microsoft.Web \
  --resource-type basicPublishingCredentialsPolicies \
  --parent sites/"$WEBAPP_NAME" \
  --set properties.allow=true
```

### 3. Download Publish Profile

```bash
az webapp deployment list-publishing-profiles \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG" \
  --xml > publishProfile.xml
```

**⚠️ Security: DO NOT commit this file. It's already in .gitignore**

### 4. Configure GitHub Secrets

1. Copy the contents of `publishProfile.xml`
2. Go to your GitHub repository → Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: Paste the XML content
6. Click "Add secret"

### 5. Update Workflow

Edit `.github/workflows/deploy.yml` and replace:

```yaml
app-name: <AZURE_WEBAPP_NAME_PLACEHOLDER>
```

with your actual app name:

```yaml
app-name: hmcts-possessions-prototype
```

### 6. Configure Azure Environment Variables

```bash
az webapp config appsettings set \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG" \
  --settings \
    NODE_ENV=production \
    ACCESS_CODE=your-secure-code-here \
    SESSION_SECRET=your-random-secret-here \
    FEATURE_ADDRESS_LOOKUP=false \
    FEATURE_PAYMENTS=false \
    FEATURE_DOCUMENT_UPLOAD=false
```

### 7. Deploy

Push to the `main` branch or trigger workflow manually:

```bash
git add .
git commit -m "Configure Azure deployment"
git push origin main
```

Or trigger manually in GitHub Actions UI.

### 8. Verify Deployment

```bash
# Check app status
az webapp show \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG" \
  --query "state" -o tsv

# View logs
az webapp log tail \
  --name "$WEBAPP_NAME" \
  --resource-group "$RG"
```

Access your app at: `https://<WEBAPP_NAME>.azurewebsites.net`

## Health Check

The application includes a health check endpoint:

- **URL:** `/health`
- **Method:** GET
- **Auth:** Not required
- **Response:** `{"status": "healthy", "timestamp": "..."}`

Use this for Azure health probes and monitoring.

## Session Management

- **Store:** In-memory (MemoryStore)
- **Duration:** 24 hours
- **Security:** HttpOnly cookies, secure in production
- **Limitation:** Sessions are lost on server restart

**Note:** This is acceptable for prototypes. Production services should use Redis or similar.

## Security Considerations

This is a prototype with simulated security:

- ✅ Helmet for security headers
- ✅ HttpOnly session cookies
- ✅ HTTPS enforced in production
- ✅ Input validation and sanitization
- ⚠️ No real authentication (all fake)
- ⚠️ In-memory session store (not scalable)
- ⚠️ Relaxed CSP for GOV.UK assets

## Feature Flags

Control future integrations via environment variables:

- `FEATURE_ADDRESS_LOOKUP` - Address lookup integration (default: false)
- `FEATURE_PAYMENTS` - Payment processing (default: false)
- `FEATURE_DOCUMENT_UPLOAD` - Document upload (default: false)

When false, placeholder messages are shown to users.

## Troubleshooting

### Port already in use

```bash
# Change port in .env
PORT=3001
```

### CSS not loading

Ensure GOV.UK Frontend assets are served correctly. Check:

```javascript
// In app.js
app.use('/govuk/assets', express.static(path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk/assets')));
```

### Session not persisting

In development, sessions are cleared on server restart (MemoryStore). This is expected behaviour.

### Azure deployment fails with 401

Enable basic authentication for SCM (see step 2 in Azure Deployment).

### App crashes on Azure

Check application logs:

```bash
az webapp log tail --name "$WEBAPP_NAME" --resource-group "$RG"
```

Common issues:
- Missing environment variables
- Wrong Node.js version
- Port not set to `process.env.PORT`

## Support

For issues with this prototype, contact the HMCTS design team.

## License

MIT
