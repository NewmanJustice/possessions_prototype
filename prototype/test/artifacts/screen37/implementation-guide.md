# Screen 37: Statement of Truth - Implementation Guide

## Overview

This document provides guidance for Claude (Developer) to implement Screen 37 based on the test specifications.

## Route Configuration

```javascript
// In src/routes/claims.js

// GET handler
router.get('/statement-of-truth', requireAuth, (req, res) => {
  const claim = claimService.getClaim(req.session);
  const errors = req.session.errors || [];
  const values = req.session.values || {};

  // Clear flash data
  delete req.session.errors;
  delete req.session.values;

  res.render('pages/claims/statement-of-truth', {
    claim,
    errors,
    values,
    completedBy: claim.statementOfTruth?.completedBy || values.completedBy
  });
});

// POST handler
router.post('/statement-of-truth', requireAuth, (req, res) => {
  const { action, completedBy } = req.body;

  // Handle Previous
  if (action === 'previous') {
    return res.redirect('/claims/completing-your-claim');
  }

  // Handle Cancel
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validation
  const errors = claimService.validateStep('statement-of-truth', req.body);
  if (errors.length > 0) {
    req.session.errors = errors;
    req.session.values = req.body;
    return res.redirect('/claims/statement-of-truth');
  }

  // Update session
  claimService.updateClaim(req.session, 'statementOfTruth', {
    completedBy: completedBy
  });

  // Continue to next screen
  res.redirect('/claims/check-your-answers');
});
```

## Validation Logic

```javascript
// In src/services/claimService.js validateStep() switch statement

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

## Template Structure

File: `src/views/pages/claims/statement-of-truth.njk`

```nunjucks
{% extends "layouts/main.njk" %}

{% from "govuk/components/radios/macro.njk" import govukRadios %}
{% from "govuk/components/button/macro.njk" import govukButton %}
{% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %}

{% set pageTitle = "Statement of truth" %}
{% if errors.length %}
  {% set pageTitle = "Error: " + pageTitle %}
{% endif %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">

      {% if errors.length %}
        {{ govukErrorSummary({
          titleText: "There is a problem",
          errorList: errors | map(error => { text: error.message, href: error.href })
        }) }}
      {% endif %}

      <h1 class="govuk-heading-l">Statement of truth</h1>

      <p class="govuk-body">Case number: {{ claim.caseNumber }}</p>

      <p class="govuk-body">
        I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.
      </p>

      <form method="post" novalidate>
        {{ govukRadios({
          name: "completedBy",
          fieldset: {
            legend: {
              text: "Completed by",
              isPageHeading: false,
              classes: "govuk-fieldset__legend--m"
            }
          },
          items: [
            {
              value: "claimant",
              text: "Claimant",
              checked: completedBy == "claimant"
            },
            {
              value: "legal-representative",
              text: "Claimant's legal representative (as defined by CPR 2.3 (1))",
              checked: completedBy == "legal-representative"
            }
          ],
          errorMessage: errors | selectattr("field", "equalto", "completedBy") | first | attr("message") | default(undefined) | iif({ text: _ }, undefined)
        }) }}

        <div class="govuk-button-group">
          {{ govukButton({
            name: "action",
            value: "previous",
            text: "Previous",
            classes: "govuk-button--secondary"
          }) }}
          {{ govukButton({
            text: "Continue"
          }) }}
        </div>

        <p class="govuk-body">
          <a href="/case-list" class="govuk-link">Cancel</a>
        </p>
      </form>

    </div>
  </div>
{% endblock %}
```

## Session Data Structure

```javascript
// After successful submission, session will contain:
req.session.claimDraft.statementOfTruth = {
  completedBy: 'claimant' // or 'legal-representative'
}
```

## Test Data Requirements

The navigation helper `navigateToStatementOfTruth` should:
1. Call `navigateToCompletingYourClaim(agent)`
2. POST to `/claims/completing-your-claim` with `{ completionPreference: 'submit-now' }`
3. This establishes session state needed for Screen 37

## Key Implementation Notes

1. **Form field name**: Must be `completedBy` to match validation and session storage
2. **Radio values**: Must be exactly `claimant` and `legal-representative` (lowercase kebab-case)
3. **Error href**: Must be `#completedBy` for accessibility link targeting
4. **Page title**: Must be prefixed with "Error: " when validation fails
5. **Previous/Cancel**: Should be handled via form action value, not separate routes
6. **No caption**: This screen does NOT have the "Make a claim" caption (unlike most other screens)
7. **Statement text**: Must include exact contempt of court text from user story
8. **CPR reference**: Legal representative option must include "(as defined by CPR 2.3 (1))"
