# Screen 36: Completing Your Claim - Implementation Guide

## Overview

This document provides guidance for Claude (Developer) to implement Screen 36 based on the test specifications.

## Route Configuration

```javascript
// In src/routes/claims.js

// GET handler
router.get('/completing-your-claim', requireAuth, (req, res) => {
  const claim = claimService.getClaim(req.session);
  const errors = req.session.errors || [];
  const values = req.session.values || {};

  // Clear flash data
  delete req.session.errors;
  delete req.session.values;

  res.render('pages/claims/completing-your-claim', {
    claim,
    errors,
    values,
    completionPreference: claim.completionPreference?.preference || values.completionPreference
  });
});

// POST handler
router.post('/completing-your-claim', requireAuth, (req, res) => {
  const { action, completionPreference } = req.body;

  // Handle Previous
  if (action === 'previous') {
    return res.redirect('/claims/language-used');
  }

  // Handle Cancel
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Validation
  const errors = claimService.validateStep('completing-your-claim', req.body);
  if (errors.length > 0) {
    req.session.errors = errors;
    req.session.values = req.body;
    return res.redirect('/claims/completing-your-claim');
  }

  // Update session
  claimService.updateClaim(req.session, 'completionPreference', {
    preference: completionPreference
  });

  // Continue to next screen
  res.redirect('/claims/statement-of-truth');
});
```

## Validation Logic

```javascript
// In src/services/claimService.js validateStep() switch statement

case 'completing-your-claim': {
  if (!data.completionPreference) {
    errors.push({
      field: 'completionPreference',
      message: 'Select what you would like to do next',
      href: '#completionPreference'
    });
  }
  break;
}
```

## Template Structure

File: `src/views/pages/claims/completing-your-claim.njk`

```nunjucks
{% extends "layouts/main.njk" %}

{% from "govuk/components/radios/macro.njk" import govukRadios %}
{% from "govuk/components/button/macro.njk" import govukButton %}
{% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %}

{% set pageTitle = "Completing your claim" %}
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

      <span class="govuk-caption-l">Make a claim</span>
      <h1 class="govuk-heading-l">Completing your claim</h1>

      <p class="govuk-body">Case number: {{ claim.caseNumber }}</p>

      <p class="govuk-body">There are two options for what do to next:</p>

      <ul class="govuk-list govuk-list--bullet">
        <li>sign the statement of truth, check your answers, then submit and pay for your claim now.</li>
        <li>check your answers and save your claim as a draft. You can return later to sign the statement of truth and submit and pay.</li>
      </ul>

      <form method="post" novalidate>
        {{ govukRadios({
          name: "completionPreference",
          fieldset: {
            legend: {
              text: "What would you like to do next?",
              isPageHeading: false,
              classes: "govuk-fieldset__legend--m"
            }
          },
          items: [
            {
              value: "submit-now",
              text: "Submit and pay for my claim now",
              checked: completionPreference == "submit-now"
            },
            {
              value: "save-for-later",
              text: "Save it for later",
              checked: completionPreference == "save-for-later"
            }
          ],
          errorMessage: errors | selectattr("field", "equalto", "completionPreference") | first | attr("message") | default(undefined) | iif({ text: _ }, undefined)
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
req.session.claimDraft.completionPreference = {
  preference: 'submit-now' // or 'save-for-later'
}
```

## Test Data Requirements

The navigation helper `navigateToCompletingYourClaim` should:
1. Call `navigateToLanguageUsed(agent)`
2. POST to `/claims/language-used` with `{ language: 'english' }`
3. This establishes session state needed for Screen 36

## Key Implementation Notes

1. **Form field name**: Must be `completionPreference` to match validation and session storage
2. **Radio values**: Must be exactly `submit-now` and `save-for-later` (lowercase kebab-case)
3. **Error href**: Must be `#completionPreference` for accessibility link targeting
4. **Page title**: Must be prefixed with "Error: " when validation fails
5. **Previous/Cancel**: Should be handled via form action value, not separate routes
6. **Both options route to same screen**: `/claims/statement-of-truth` (prototype limitation)
