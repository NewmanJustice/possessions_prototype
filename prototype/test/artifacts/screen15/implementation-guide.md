# Screen 15: Reasons for Possession - Implementation Guide

## Overview

This guide provides developers with implementation details for Screen 15 based on the test specifications. The screen implements a loop pattern to collect reasons for each selected ground.

## Route Endpoints

### GET /claims/reasons-for-possession

**Purpose**: Display reasons input for current ground in loop

**Expected Behaviour**:
1. Get claim from session
2. Collect selected grounds from `claim.grounds.assured` and `claim.grounds.additional`
3. If no grounds selected, redirect to `/claims/preaction-protocol`
4. Initialise or update `reasonsLoop` with grounds list and currentIndex
5. Get current ground from loop
6. Look up ground definition for display name and number
7. Retrieve any saved reasons for current ground
8. Render template with:
   - `groundName`: Display name (e.g., "Persistent delay in paying rent")
   - `groundNumber`: Ground number (e.g., "Ground 8")
   - `reasons`: Previously saved reasons or empty string
   - `currentIndex`: Current position in loop
   - `totalGrounds`: Total grounds count

**Template Variables**:
```javascript
{
  pageTitle: 'Reasons for possession',
  groundName: 'Persistent delay in paying rent',
  groundNumber: 'Ground 8',
  groundKey: 'assured.ground8',
  currentIndex: 0,
  totalGrounds: 3,
  reasons: '',
  errors: {},
  errorList: []
}
```

### POST /claims/reasons-for-possession

**Request Body**:
```javascript
{
  reasons: 'Optional text up to 500 characters',
  action: 'continue' | 'previous'
}
```

**Continue Action**:
1. Validate character count (max 500)
2. If validation fails:
   - Return 400 with errors
   - Preserve entered reasons in render
3. Store reasons in `session.claim.reasonsForPossession[groundKey]`
4. If more grounds: increment `currentIndex`, redirect to same route
5. If last ground: clear `reasonsLoop`, redirect to `/claims/preaction-protocol`

**Previous Action**:
1. Save current reasons (even on previous)
2. If `currentIndex > 0`: decrement index, redirect to same route
3. If `currentIndex === 0`: redirect to `/claims/grounds-for-possession`

## Session State

### Required Session Structure

```javascript
// Selected grounds (from screens 13.1.1 and 14)
session.claim.grounds = {
  assured: {
    ground8: true,
    ground10: false,
    ground11: true
  },
  additional: {
    mandatoryGround1: true,
    discretionaryGround9: false
  }
};

// Reasons storage
session.claim.reasonsForPossession = {
  'assured.ground8': 'Detailed reasons text...',
  'assured.ground11': '',
  'additional.mandatoryGround1': 'Another reason...'
};

// Loop controller
session.claim.reasonsLoop = {
  grounds: ['assured.ground8', 'assured.ground11', 'additional.mandatoryGround1'],
  currentIndex: 0
};
```

### Ground Definitions

Map ground keys to display information:

```javascript
const groundDefinitions = {
  // Assured tenancy grounds
  'assured.ground8': { name: 'Serious rent arrears', number: 'Ground 8' },
  'assured.ground10': { name: 'Some rent arrears', number: 'Ground 10' },
  'assured.ground11': { name: 'Persistent delay in paying rent', number: 'Ground 11' },
  // Additional mandatory grounds
  'additional.mandatoryGround1': { name: 'Landlord requires property', number: 'Ground 1' },
  'additional.mandatoryGround3': { name: 'Out of season holiday let', number: 'Ground 3' },
  // ... etc
};
```

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| reasons | Optional, max 500 chars | "Enter 500 characters or fewer" |

## Template Requirements

### Page Structure

```nunjucks
{% extends "layouts/main.njk" %}

{% block pageTitle %}
  {% if errorList.length > 0 %}Error: {% endif %}Reasons for possession - {{ serviceName }} - GOV.UK
{% endblock %}

{% block content %}
  {# Error summary if errors #}

  <span class="govuk-caption-l">Make a claim</span>
  <h1 class="govuk-heading-l">{{ groundName }} ({{ groundNumber }})</h1>

  <p class="govuk-body">
    Why are you making a claim for possession under this ground?
  </p>

  <form method="post" novalidate>
    {# govukCharacterCount with maxlength=500 #}

    <div class="govuk-button-group">
      {# Previous button (secondary) #}
      {# Continue button (primary) #}
    </div>
  </form>

  <p class="govuk-body">
    <a href="/case-list" class="govuk-link">Cancel</a>
  </p>
{% endblock %}
```

### GOV.UK Components Required

- `govukErrorSummary` - For validation errors
- `govukCharacterCount` - For reasons textarea with character limit
- `govukButton` - For Previous and Continue buttons

## Navigation Flow

```
grounds-for-possession → reasons-for-possession (loop) → preaction-protocol
                              ↑                   |
                              |___________________|
                                 (next ground)
```

### Previous Navigation Logic

```javascript
if (action === 'previous') {
  if (reasonsLoop.currentIndex > 0) {
    reasonsLoop.currentIndex--;
    return res.redirect('/claims/reasons-for-possession');
  } else {
    return res.redirect('/claims/grounds-for-possession');
  }
}
```

### Continue Navigation Logic

```javascript
if (reasonsLoop.currentIndex < reasonsLoop.grounds.length - 1) {
  reasonsLoop.currentIndex++;
  return res.redirect('/claims/reasons-for-possession');
} else {
  // Clear loop and proceed
  claimService.updateClaim(req.session, 'reasonsLoop', null);
  return res.redirect('/claims/preaction-protocol');
}
```

## Test Navigation Helper

Add to sessionHelper.js:

```javascript
/**
 * Navigate to Reasons for Possession (Screen 15)
 * Entry: Screen 14 (grounds-for-possession) → Screen 15
 * Sets up session with selected grounds for loop testing
 */
async function navigateToReasonsForPossession(agent) {
  // Navigate through assured journey to get grounds selected
  await navigateToAssuredTenancyGrounds(agent);

  // Screen 13.1: Proceed with assured grounds
  await agent
    .post('/claims/grounds-for-possession-assured-confirmation')
    .send({ assuredProceed: 'yes' })
    .expect(302);

  // Screen 13.1.1: Select grounds and proceed to additional grounds
  await agent
    .post('/claims/grounds-for-possession-assured-selection')
    .send({
      ground8: 'true',
      hasAdditionalGrounds: 'yes'
    })
    .expect(302);

  // Screen 14: Select additional ground
  await agent
    .post('/claims/grounds-for-possession')
    .send({ grounds: ['mandatoryGround1'] })
    .expect(302);

  return agent;
}
```

## Error Handling

### Validation Error Response

```javascript
if (reasons && reasons.length > 500) {
  return res.status(400).render('pages/claims/reasons-for-possession', {
    pageTitle: 'Reasons for possession',
    groundName: groundDef.name,
    groundNumber: groundDef.number,
    reasons: reasons, // Preserve input
    errors: {
      reasons: { text: 'Enter 500 characters or fewer' }
    },
    errorList: [
      { text: 'Enter 500 characters or fewer', href: '#reasons' }
    ]
  });
}
```

## Accessibility Checklist

- [ ] Error summary with `role="alert"` and `tabindex="-1"`
- [ ] Error links target textarea with `href="#reasons"`
- [ ] Textarea has associated label
- [ ] Character count announced by screen readers
- [ ] Focus management on error
- [ ] Page title includes "Error:" prefix on validation failure
