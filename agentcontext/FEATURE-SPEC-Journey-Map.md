# Feature Spec: Claims Journey Map

**Status:** Draft v2
**Created:** 2026-02-10
**Author:** Claude (with user input)

---

## 1. Problem Statement

Users navigating the 39-screen possessions claim journey have no visibility of:
- What questions are coming next
- How far through the process they are
- Which sections remain to be completed

This creates uncertainty and anxiety, particularly for professional solicitors managing multiple claims.

---

## 2. User Need

> As a **professional solicitor** making a possession claim,
> I need to **see what questions are coming up in the journey**,
> So that I can **prepare the required information in advance and understand the overall process**.

---

## 3. Proposed Solution

A **Journey Map** - a bespoke visual component inspired by a London Tube map that shows the claims journey as a series of connected "stations" (questions) along coloured "lines" (sections).

**Key characteristics:**
- Vertical orientation
- Slide-out panel accessible from any claims screen
- View-only (no navigation/jumping to screens)
- Expandable stations showing question detail and required information
- Visual indication of progress (completed, current, upcoming)

---

## 4. Design Concept

### 4.1 Visual Metaphor: Tube Map

**Not a literal tube map** but inspired by its visual language:
- **Lines** = Journey sections (coloured vertical lines)
- **Stations** = Individual questions/screens (circular markers on the line)
- **Interchanges** = Decision points where paths diverge
- **Zones** = Logical groupings of related questions

### 4.2 Visual States

| State | Appearance |
|-------|------------|
| **Completed** | Grey circle, grey line segment, muted text |
| **Current** | Highlighted colour (e.g., blue), prominent marker |
| **Upcoming** | Full colour circle, standard text |

### 4.3 Layout (Vertical)

```
┌──────────────────────────────────────────────────┐
│  ✕  Your claim journey                           │
├──────────────────────────────────────────────────┤
│                                                  │
│  ELIGIBILITY                                     │
│  ════════════                                    │
│      ●───── Check eligibility           [done]   │
│      │                                           │
│      ●───── Confirm location            [done]   │
│      │                                           │
│      ●───── Select claimant type        [done]   │
│      │                                           │
│                                                  │
│  CLAIMANT DETAILS                                │
│  ════════════════                                │
│      ●───── Claimant name               [done]   │
│      │                                           │
│      ◉───── Contact preferences      [current]   │
│      │        ┌────────────────────────────┐     │
│      │        │ What contact details do    │     │
│      │        │ you want on the claim?     │     │
│      │        │                            │     │
│      │        │ You'll need:               │     │
│      │        │ • Email address            │     │
│      │        │ • Postal address           │     │
│      │        └────────────────────────────┘     │
│      │                                           │
│      ○───── Claimant address                     │
│      │                                           │
│                                                  │
│  DEFENDANT DETAILS                               │
│  ═════════════════                               │
│      ○───── Defendant information                │
│      │                                           │
│                                                  │
│  TENANCY                                         │
│  ═══════                                         │
│      ○───── Property address                     │
│      │                                           │
│      ○───── Type of tenancy                      │
│      │                                           │
│      ├─────────────┬─────────────┐               │
│      │             │             │               │
│   [Assured]    [Secure]    [Flexible]            │
│      │             │             │               │
│      ○             ○             ○               │
│      │             │             │               │
│      └─────────────┴─────────────┘               │
│      │                                           │
│                                                  │
│  ... continues ...                               │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.4 Expandable Stations

Each station (question) shows:
- **Collapsed:** Station marker + Title only
- **Expanded (on click):**
  - Question being asked
  - What information/documents are needed
  - Any relevant notes

### 4.5 Branching Paths

For conditional routes (e.g., tenancy type), show diverging lines that rejoin:

```
        ○ Type of tenancy
        │
    ┌───┴───┬───────┐
    │       │       │
 Assured  Secure  Flexible
    │       │       │
    ○       ○       ○   ← Each has different grounds questions
    │       │       │
    └───┬───┴───────┘
        │
        ○ Pre-action protocol
```

**Alternative considered:** Only show the user's relevant path based on their selection. This would simplify the view but hide the overall journey structure. *Keeping divergent view for now to show full picture.*

---

## 5. Journey Zones & Stations

| Zone | Colour | Stations (Questions) |
|------|--------|----------------------|
| **1. Eligibility** | Green | Check eligibility, Property location, Claimant type |
| **2. Claim Type** | Green | Type of claim |
| **3. Claimant Details** | Blue | Claimant name, Contact preferences, Claimant address |
| **4. Defendant Details** | Blue | Defendant information |
| **5. Property & Tenancy** | Purple | Property address, Type of tenancy |
| **6. Grounds for Possession** | Orange | *Branches by tenancy type* - Assured grounds / Secure grounds / Flexible grounds |
| **7. Pre-action & Notice** | Orange | Pre-action protocol, Mediation attempts, Notice served, Notice details |
| **8. Rent & Arrears** | Red | Rent amount, Daily calculation, Arrears details |
| **9. Money Judgment** | Red | Request judgment, Claimant circumstances, Defendant circumstances |
| **10. Alternatives** | Yellow | *Conditional* - Alternative remedies, Suspension, Demotion |
| **11. Additional Info** | Grey | Costs, Additional reasons, Underlessee/mortgagee, Documents, Applications |
| **12. Submit** | Black | Language, Completing claim, Statement of truth, Check answers, Pay fee |

---

## 6. Slide-out Panel Behaviour

### 6.1 Trigger
- Link/button on every claims page: **"View journey map"**
- Position: Below phase banner or in page header area
- Alternatively: Fixed position button on right edge of screen

### 6.2 Panel Behaviour
- Slides in from **right side** of screen
- Width: ~400px (or responsive %)
- Overlay with semi-transparent backdrop
- Close via ✕ button or clicking backdrop
- Scrollable content within panel
- Current position auto-scrolled into view on open

### 6.3 Accessibility
- Focus trapped within panel when open
- Escape key closes panel
- Screen reader announcement on open
- All stations keyboard-navigable for expand/collapse

---

## 7. GDS-Inspired Styling

While bespoke, the component should feel native to GOV.UK:

| Element | GOV.UK Style |
|---------|--------------|
| Typography | GDS Transport font, standard sizes |
| Colours | GOV.UK colour palette (blue, green, red, etc.) |
| Spacing | 8px grid system |
| Focus states | Yellow 3px outline |
| Panel header | Similar to GOV.UK notification banner |
| Close button | Text link style, not icon-only |

---

## 8. Technical Approach

### 8.1 New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `journey-map-panel.njk` | `src/views/partials/` | Slide-out panel markup |
| `journey-map.css` | `public/css/` | Custom styles for map |
| `journey-map.js` | `public/js/` | Panel open/close, expand/collapse |
| Journey map data | `src/services/journeyMapService.js` | Zone/station definitions, status calculation |

### 8.2 No New Route Required

Panel is rendered as part of the main layout and shown/hidden via JavaScript. No separate page needed.

### 8.3 Session Integration

Read from `req.session.claimDraft` to determine:
- Which stations are completed (check for populated data)
- Current station (based on current URL)
- Tenancy type selected (for branch display)

### 8.4 Data Structure

```javascript
const journeyZones = [
  {
    id: 'eligibility',
    name: 'Eligibility',
    colour: 'green',
    stations: [
      {
        id: 'check-eligibility',
        title: 'Check eligibility',
        question: 'Is this property eligible for a possession claim?',
        requirements: ['Property must be in England or Wales'],
        url: '/claims/eligibility',
        sessionCheck: (draft) => !!draft.eligibilityConfirmed
      },
      // ... more stations
    ]
  },
  // ... more zones
];
```

---

## 9. Acceptance Criteria

### Must Have
- [ ] Slide-out panel accessible from any claims screen
- [ ] Vertical tube-map inspired visualisation
- [ ] Zones grouping related questions
- [ ] Stations (circles) representing each question
- [ ] Coloured lines connecting stations within zones
- [ ] Visual distinction: completed (grey), current (highlighted), upcoming (full colour)
- [ ] Expandable stations showing question detail and requirements
- [ ] Branching paths shown for tenancy type decision
- [ ] GDS-inspired look and feel
- [ ] Close via button, backdrop click, or Escape key
- [ ] Current position scrolled into view on open

### Should Have
- [ ] Smooth slide animation
- [ ] Keyboard accessible (tab through stations, Enter to expand)
- [ ] Screen reader friendly

### Could Have
- [ ] Persist expand/collapse state
- [ ] Mini progress indicator always visible (e.g., "Section 3 of 12")
- [ ] Print view of journey map

### Won't Have (this iteration)
- [ ] Click-to-navigate to stations
- [ ] Citizen user variant
- [ ] Estimated times per station

---

## 10. Open Questions (Resolved)

| Question | Decision |
|----------|----------|
| Task list vs bespoke? | **Bespoke** tube-map inspired design |
| Orientation? | **Vertical** |
| Full page vs panel? | **Slide-out panel** |
| Show all branches or just user's path? | **Show all branches** (note: could simplify later) |
| Navigation allowed? | **View-only** |
| Current position indicator? | **Different colour** (highlighted) |
| Completed stations? | **Greyed out** |

---

## 11. Test Scenarios

1. **Panel opens** - Click trigger, panel slides in from right
2. **Panel closes** - Via close button, backdrop, or Escape key
3. **Completed stations** - Grey appearance, collapsed by default
4. **Current station** - Highlighted colour, auto-scrolled into view
5. **Expand station** - Click shows question and requirements
6. **Branching display** - Shows all tenancy paths when at/before decision
7. **After branch selected** - Still shows all paths but current path emphasised
8. **Accessibility** - Keyboard navigation, focus trap, screen reader

---

## 12. Visual Reference

*Inspired by but not copying the London Underground map:*
- Vertical flow (top to bottom)
- Clean lines connecting circular station markers
- Colour-coded sections/zones
- Clear typography
- Decision points shown as line divergence

---

## 13. Next Steps

1. **Review and approve** this spec
2. **Create user story** (Cass agent)
3. **Write tests** (Nigel agent)
4. **Implement** (Claude agent)

---

*Feedback welcome before proceeding to implementation pipeline.*
