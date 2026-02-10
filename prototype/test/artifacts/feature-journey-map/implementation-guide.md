# Implementation Guide - Feature: Journey Map

## Overview

This guide provides implementation details for Claude (Developer Agent) to implement the Journey Map feature based on the test specifications.

---

## Files to Create

| File | Location | Purpose |
|------|----------|---------|
| `journeyMapService.js` | `src/services/` | Zone/station definitions, status calculation |
| `journey-map-panel.njk` | `src/views/partials/` | Panel markup |
| `journey-map.css` | `public/css/` | Panel and map styles |
| `journey-map.js` | `public/js/` | Panel open/close, expand/collapse |

## Files to Modify

| File | Change |
|------|--------|
| `main.njk` | Add trigger link and include panel partial |
| `app.js` | Register journey map service (if needed) |

---

## 1. journeyMapService.js

### Exported Functions

```javascript
module.exports = {
  getJourneyZones,      // Returns full zone/station definitions
  getCurrentStationId,  // Maps URL to station ID
  getStationStatus,     // Returns 'completed'|'current'|'upcoming'
  getCompletedStationIds, // Returns array of completed station IDs
  getBranchingPaths,    // Returns branching configuration
  getSelectedBranch,    // Returns selected branch ID or null
  getJourneyMapData,    // Main function: returns full data for template
};
```

### Zone Definitions

```javascript
const JOURNEY_ZONES = [
  {
    id: 'eligibility',
    name: 'Eligibility',
    colour: 'green',
    stations: [
      {
        id: 'check-eligibility',
        title: 'Check eligibility',
        url: '/claims/eligibility',
        question: 'Is this property eligible for a possession claim?',
        requirements: ['Property must be in England'],
        sessionField: 'eligibilityConfirmed'
      },
      // ... more stations
    ]
  },
  // ... 11 more zones
];
```

### Zone Order (Must Match)

1. Eligibility (green)
2. Claim Type (green)
3. Claimant Details (blue)
4. Defendant Details (blue)
5. Property & Tenancy (purple)
6. Grounds for Possession (orange)
7. Pre-action & Notice (orange)
8. Rent & Arrears (red)
9. Money Judgment (red)
10. Alternatives (yellow)
11. Additional Info (grey)
12. Submit (black)

### Status Calculation Logic

```javascript
function getStationStatus(session, stationId, currentUrl) {
  const station = findStationById(stationId);

  // Current takes precedence
  if (station.url === currentUrl) {
    return 'current';
  }

  // Check completion
  if (isStationCompleted(session, station)) {
    return 'completed';
  }

  return 'upcoming';
}

function isStationCompleted(session, station) {
  if (!session.claimDraft) return false;
  const value = getNestedValue(session.claimDraft, station.sessionField);
  return value !== undefined && value !== null && value !== '';
}
```

---

## 2. main.njk Modifications

### Trigger Link (Conditional)

```nunjucks
{% block beforeContent %}
  {# Phase banner... #}

  {% if '/claims/' in request.originalUrl %}
  <div class="journey-map-trigger">
    <a href="#" class="govuk-link" id="open-journey-map">View journey map</a>
  </div>
  {% endif %}

  {# Back link... #}
{% endblock %}

{% block bodyEnd %}
  {# Existing scripts... #}

  {% if '/claims/' in request.originalUrl %}
    {% include "partials/journey-map-panel.njk" %}
    <script src="/public/js/journey-map.js"></script>
  {% endif %}
{% endblock %}
```

---

## 3. journey-map-panel.njk

### Required Structure

```nunjucks
<div class="journey-map-overlay" id="journey-map-overlay" hidden>
  <div class="journey-map-backdrop" id="journey-map-backdrop"></div>
  <div class="journey-map-panel"
       id="journey-map-panel"
       role="dialog"
       aria-modal="true"
       aria-labelledby="journey-map-title"
       tabindex="-1">

    <div class="journey-map-header">
      <h2 id="journey-map-title" class="govuk-heading-m">Your claim journey</h2>
      <button type="button"
              class="journey-map-close govuk-link"
              id="close-journey-map"
              aria-label="Close journey map">
        Close
      </button>
    </div>

    <div class="journey-map-content">
      {% for zone in journeyZones %}
        <div class="journey-map-zone" data-zone-id="{{ zone.id }}">
          <h3 class="journey-map-zone-heading">{{ zone.name }}</h3>
          <div class="journey-map-line journey-map-line--{{ zone.colour }}">
            {% for station in zone.stations %}
              <div class="journey-map-station"
                   data-station-id="{{ station.id }}"
                   data-status="{{ station.status }}">
                <div class="journey-map-station-marker"></div>
                <button type="button"
                        class="journey-map-station-title"
                        aria-expanded="{{ 'true' if station.status == 'current' else 'false' }}">
                  {{ station.title }}
                </button>
                <div class="journey-map-station-detail"
                     {% if station.status != 'current' %}hidden{% endif %}>
                  <p class="journey-map-station-question">{{ station.question }}</p>
                  {% if station.requirements.length %}
                  <p class="journey-map-station-requirements-label">You will need:</p>
                  <ul class="journey-map-station-requirements">
                    {% for req in station.requirements %}
                    <li>{{ req }}</li>
                    {% endfor %}
                  </ul>
                  {% endif %}
                </div>
              </div>
            {% endfor %}
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</div>
```

---

## 4. Route Integration

### Passing Data to Template

In claims routes or middleware:

```javascript
const journeyMapService = require('../services/journeyMapService');

// In route handler or middleware
const journeyMapData = journeyMapService.getJourneyMapData(
  req.session,
  req.originalUrl
);

res.render('claims/some-page', {
  // ... other data
  journeyZones: journeyMapData.zones,
  currentStationId: journeyMapData.currentStationId
});
```

---

## 5. Test File Locations

| Test File | Tests |
|-----------|-------|
| `test/routes/journeyMap.test.js` | Integration tests (markup, trigger link) |
| `test/services/journeyMapService.test.js` | Unit tests (service functions) |

---

## 6. Session Field Mappings

Map stations to session fields:

| Station | Session Field |
|---------|---------------|
| Check eligibility | `claimDraft.eligibilityConfirmed` |
| Property location | `claimDraft.propertyLocation` |
| Claimant type | `claimDraft.claimantType` |
| Claim type | `claimDraft.claimType` |
| Claimant name | `claimDraft.claimant.name` |
| Contact preferences | `claimDraft.claimant.contactPreferences` |
| Defendant details | `claimDraft.defendant.nameKnown` |
| Tenancy type | `claimDraft.tenancy.type` |
| Grounds | `claimDraft.grounds` |
| Pre-action protocol | `claimDraft.preActionProtocol` |
| Notice details | `claimDraft.notice` |
| Rent details | `claimDraft.rent` |
| Money judgment | `claimDraft.moneyJudgment` |
| ... | ... |

---

## 7. Run Tests

```bash
# Run all journey map tests
npm test -- --grep "Journey Map"

# Run service unit tests only
npm test -- --grep "journeyMapService"

# Run integration tests only
npm test -- --grep "Journey Map Panel"
```

---

*Implementation guide created by Nigel (Tester Agent) on 2026-02-10.*
