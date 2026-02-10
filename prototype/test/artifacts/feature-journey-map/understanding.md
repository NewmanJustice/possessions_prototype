# Feature: Journey Map (Slide-out Panel)

## Understanding

### Summary

The Journey Map is a cross-cutting feature that provides solicitors with a visual overview of the possession claim journey. Unlike standard screens, this is a slide-out panel component embedded in the main layout, accessible from all claims pages. It displays a tube-map inspired visualization showing 12 zones containing approximately 39 stations (questions), with visual indication of progress (completed, current, upcoming).

### Primary Behaviour (Happy Path)

1. User is on any page within the `/claims/*` route (authenticated solicitor)
2. User sees a "View journey map" link in a consistent position (below phase banner)
3. User clicks the link
4. A panel slides in from the right side of the screen
5. Panel displays:
   - Header with "Your claim journey" title and close button
   - Vertical tube-map visualization with zones and stations
   - Current station highlighted and expanded by default
   - Current station scrolled into view
6. User can:
   - Expand/collapse individual stations to see question details
   - Scroll within the panel to view all zones
   - Close panel via close button, backdrop click, or Escape key
7. When closed, focus returns to the trigger element

### Key Technical Characteristics

**This is NOT a standard screen with dedicated routes:**
- No GET/POST `/journey-map` route
- Panel is rendered as part of `main.njk` layout
- Shown/hidden via client-side JavaScript
- Panel markup included on all claims pages
- Data service (`journeyMapService.js`) calculates station states

### Input Variations

- **Page context:** User can be on any of the ~39 claims pages
- **Session state:** Varies depending on journey progress
- **Tenancy type:** Affects which branch path is highlighted
- **Expand/collapse state:** User can toggle individual stations

### Constraints

#### Business Rules

1. **View-only:** Users cannot navigate to stations by clicking them
2. **Professional users only:** Available to solicitors (not citizens)
3. **Claims pages only:** Link appears only on `/claims/*` routes
4. **All branches visible:** Shows all tenancy paths regardless of user selection
5. **No session writes:** Feature is read-only, does not modify session data

#### Visual Requirements

1. **12 zones** displayed in defined order
2. **Zone colours** follow specified palette (green, blue, purple, orange, red, yellow, grey, black)
3. **Station states:** completed (grey), current (highlighted), upcoming (full colour)
4. **GDS styling:** GOV.UK typography, colours, spacing, focus states

#### Accessibility Requirements

1. **Focus trap:** Tab cycles only within panel when open
2. **Keyboard navigation:** Tab/arrow keys navigate, Enter/Space to expand/collapse
3. **Screen reader support:** Announces panel open, close button labeled
4. **Focus return:** Focus returns to trigger on close
5. **Visible focus states:** 3px yellow outline per GOV.UK standard

#### Session Integration (Read-Only)

```javascript
// Current station determined by current URL
const currentUrl = req.originalUrl  // e.g., '/claims/claimant-name'

// Completed stations determined by checking session.claimDraft
session.claimDraft.eligibilityConfirmed   // Station: Check eligibility
session.claimDraft.propertyLocation       // Station: Property location
session.claimDraft.claimantType           // Station: Claimant type
session.claimDraft.claimant               // Station: Claimant details
session.claimDraft.defendant              // Station: Defendant details
session.claimDraft.tenancy                // Station: Tenancy type
session.claimDraft.grounds                // Station: Grounds for possession
// ... etc for all stations

// Branching path determined by tenancy type selection
session.claimDraft.tenancy?.type          // 'assured' | 'secure' | 'flexible'
```

### Initial Assumptions

1. **Panel markup always present:** On claims pages, panel HTML is always rendered (hidden by default)
2. **JavaScript required:** Panel functionality requires JavaScript; no progressive enhancement
3. **Service provides data:** `journeyMapService.js` exports zone definitions and status calculation functions
4. **URL-to-station mapping:** Service maps current URL to the corresponding station
5. **Session field mapping:** Service defines which session fields indicate station completion
6. **Default expand state:** Only current station expanded by default
7. **Scroll behaviour:** Panel auto-scrolls to bring current station into view on open
8. **Panel width:** Approximately 400px (may be responsive)
9. **Animation:** CSS transition for slide-in/out (graceful degradation acceptable)

---

## Clarifications Needed

### Q1 - Trigger Link Position

**Question:** Where exactly should the "View journey map" link be positioned?
- **Proposed:** Below the phase banner, aligned left, before page content
- **Status:** Awaiting confirmation from design

### Q2 - Zone/Station Data Source

**Question:** Should zone/station definitions be hardcoded in the service, or loaded from configuration?
- **Proposed:** Hardcoded in `journeyMapService.js` for prototype
- **Status:** Proceeding with assumption

### Q3 - Completion Logic Granularity

**Question:** How granular should station completion detection be?
- **Proposed:** Check for truthy values in mapped session fields (simple presence check)
- **Alternative:** Deep validation of field values
- **Status:** Proceeding with simple presence check

### Q4 - Branch Display When No Tenancy Selected

**Question:** How should branching paths display before tenancy type is selected?
- **Proposed:** All three branches shown with equal styling (none highlighted)
- **Status:** Awaiting confirmation

### Q5 - Station Detail Content

**Question:** Where does the expanded station content come from?
- **Proposed:** Hardcoded in service alongside station definitions
- **Status:** Proceeding with assumption

### Q6 - Panel Close Animation Duration

**Question:** What duration for slide animation?
- **Proposed:** 300ms CSS transition
- **Alternative:** Instant show/hide acceptable for prototype
- **Status:** Proceeding with 300ms assumption

---

## Out of Scope

1. Click-to-navigate functionality
2. Citizen user variant
3. Estimated times per station
4. Persisting expand/collapse state across page loads
5. Mini progress indicator always visible
6. Print view of journey map
7. Welsh language variant for journey map content
8. Mobile-optimised responsive layout
9. Browser automation tests (Playwright/Cypress) for JavaScript behaviour

---

## Relationship to Other Components

| Component | Relationship |
|-----------|--------------|
| `main.njk` layout | Panel markup added to this layout, trigger link conditional on claims pages |
| `journeyMapService.js` | New service providing zone/station definitions and status calculation |
| `journey-map-panel.njk` | New partial template for panel markup |
| `journey-map.css` | New stylesheet for map visualisation |
| `journey-map.js` | New client-side script for panel behaviour |
| Session (`claimDraft`) | Read-only access to determine station states |
| Claims routes | All existing claims routes display the trigger link |

---

## Test Approach Differences

Since this is not a standard route-based screen, testing differs:

| Standard Screen Test | Journey Map Test |
|---------------------|------------------|
| Test GET route returns 200 | Test claims pages contain panel markup |
| Test POST route redirects | N/A - no form submission |
| Test validation errors | N/A - view-only component |
| Test session persistence | Test service correctly calculates states |
| Test navigation flow | Test trigger link appears on correct pages |

**Focus areas for Jest/Supertest:**
1. Panel HTML markup present on claims pages
2. Trigger link present on claims pages, absent on non-claims pages
3. Service unit tests for zone/station data and status calculation
4. ARIA attributes and accessibility markup present

**Out of scope for Jest/Supertest (requires browser automation):**
1. Panel slide animation
2. Focus trap behaviour
3. Escape key handling
4. Backdrop click handling
5. Expand/collapse interaction
6. Auto-scroll to current station

---

*This understanding document was created by Nigel (Tester Agent) on 2026-02-10 based on user story feature-journey-map.txt and feature spec FEATURE-SPEC-Journey-Map.md.*
