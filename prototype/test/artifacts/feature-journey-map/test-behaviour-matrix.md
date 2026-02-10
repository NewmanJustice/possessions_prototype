# Test Behaviour Matrix - Feature: Journey Map

## Acceptance Criteria to Test Behaviours

### AC-1: Journey map link displayed on all claims pages

**Behaviour:**
- T-TRG-1: Link with text "View journey map" present on `/claims/start`
- T-TRG-2: Link present on `/claims/eligibility`
- T-TRG-3: Link present on `/claims/check-your-answers`
- T-TRG-4: Link has consistent class/ID for targeting
- T-TRG-5: Link positioned below phase banner area

**Test IDs:** T-TRG-1, T-TRG-2, T-TRG-3, T-TRG-4, T-TRG-5

---

### AC-33: Journey map link appears only on claims pages

**Behaviour:**
- T-TRG-6: Link NOT present on `/case-list`
- T-TRG-7: Link NOT present on `/possessions`
- T-TRG-8: Link NOT present on `/auth/sign-in`
- T-TRG-9: Link NOT present on `/access`
- T-TRG-10: Link NOT present on `/health`

**Test IDs:** T-TRG-6, T-TRG-7, T-TRG-8, T-TRG-9, T-TRG-10

---

### AC-4: Panel header displays title and close button

**Behaviour:**
- T-PNL-1: Panel container element present in DOM
- T-PNL-2: Panel title text is "Your claim journey"
- T-PNL-3: Close button element present
- T-PNL-4: Close button has accessible label containing "Close"

**Test IDs:** T-PNL-1, T-PNL-2, T-PNL-3, T-PNL-4

---

### AC-10: Display zones as section headers

**Behaviour:**
- T-ZN-1: Zone "Eligibility" rendered
- T-ZN-2: Zone "Claim Type" rendered
- T-ZN-3: Zone "Claimant Details" rendered
- T-ZN-4: Zone "Defendant Details" rendered
- T-ZN-5: Zone "Property & Tenancy" rendered
- T-ZN-6: Zone "Grounds for Possession" rendered
- T-ZN-7: Zone "Pre-action & Notice" rendered
- T-ZN-8: Zone "Rent & Arrears" rendered
- T-ZN-9: Zone "Money Judgment" rendered
- T-ZN-10: Zone "Alternatives" rendered
- T-ZN-11: Zone "Additional Info" rendered
- T-ZN-12: Zone "Submit" rendered

**Test IDs:** T-ZN-1 to T-ZN-12

---

### AC-24-27: Accessibility compliance (markup)

**Behaviour:**
- T-A11Y-1: Panel has `role="dialog"`
- T-A11Y-2: Panel has `aria-modal="true"`
- T-A11Y-3: Panel has `aria-labelledby` referencing title ID
- T-A11Y-4: Panel title has ID matching aria-labelledby
- T-A11Y-5: Close button has accessible name
- T-A11Y-6: Panel has `hidden` attribute by default

**Test IDs:** T-A11Y-1 to T-A11Y-6

---

## Service Unit Test Behaviours

### Zone Definitions

**Behaviour:**
- T-SVC-ZN-1: `getJourneyZones()` returns array
- T-SVC-ZN-2: Array contains exactly 12 zones
- T-SVC-ZN-3: Each zone has `id` (string)
- T-SVC-ZN-4: Each zone has `name` (string)
- T-SVC-ZN-5: Each zone has `colour` (string)
- T-SVC-ZN-6: Each zone has `stations` (array)
- T-SVC-ZN-7: Zone order matches specification

**Test IDs:** T-SVC-ZN-1 to T-SVC-ZN-7

---

### Station Definitions

**Behaviour:**
- T-SVC-STN-1: Each station has `id` (string)
- T-SVC-STN-2: Each station has `title` (string)
- T-SVC-STN-3: Each station has `url` (string starting with /claims/)
- T-SVC-STN-4: Each station has `question` (string)
- T-SVC-STN-5: Each station has `requirements` (array)
- T-SVC-STN-6: Station IDs are unique across all zones

**Test IDs:** T-SVC-STN-1 to T-SVC-STN-6

---

### Status Calculation

**Behaviour:**
- T-SVC-STS-1: `getStationStatus(session, stationId, currentUrl)` returns string
- T-SVC-STS-2: Returns 'upcoming' when session field empty and not current
- T-SVC-STS-3: Returns 'completed' when session field has value
- T-SVC-STS-4: Returns 'current' when URL matches station URL
- T-SVC-STS-5: Current station takes precedence over completed
- T-SVC-STS-6: `getCurrentStationId(currentUrl)` returns correct station ID
- T-SVC-STS-7: `getCompletedStationIds(session)` returns array of IDs

**Test IDs:** T-SVC-STS-1 to T-SVC-STS-7

---

### Branch Handling

**Behaviour:**
- T-SVC-BR-1: `getBranchingPaths()` returns branching configuration
- T-SVC-BR-2: Assured tenancy branch defined
- T-SVC-BR-3: Secure tenancy branch defined
- T-SVC-BR-4: Flexible tenancy branch defined
- T-SVC-BR-5: `getSelectedBranch(session)` returns branch ID or null
- T-SVC-BR-6: Returns null when tenancy type not selected
- T-SVC-BR-7: Returns correct branch when tenancy type is 'assured-tenancy'

**Test IDs:** T-SVC-BR-1 to T-SVC-BR-7

---

## Test Coverage Summary

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

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-02-10.*
