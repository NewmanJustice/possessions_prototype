# Feature: Journey Map (Slide-out Panel)
## Test Plan

---

## 1. Scope and Assumptions

### In Scope

- Panel markup presence on claims pages
- Trigger link visibility (claims pages only)
- Service unit tests (zone definitions, station states, completion logic)
- ARIA and accessibility markup attributes
- Data structure validation

### Out of Scope (Requires Browser Automation)

- Panel slide animation behaviour
- Focus trap functionality
- Escape key handling
- Backdrop click handling
- Expand/collapse JavaScript interactions
- Auto-scroll to current station
- CSS styling verification

### Assumptions

1. `journeyMapService.js` exports zone/station definitions and status functions
2. Panel markup rendered via `journey-map-panel.njk` partial
3. Trigger link conditionally included in `main.njk` layout
4. Session `claimDraft` structure follows existing patterns
5. URL-to-station mapping defined in service

---

## 2. Test Categories and Types

### A. Trigger Link Visibility Tests (Integration)

- [T-TRG-1] Trigger link present on claims start page
- [T-TRG-2] Trigger link present on claims eligibility page
- [T-TRG-3] Trigger link present on claims check-answers page
- [T-TRG-4] Trigger link NOT present on case-list page
- [T-TRG-5] Trigger link NOT present on possessions landing page
- [T-TRG-6] Trigger link NOT present on sign-in page
- [T-TRG-7] Trigger link NOT present on access code page

### B. Panel Markup Tests (Integration)

- [T-PNL-1] Panel container present on claims pages
- [T-PNL-2] Panel has correct role="dialog" attribute
- [T-PNL-3] Panel has aria-modal="true" attribute
- [T-PNL-4] Panel has aria-labelledby pointing to title
- [T-PNL-5] Panel title "Your claim journey" present
- [T-PNL-6] Close button present with accessible label
- [T-PNL-7] Panel initially hidden (hidden attribute)

### C. Zone Display Tests (Integration)

- [T-ZN-1] All 12 zones rendered in panel markup
- [T-ZN-2] Zone headings present (Eligibility, Claim Type, etc.)
- [T-ZN-3] Zones displayed in correct order

### D. Station Markup Tests (Integration)

- [T-STN-1] Stations rendered within zones
- [T-STN-2] Station markers have circular elements
- [T-STN-3] Station titles present
- [T-STN-4] Stations expandable (button or clickable element)

### E. Service Unit Tests - Zone Definitions

- [T-SVC-1] Service exports getJourneyZones function
- [T-SVC-2] getJourneyZones returns 12 zones
- [T-SVC-3] Each zone has required properties (id, name, colour, stations)
- [T-SVC-4] Zone names match specification
- [T-SVC-5] Zone colours match specification
- [T-SVC-6] Zones contain expected station counts

### F. Service Unit Tests - Station Definitions

- [T-SVC-7] Each station has required properties (id, title, url)
- [T-SVC-8] Station URLs map to valid claims routes
- [T-SVC-9] Station questions defined
- [T-SVC-10] Station requirements defined (array)

### G. Service Unit Tests - Status Calculation

- [T-SVC-11] getStationStatus returns 'upcoming' for unvisited station
- [T-SVC-12] getStationStatus returns 'completed' for visited station
- [T-SVC-13] getStationStatus returns 'current' for active station
- [T-SVC-14] getCurrentStation correctly identifies station by URL
- [T-SVC-15] getCompletedStations returns array of completed station IDs
- [T-SVC-16] Station completion detected from session data

### H. Service Unit Tests - Branching Logic

- [T-SVC-17] Branching paths defined for tenancy type
- [T-SVC-18] All three tenancy branches present
- [T-SVC-19] Selected branch identifiable from session
- [T-SVC-20] Non-selected branches remain visible in data

### I. Accessibility Markup Tests

- [T-A11Y-1] Panel has tabindex="-1" for programmatic focus
- [T-A11Y-2] Close button has accessible name
- [T-A11Y-3] Station expand buttons keyboard accessible
- [T-A11Y-4] ARIA expanded states on stations

---

## 3. Risks and Unknowns

### Technical Risks

- **Service not created yet:** Tests written against proposed API
- **Markup structure flexible:** Tests may need adjustment based on implementation
- **Session field mapping:** Completion checks depend on consistent session structure

### Assumptions That Could Break Tests

- If zone/station counts change, count tests fail
- If service function names change, unit tests fail
- If panel not included via partial, markup tests fail
- If trigger link position changes, selector tests fail

---

## 4. Test Environment & Setup

### Preconditions

1. User authenticated as solicitor
2. Session initialized with claimDraft
3. Test navigates to claims page before checking markup

### Test Data

- Empty session (no stations completed)
- Partial session (some stations completed)
- Full session (all stations completed)
- Tenancy type variations (assured, secure, flexible)

---

## 5. Traceability Matrix

| Acceptance Criterion | Test IDs | Coverage |
|----------------------|----------|----------|
| AC-1: Link on claims pages | T-TRG-1 to T-TRG-3 | Full |
| AC-2: Link opens panel | N/A (JS behaviour) | Out of scope |
| AC-3: Panel slides in | N/A (JS behaviour) | Out of scope |
| AC-4: Panel header | T-PNL-5, T-PNL-6 | Partial (markup only) |
| AC-5-7: Close behaviours | N/A (JS behaviour) | Out of scope |
| AC-8-9: Scroll behaviours | N/A (JS behaviour) | Out of scope |
| AC-10: Display zones | T-ZN-1 to T-ZN-3 | Full |
| AC-11: Display stations | T-STN-1 to T-STN-4 | Partial |
| AC-12-13: Visual styling | N/A (CSS) | Out of scope |
| AC-14-16: Station states | T-SVC-11 to T-SVC-16 | Full (service tests) |
| AC-17-20: Expand/collapse | N/A (JS behaviour) | Out of scope |
| AC-21-22: Branching | T-SVC-17 to T-SVC-20 | Full (service tests) |
| AC-23: View-only | N/A (JS behaviour) | Out of scope |
| AC-24-28: Accessibility | T-A11Y-1 to T-A11Y-4, T-PNL-2 to T-PNL-4 | Partial (markup only) |
| AC-29-32: GDS styling | N/A (CSS) | Out of scope |
| AC-33: Link only on claims | T-TRG-4 to T-TRG-7 | Full |
| AC-34: Available throughout | T-TRG-1 to T-TRG-3 | Partial |

---

*Test plan created by Nigel (Tester Agent) on 2026-02-10.*
