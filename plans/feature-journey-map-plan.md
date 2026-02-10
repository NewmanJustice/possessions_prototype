# Journey Map Feature Implementation Plan

## Summary

**Feature:** Journey Map (Slide-out Panel)
**Purpose:** Provide solicitors with a visual tube-map inspired overview of the 39-screen possession claim journey, showing progress (completed/current/upcoming stations) grouped into 12 zones.

**Components to create:**
- `journeyMapService.js` - Service with zone/station definitions and status logic
- `journey-map-panel.njk` - Nunjucks partial for panel markup
- `journey-map.css` - Custom styles for tube-map visualisation
- `journey-map.js` - Client-side JavaScript for panel behaviour

---

## Understanding

### Key Behaviours from User Story (34 ACs)

**Trigger & Access (AC-1, AC-2, AC-33, AC-34):**
- "View journey map" link displayed on all `/claims/*` pages
- Link NOT displayed on non-claims pages (`/case-list`, `/possessions`, `/auth/*`)
- Clicking link opens slide-out panel from right

**Panel Behaviour (AC-3 to AC-9):**
- Panel slides in from right with semi-transparent backdrop
- Header shows "Your claim journey" title and Close button
- Close via: close button, backdrop click, or Escape key
- Focus trapped within panel; returns to trigger on close
- Content scrollable; current station auto-scrolled into view

**Visual Structure (AC-10 to AC-13):**
- 12 zones displayed as section headers in order
- Stations shown as circular markers with titles
- Vertical connecting lines between stations
- Zone-specific colours (green, blue, purple, orange, red, yellow, grey, black)

**Station States (AC-14 to AC-16):**
- Completed: grey marker, grey line, muted text
- Current: highlighted/prominent colour, visually distinct
- Upcoming: full zone colour, standard text

**Expand/Collapse (AC-17 to AC-20):**
- Stations expandable to show question and requirements
- Click to expand/collapse
- Current station expanded by default

**Branching (AC-21, AC-22):**
- Show diverging paths for tenancy type decision
- All branches visible regardless of selection

**Accessibility (AC-24 to AC-28):**
- Focus trapped within open panel
- Keyboard navigation (Tab, Enter/Space)
- Screen reader announcements
- Visible focus states (3px yellow outline)

### Test Count and Coverage Areas (59 Tests)

| Category | Count | Type |
|----------|-------|------|
| Trigger Link Visibility | 10 | Integration |
| Panel Markup | 4 | Integration |
| Zone Display | 12 | Integration |
| Accessibility Markup | 6 | Integration |
| Service - Zone Definitions | 7 | Unit |
| Service - Station Definitions | 6 | Unit |
| Service - Status Calculation | 7 | Unit |
| Service - Branch Handling | 7 | Unit |
| **Total** | **59** | |

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/services/journeyMapService.js` | Zone/station definitions, status calculation, completion checks |
| `src/views/partials/journey-map-panel.njk` | Panel markup with zones, stations, accessibility attributes |
| `public/css/journey-map.css` | Tube-map styles, zone colours, station states, animations |
| `public/js/journey-map.js` | Panel open/close, expand/collapse, focus trap, keyboard handling |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/views/layouts/main.njk` | Add trigger link (conditional), include panel partial, link CSS/JS |
| `src/app.js` | Add middleware to pass journey map data to all claims templates |

---

## Implementation Steps

1. **Create journeyMapService.js** with zone/station data structure and exported functions
2. **Create journey-map-panel.njk** partial with accessible panel markup
3. **Create journey-map.css** with tube-map visual styles
4. **Create journey-map.js** with panel behaviour and focus management
5. **Modify main.njk** to conditionally include trigger link and panel on claims pages
6. **Add middleware in app.js** to inject journey map data into response locals for claims routes
7. **Run tests** to verify all 59 tests pass
8. **Run lint** to ensure code quality

---

## Service API Design

### Exported Functions

```javascript
module.exports = {
  getJourneyZones,        // () => Zone[]
  getCurrentStationId,    // (url: string) => string | null
  getStationStatus,       // (session, stationId, currentUrl) => 'completed'|'current'|'upcoming'
  getCompletedStationIds, // (session) => string[]
  getSelectedBranch,      // (session) => 'assured'|'secure'|'flexible'|null
  getJourneyMapData,      // (session, currentUrl) => { zones, currentStationId, selectedBranch }
};
```

### Data Structures

**Zone:**
```javascript
{
  id: 'eligibility',
  name: 'Eligibility',
  colour: 'green',
  stations: Station[]
}
```

**Station:**
```javascript
{
  id: 'check-eligibility',
  title: 'Check eligibility',
  url: '/claims/eligibility',
  question: 'Is this property eligible for a possession claim?',
  requirements: ['Property must be in England'],
  sessionField: 'eligibilityConfirmed'  // path to check in claimDraft
}
```

### Zone Order and Colours

| Zone | Colour |
|------|--------|
| 1. Eligibility | green |
| 2. Claim Type | green |
| 3. Claimant Details | blue |
| 4. Defendant Details | blue |
| 5. Property & Tenancy | purple |
| 6. Grounds for Possession | orange |
| 7. Pre-action & Notice | orange |
| 8. Rent & Arrears | red |
| 9. Money Judgment | red |
| 10. Alternatives | yellow |
| 11. Additional Info | grey |
| 12. Submit | black |

---

## Template Structure

### Panel HTML Structure

```html
<div class="journey-map-overlay" id="journey-map-overlay" hidden>
  <div class="journey-map-backdrop" id="journey-map-backdrop"></div>
  <div class="journey-map-panel"
       id="journey-map-panel"
       role="dialog"
       aria-modal="true"
       aria-labelledby="journey-map-title"
       tabindex="-1">

    <!-- Header -->
    <div class="journey-map-header">
      <h2 id="journey-map-title" class="govuk-heading-m">Your claim journey</h2>
      <button type="button"
              class="journey-map-close govuk-link"
              id="close-journey-map"
              aria-label="Close journey map">Close</button>
    </div>

    <!-- Content (scrollable) -->
    <div class="journey-map-content">
      {% for zone in journeyZones %}
        <div class="journey-map-zone" data-zone-id="{{ zone.id }}">
          <h3 class="journey-map-zone-heading">{{ zone.name }}</h3>
          <div class="journey-map-line journey-map-line--{{ zone.colour }}">
            {% for station in zone.stations %}
              <!-- Station markup -->
            {% endfor %}
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</div>
```

### Zone/Station Rendering

- Each zone rendered as a section with heading
- Stations rendered vertically within zone
- Station element contains: marker, title button, expandable detail
- Status class applied: `data-status="completed|current|upcoming"`
- Current station has `aria-expanded="true"`, others `"false"`

---

## CSS Architecture

### Class Naming Conventions

```css
.journey-map-overlay      /* Full-screen overlay container */
.journey-map-backdrop     /* Semi-transparent click-to-close area */
.journey-map-panel        /* Slide-out panel */
.journey-map-header       /* Panel header */
.journey-map-content      /* Scrollable content area */
.journey-map-zone         /* Zone container */
.journey-map-zone-heading /* Zone title */
.journey-map-line         /* Vertical line container */
.journey-map-line--green  /* Zone colour modifier */
.journey-map-station      /* Station container */
.journey-map-station-marker  /* Circular marker */
.journey-map-station-title   /* Clickable title */
.journey-map-station-detail  /* Expandable content */
```

### Visual States

```css
/* Completed stations */
[data-status="completed"] .journey-map-station-marker { background: #b1b4b6; }
[data-status="completed"] .journey-map-station-title { color: #505a5f; }

/* Current station */
[data-status="current"] .journey-map-station-marker {
  background: #1d70b8;
  box-shadow: 0 0 0 3px #ffdd00;
}

/* Upcoming stations */
[data-status="upcoming"] .journey-map-station-marker { /* zone colour */ }
```

### Animation

```css
.journey-map-panel {
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
}

.journey-map-overlay:not([hidden]) .journey-map-panel {
  transform: translateX(0);
}
```

---

## JavaScript Behaviour

### Panel Open/Close

```javascript
function openPanel() {
  overlay.removeAttribute('hidden');
  panel.focus();
  document.body.style.overflow = 'hidden';
  scrollCurrentStationIntoView();
}

function closePanel() {
  overlay.setAttribute('hidden', '');
  document.body.style.overflow = '';
  triggerLink.focus();
}
```

### Expand/Collapse Stations

```javascript
stationTitle.addEventListener('click', () => {
  const expanded = stationTitle.getAttribute('aria-expanded') === 'true';
  stationTitle.setAttribute('aria-expanded', !expanded);
  stationDetail.hidden = expanded;
});
```

### Focus Management

- On open: focus panel element
- Tab cycles through: close button, station titles
- On close: return focus to trigger link
- Escape key closes panel

### Keyboard Handling

```javascript
panel.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanel();
  if (e.key === 'Tab') trapFocus(e);
});
```

---

## Session Integration

### Current Station Detection

```javascript
function getCurrentStationId(url) {
  // Strip query string
  const path = url.split('?')[0];

  // Find matching station by URL
  for (const zone of zones) {
    for (const station of zone.stations) {
      if (station.url === path) return station.id;
    }
  }
  return null;
}
```

### Completion Check

```javascript
function isStationCompleted(session, station) {
  if (!session.claimDraft) return false;

  // Navigate nested path (e.g., 'claimant.name')
  const value = getNestedValue(session.claimDraft, station.sessionField);
  return value !== undefined && value !== null && value !== '';
}
```

### Session Field Mappings (Key Examples)

| Station | Session Field |
|---------|---------------|
| Check eligibility | `eligibilityConfirmed` |
| Property location | `propertyLocation` |
| Claimant type | `claimantType` |
| Claimant name | `claimant.name` |
| Tenancy type | `tenancy.type` |
| Grounds | `grounds` |

---

## Risks / Questions

1. **Station count:** User story mentions ~39 stations. Need to map all existing claims routes to stations. Some routes may not map 1:1 to stations.

2. **Session field mapping:** Need to verify all session field paths match existing claimService patterns.

3. **Branching visualisation:** How exactly to render diverging/converging paths in CSS? May need additional markup for branch lines.

4. **Performance:** Loading full zone/station data on every claims page. Consider caching or middleware optimisation.

5. **Progressive enhancement:** Feature requires JavaScript. Non-JS users will not see journey map. Acceptable per spec assumption #13.

---

## Definition of Done

- [ ] All 59 tests passing (`npm test`)
- [ ] Lint passing (`npm run lint`)
- [ ] "View journey map" link visible on all `/claims/*` pages
- [ ] Link NOT visible on non-claims pages
- [ ] Panel opens with correct ARIA attributes
- [ ] All 12 zones displayed in correct order with correct colours
- [ ] Stations rendered with markers and titles
- [ ] Station states (completed/current/upcoming) display correctly
- [ ] Current station expanded by default
- [ ] Expand/collapse working on all stations
- [ ] Close button, backdrop click, and Escape key close panel
- [ ] Focus management working (trap and return)
- [ ] Keyboard navigation working
- [ ] Visual styling matches GOV.UK patterns

---

*Implementation plan created by Claude (Developer Agent) on 2026-02-10.*
