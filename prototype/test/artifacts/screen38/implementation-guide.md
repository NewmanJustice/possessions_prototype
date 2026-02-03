# Screen 38: Check Your Answers - Implementation Guide

## Overview

This document provides guidance for Claude (Developer) to implement Screen 38 based on the test specifications.

## Route Configuration

```javascript
// In src/routes/claims.js

// GET handler
router.get('/check-your-answers', requireAuth, (req, res) => {
  const claim = claimService.getClaim(req.session);

  res.render('pages/claims/check-your-answers', {
    claim
  });
});

// POST handler
router.post('/check-your-answers', requireAuth, (req, res) => {
  const { action } = req.body;

  // Handle Previous
  if (action === 'previous') {
    return res.redirect('/claims/statement-of-truth');
  }

  // Handle Cancel
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Submit and pay - Continue to payment
  res.redirect('/claims/pay-claim-fee');
});
```

## Template Structure

File: `src/views/pages/claims/check-your-answers.njk`

```nunjucks
{% extends "layouts/main.njk" %}

{% from "govuk/components/summary-list/macro.njk" import govukSummaryList %}
{% from "govuk/components/button/macro.njk" import govukButton %}

{% set pageTitle = "Check your answers" %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">

      <h1 class="govuk-heading-l">Check your answers</h1>

      <p class="govuk-body">Case number: {{ claim.caseNumber }}</p>

      {{ govukSummaryList({
        rows: [
          {
            key: { text: "What is the address of the property you're claiming possession of?" },
            value: { html: "10 Garden Drive<br>Luton<br>Bedfordshire<br>LU1 1AB" },
            actions: {
              items: [{
                href: "#",
                text: "Change",
                visuallyHiddenText: "property address"
              }]
            }
          },
          // ... additional rows for all sections
        ]
      }) }}

      <form method="post" novalidate>
        <div class="govuk-button-group">
          {{ govukButton({
            name: "action",
            value: "previous",
            text: "Previous",
            classes: "govuk-button--secondary"
          }) }}
          {{ govukButton({
            text: "Submit and pay",
            classes: "govuk-button--primary"
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

No new session data is written by this page.

## Test Data Requirements

The navigation helper `navigateToCheckYourAnswers` should:
1. Call `navigateToStatementOfTruth(agent)`
2. POST to `/claims/statement-of-truth` with `{ completedBy: 'claimant' }`
3. This establishes session state needed for Screen 38

## Key Implementation Notes

1. **No validation required**: This is a read-only summary page
2. **Button text**: Must be "Submit and pay" (not "Continue")
3. **No caption**: This screen does NOT have the "Make a claim" caption
4. **Summary list**: Use GOV.UK summary list component with dl/dt/dd semantics
5. **Change links**: Include `visuallyHiddenText` for accessibility
6. **Hardcoded data**: Summary values can be illustrative hardcoded data
7. **Previous/Cancel**: Handle via form action value
8. **Submit action**: Default form submission goes to `/claims/pay-claim-fee`
