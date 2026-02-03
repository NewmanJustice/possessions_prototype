# Screen 37: Statement of Truth - Implementation Plan

## Overview

**Screen Number:** 37
**Route:** `/claims/statement-of-truth`
**Previous Screen:** Screen 36 (`/claims/completing-your-claim`)
**Next Screen:** Screen 38 (`/claims/check-your-answers`)

## Understanding

This screen captures acknowledgement of the statement of truth and identifies who is completing the statement (Claimant or Legal Representative). This is a critical legal step required by Civil Procedure Rules before claim submission.

### Key Behaviours
- Display page heading "Statement of truth" (NO caption on this screen)
- Display case number
- Display contempt of court warning text
- Radio selection for "Completed by" (Claimant or Legal Representative)
- Validation: Selection is required
- Session persistence of selection
- Navigation: Previous, Continue, Cancel

## Impact Analysis

### Files to Modify
1. **`prototype/src/routes/claims.js`** - Add GET and POST handlers for `/claims/statement-of-truth`
2. **`prototype/src/services/claimService.js`** - Add validation case for `statement-of-truth` step

### Files to Create
1. **`prototype/src/views/pages/claims/statement-of-truth.njk`** - Template for the screen

## Implementation Plan

### Step 1: Add Validation Logic

Add a new case to the `validateStep()` function in `claimService.js`:

```javascript
case 'statement-of-truth': {
  if (!data.completedBy) {
    errors.push({
      field: 'completedBy',
      message: 'Select who completed this statement',
      href: '#completedBy'
    });
  }
  break;
}
```

### Step 2: Add Route Handlers

Add GET and POST handlers in `claims.js` after the Screen 36 handlers:

**GET handler:**
- Retrieve claim from session
- Get stored `completedBy` value from `claim.statementOfTruth.completedBy`
- Handle flash errors and values
- Render template with claim data

**POST handler:**
- Handle `action: 'previous'` -> redirect to `/claims/completing-your-claim`
- Handle `action: 'cancel'` -> redirect to `/case-list`
- Validate `completedBy` field
- On validation error: redirect back (PRG pattern)
- On success: store in session and redirect to `/claims/check-your-answers`

### Step 3: Create Template

Create `statement-of-truth.njk` with:
- Page title: "Statement of truth" (with "Error: " prefix when errors)
- NO caption (unlike other screens)
- Case number display
- Statement of truth paragraph
- Radio buttons with "Completed by" legend
- Button group: Previous (secondary), Continue (primary)
- Cancel link

## Template Structure

```nunjucks
{% extends "layouts/main.njk" %}

{% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %}
{% from "govuk/components/radios/macro.njk" import govukRadios %}
{% from "govuk/components/button/macro.njk" import govukButton %}

{% block pageTitle -%}
  {% if errorList and errorList.length > 0 %}Error: {% endif %}Statement of truth - {{ serviceName }} - GOV.UK
{%- endblock %}

{% block content %}
  <!-- Error summary if validation fails -->
  <!-- Page heading (no caption) -->
  <!-- Case number -->
  <!-- Statement text paragraph -->
  <!-- Form with radio buttons -->
  <!-- Button group and cancel link -->
{% endblock %}
```

## Session Data Structure

```javascript
req.session.claimDraft.statementOfTruth = {
  completedBy: 'claimant' | 'legal-representative'
}
```

## Test Coverage

Tests are in `prototype/test/routes/statementOfTruth.test.js` covering:
- AC-1: Page heading and case number display
- AC-2: Statement of truth text display
- AC-3: Radio options display and values
- AC-4: Validation (required selection)
- AC-5: Session persistence
- AC-6: Pre-selection on revisit
- AC-7: Previous navigation
- AC-8: Continue navigation
- AC-9: Cancel behaviour
- AC-10: Accessibility compliance
- AC-11: Error state page title

## Implementation Notes

1. **Form field name:** `completedBy`
2. **Radio values:** `claimant` and `legal-representative` (lowercase kebab-case)
3. **Error href:** `#completedBy` for accessibility
4. **No caption:** This screen does NOT have the "Make a claim" caption
5. **Statement text:** Must include exact contempt of court text
6. **CPR reference:** Legal representative option must include "(as defined by CPR 2.3 (1))"

## Verification

After implementation:
```bash
cd prototype && npm test -- --testPathPattern="statementOfTruth" --forceExit
```

All 23 tests should pass.
