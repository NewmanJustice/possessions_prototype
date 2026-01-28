# Screen 26c Implementation Plan

## Summary

- **Screen title:** Housing Act (Demotion of tenancy)
- **Purpose:** Allow solicitors to specify which Housing Act applies for a demotion of tenancy, recording the legal basis for the demotion order request
- **Route:** GET/POST `/claims/select-housing-act-demotion`
- **Entry condition:** User selected "Demotion of tenancy" on Screen 26 (`/claims/alternative-to-possession`)

---

## Understanding

### Key Behaviours from User Story

1. **Page Content:**
   - Display heading "Housing Act"
   - Display guidance explaining the user should select the relevant Housing Act for the demotion order request

2. **Radio Selection:**
   - Display question "Which Housing Act does the demotion order relate to?"
   - Two radio options only (no "Other" option):
     - Housing Act 1985 (section 82A)
     - Housing Act 1996 (section 143A)

3. **Validation:**
   - Selection is required
   - Error message: "Select the Housing Act"
   - GOV.UK error summary and inline error patterns

4. **Session Persistence:**
   - Store selection in `session.claim.demotionOrder.housingAct`
   - Values: `housing-act-1985-section-82a` or `housing-act-1996-section-143a`
   - Pre-populate on revisit

5. **Navigation:**
   - Previous: `/claims/alternative-to-possession` (no validation required)
   - Continue: `/claims/statement-of-express-terms` (requires valid selection)
   - Cancel: `/case-list`

### Test Count and Coverage Areas

**Total: 28 tests** across 9 acceptance criteria:

| AC | Description | Test Count |
|----|-------------|------------|
| AC-1 | Display page heading and guidance | 3 |
| AC-2 | Display Housing Act selection | 5 |
| AC-3 | Housing Act selection is required | 4 |
| AC-4 | Persist Housing Act selection | 4 |
| AC-5 | Preserve selection on revisit | 3 |
| AC-6 | Previous navigation | 2 |
| AC-7 | Continue navigation | 2 |
| AC-8 | Cancel behaviour | 1 |
| AC-9 | Accessibility compliance | 4 |

---

## Files to Create/Modify

### Files to Modify

| File | Changes |
|------|---------|
| `prototype/src/routes/claims.js` | Add GET and POST handlers for `/claims/select-housing-act-demotion` |

### Files to Create

| File | Purpose |
|------|---------|
| `prototype/src/views/pages/claims/select-housing-act-demotion.njk` | Nunjucks template with GOV.UK radios, error handling, navigation buttons |

### Dependencies (May Already Exist)

| File | Check |
|------|-------|
| `prototype/test/helpers/sessionHelper.js` | `navigateToSelectHousingActDemotion` helper - ALREADY EXISTS |
| Screen 26 route | Must redirect to Screen 26c when demotion selected - UPDATE NEEDED |
| Screen 26d placeholder | `/claims/statement-of-express-terms` - CREATE PLACEHOLDER |

---

## Implementation Steps

### Step 1: Update Screen 26 POST handler
**File:** `prototype/src/routes/claims.js`

Update the existing placeholder POST handler for `/claims/alternative-to-possession` to redirect to `/claims/select-housing-act-demotion` when demotion of tenancy is selected.

### Step 2: Create GET route handler
**File:** `prototype/src/routes/claims.js`

Add GET handler for `/claims/select-housing-act-demotion`:
- Read `session.claim.demotionOrder.housingAct` for pre-population
- Render template with `selectedHousingAct` value

### Step 3: Create POST route handler
**File:** `prototype/src/routes/claims.js`

Add POST handler for `/claims/select-housing-act-demotion`:
1. Handle `action: 'previous'` - redirect to `/claims/alternative-to-possession`
2. Handle `action: 'cancel'` - redirect to `/case-list`
3. Validate `demotionHousingAct` field (required)
4. On validation error - re-render with error state
5. On success - save to `session.claim.demotionOrder.housingAct` and redirect to `/claims/statement-of-express-terms`

### Step 4: Create Nunjucks template
**File:** `prototype/src/views/pages/claims/select-housing-act-demotion.njk`

Create template following existing patterns:
- Extend `layouts/main.njk`
- Import GOV.UK macros (error-summary, radios, button)
- Error summary with `tabindex="-1"` for focus management
- H1 heading: "Housing Act"
- Guidance paragraph
- Radio group with two options (checked based on `selectedHousingAct`)
- Button group: Continue, Previous, Cancel

### Step 5: Create Screen 26d placeholder route
**File:** `prototype/src/routes/claims.js`

Add placeholder GET/POST handlers for `/claims/statement-of-express-terms` to enable navigation testing.

### Step 6: Run tests and verify
Run `npm test -- --testPathPattern=selectHousingActDemotion` to verify all 28 tests pass.

### Step 7: Run linter
Run `npm run lint` to ensure code quality.

---

## Session Data

### Session Keys to Read

| Key Path | Type | Purpose |
|----------|------|---------|
| `session.claim.demotionOrder.housingAct` | string | Pre-populate radio selection |

### Session Keys to Write

| Key Path | Type | Values |
|----------|------|--------|
| `session.claim.demotionOrder` | object | Container for demotion order data |
| `session.claim.demotionOrder.housingAct` | string | `housing-act-1985-section-82a` or `housing-act-1996-section-143a` |

### Session Structure Example

```javascript
session.claim = {
  // ... other claim data
  demotionOrder: {
    housingAct: 'housing-act-1985-section-82a'
  }
}
```

---

## Validation Rules

| Field | Rule | Error Message | Error Target |
|-------|------|---------------|--------------|
| `demotionHousingAct` | Required (non-empty) | "Select the Housing Act" | `#demotionHousingAct` |

### Validation Logic

```javascript
function validateSelectHousingActDemotion(body) {
  const errors = [];

  if (!body.demotionHousingAct) {
    errors.push({
      field: 'demotionHousingAct',
      href: '#demotionHousingAct',
      text: 'Select the Housing Act'
    });
  }

  return errors;
}
```

---

## Template Components

### GOV.UK Components Needed

| Component | Purpose |
|-----------|---------|
| `govukErrorSummary` | Display validation errors at top of page |
| `govukRadios` | Radio button group for Housing Act selection |
| `govukButton` | Navigation buttons (Continue, Previous, Cancel) |

### Radio Options Configuration

```javascript
items: [
  {
    value: "housing-act-1985-section-82a",
    text: "Housing Act 1985 (section 82A)",
    checked: selectedHousingAct === 'housing-act-1985-section-82a'
  },
  {
    value: "housing-act-1996-section-143a",
    text: "Housing Act 1996 (section 143A)",
    checked: selectedHousingAct === 'housing-act-1996-section-143a'
  }
]
```

### Error Handling

1. **Error Summary:**
   - Display at top of page when validation fails
   - Include `tabindex="-1"` for programmatic focus
   - Link to `#demotionHousingAct`

2. **Inline Error:**
   - Display within radio group using `errorMessage` property
   - Standard GOV.UK error styling

---

## Risks / Questions

### Risks

1. **Screen 26 placeholder update required:** The current Screen 26 POST handler redirects to `/claims/check-answers`. It needs to be updated to redirect to Screen 26c when demotion is selected. This may require checking entry conditions or coordinating with Screen 26 implementation.

2. **Screen 26d does not exist:** The continue route (`/claims/statement-of-express-terms`) does not exist. A placeholder must be created for tests to pass.

3. **Session namespace:** Using `demotionOrder` vs `suspensionOrder` (from Screen 26a). Ensure correct namespace is used throughout.

### Questions

1. **Q:** What happens if user navigates directly to Screen 26c without selecting demotion on Screen 26?
   - **Assumption:** Tests use `navigateToSelectHousingActDemotion` which sets up correct state. No guard is required for prototype.

2. **Q:** Should Screen 26 be fully implemented before Screen 26c?
   - **Assumption:** The test helper already handles navigation through Screen 26 with demotion selection. A minimal Screen 26 POST update should suffice.

---

## Definition of Done

- [ ] All 28 tests passing (`npm test -- --testPathPattern=selectHousingActDemotion`)
- [ ] Lint passing (`npm run lint`)
- [ ] Route accessible at `/claims/select-housing-act-demotion`
- [ ] Previous navigation working (redirects to `/claims/alternative-to-possession`)
- [ ] Continue navigation working (redirects to `/claims/statement-of-express-terms`)
- [ ] Cancel navigation working (redirects to `/case-list`)
- [ ] Session persistence working (both Housing Act options)
- [ ] Pre-population working on revisit
- [ ] Error handling follows GOV.UK patterns
- [ ] No new lint warnings introduced

---

## Reference Files

| File | Purpose |
|------|---------|
| `/workspaces/possessions_prototype/businessArtifacts/userstories/screen26c.txt` | User story and acceptance criteria |
| `/workspaces/possessions_prototype/prototype/test/routes/selectHousingActDemotion.test.js` | Executable tests (28 tests) |
| `/workspaces/possessions_prototype/prototype/test/artifacts/screen26c/implementation-guide.md` | Detailed implementation guidance |
| `/workspaces/possessions_prototype/prototype/src/views/pages/claims/claimants-circumstances.njk` | Template pattern reference |
| `/workspaces/possessions_prototype/prototype/test/helpers/sessionHelper.js` | Navigation helper reference |

---

*Plan created by Claude (Developer Agent) on 2026-01-28 for Screen 26c implementation.*
