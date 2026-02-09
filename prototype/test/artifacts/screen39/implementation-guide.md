# Screen 39: Pay Claim Fee - Implementation Guide

## Overview

This document provides guidance for Claude (Developer) to implement Screen 39 based on the test specifications. This is the FINAL screen in the claims journey - a read-only confirmation page with payment options.

## Route Configuration

```javascript
// In src/routes/claims.js

// GET handler only (no POST required)
router.get('/pay-claim-fee', requireAuth, (req, res) => {
  const claim = claimService.getClaim(req.session);

  res.render('pages/claims/pay-claim-fee', {
    claim,
    caseNumber: claim?.caseNumber || '1234-5678-9101-1213'
  });
});
```

**Note:** No POST handler is required for this page. All navigation is via links (href) not form submissions.

## Template Structure

File: `src/views/pages/claims/pay-claim-fee.njk`

```nunjucks
{% extends "layouts/main.njk" %}

{% from "govuk/components/button/macro.njk" import govukButton %}

{% set pageTitle = "Pay claim fee" %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">

      <h1 class="govuk-heading-l">Pay claim fee</h1>

      <p class="govuk-body">Case number: {{ caseNumber }}</p>

      {{ govukButton({
        text: "Pay £404 claim fee",
        href: "/case-list",
        isStartButton: true
      }) }}

      <h2 class="govuk-heading-m">Make a payment</h2>

      <p class="govuk-body">
        You must pay the claim fee of £404. Your claim will not progress until this fee has been paid.
        <a href="/case-list" class="govuk-link">Pay the claim fee</a>.
      </p>

      {{ govukButton({
        text: "Close and return to case details",
        href: "/case-list",
        classes: "govuk-button--secondary"
      }) }}

    </div>
  </div>
{% endblock %}
```

## Session Data Structure

**No new session data is written by this page.**

**Read from session (optional):**
- `claim.caseNumber` - Case number to display (can be hardcoded if not in session)

## Test Data Requirements

The navigation helper `navigateToPayClaimFee` should:
1. Call `navigateToCheckYourAnswers(agent)`
2. POST to `/claims/check-your-answers` with `{}` (default submit action)
3. This establishes session state needed for Screen 39

## Key Implementation Notes

1. **GET-only route**: No POST handler required - all navigation via anchor links
2. **No form elements**: Page has no form inputs
3. **No Previous button**: Claim has been submitted, cannot go back
4. **No Cancel link**: Claim has been submitted
5. **Start button styling**: Use `isStartButton: true` for primary payment button
6. **Secondary button styling**: Use `classes: "govuk-button--secondary"` for close button
7. **Hardcoded fee**: £404 is fixed for the prototype
8. **Case number**: Can be hardcoded as "1234-5678-9101-1213"
9. **All links to /case-list**: Payment button, payment link, and close button all go to case-list

## Content Order on Page

1. Page heading ("Pay claim fee") - h1
2. Case number text
3. Primary payment button ("Pay £404 claim fee" - start button)
4. Section heading ("Make a payment") - h2
5. Instructional paragraph with "Pay the claim fee" link
6. Close and return button (secondary)

## Elements NOT Present

- Previous button
- Cancel link
- Form elements
- "Make a claim" caption
- Error summary (no validation)

## Button HTML Output Reference

Start button:
```html
<a href="/case-list" role="button" draggable="false" class="govuk-button govuk-button--start" data-module="govuk-button">
  Pay £404 claim fee
  <svg class="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" ...></svg>
</a>
```

Secondary button:
```html
<a href="/case-list" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">
  Close and return to case details
</a>
```
