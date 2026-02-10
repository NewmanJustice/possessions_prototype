# Screen 13.1.1 Update Analysis - Assured Tenancy Grounds Selection
**Date:** 2026-01-23  
**Tester:** Nigel  
**For:** Steve (review) → Claude (implementation)

## Summary

Screen 13.1.1 has been updated with new routing and a new "Add additional grounds" button pattern. The checkboxes remain the same, but the bottom section has significant changes.

---

## What Changed

### Context Changes
- **OLD:** Reached from Screen 13.1 (rent arrears question)
- **NEW:** Reached from Screen 13.1 (assured confirmation) after selecting "Yes"

### Route Changes
- **OLD:** `/claims/assured-tenancy-grounds-selection`
- **NEW:** `/claims/grounds-for-possession-assured-selection`

### Additional Grounds Section - Major Changes

**OLD Pattern (Radio + Continue button):**
- Radio: "Do you have any other grounds for possession?"
  - Yes → `/claims/other-tenancy-grounds`
  - No → `/claims/reasons-for-possessions`

**NEW Pattern (Radio + Button + Continue button):**
- Radio: "Do you have any additional grounds for possession?"
  - Yes → `/claims/grounds-for-possession` (title: "Additional grounds for possession")
  - No → `/claims/preaction-protocol` (Screen 16)
- **NEW Button:** "Add additional grounds"
  - Immediately redirects to `/claims/grounds-for-possession` (bypasses Continue)
  - Same destination as "Yes" radio path

### Session Data - No Changes
```js
session.claim.grounds.assuredTenancy = {
  ground8: true | false,
  ground10: true | false,
  ground11: true | false
}
session.claim.grounds.hasAdditionalGrounds = true | false
```

---

## New Acceptance Criteria

### AC-6 (NEW) - Add additional grounds button
- Display button alongside radio options
- Button must be keyboard-focusable
- Button must have accessible name

### AC-7 (UPDATED) - Validation logic
- **OLD:** Error if radio not selected
- **NEW:** Error if radio not selected AND button not pressed
- Allows bypassing radio selection via button

### AC-8 (NEW) - Button behavior
- Button click stores `hasAdditionalGrounds = true`
- Immediately redirects (no Continue button press needed)
- Destination page title: "Additional grounds for possession"

### AC-9 (UPDATED) - Yes radio path
- **OLD:** → `/claims/other-tenancy-grounds`
- **NEW:** → `/claims/grounds-for-possession` (title: "Additional grounds for possession")

### AC-10 (UPDATED) - No radio path
- **OLD:** → `/claims/reasons-for-possessions`
- **NEW:** → `/claims/preaction-protocol` (Screen 16)

---

## Impact on Existing Artifacts

### Test Artifacts
- ✏️ **understanding.md** - Update routing, add button behavior
- ✏️ **test-plan.md** - Add button interaction tests
- ✏️ **test-matrix.md** - Add 5+ new test cases for button
- ✏️ **traceability.md** - Update AC-6 to AC-10 coverage

### Executable Tests
- ✏️ **assuredTenancyGrounds.test.js** (currently 42 tests)
  - Update route name references
  - Update destination routes (AC-9, AC-10)
  - Add ~8 new tests for button behavior
  - Update validation tests (AC-7)
  - **New total: ~50 tests**

### Navigation Helpers
- ✏️ **sessionHelper.js**
  - Update route to `/claims/grounds-for-possession-assured-selection`
  - Already done in Screen 13.1 update

---

## New Test Cases Needed

### Button Behavior (AC-6, AC-8)
- T-6.1: Button displays with correct label
- T-6.2: Button is keyboard accessible
- T-6.3: Button has accessible name
- T-8.1: Button click stores hasAdditionalGrounds = true
- T-8.2: Button click redirects to /claims/grounds-for-possession
- T-8.3: Button click bypasses Continue button
- T-8.4: Destination page title is "Additional grounds for possession"

### Updated Validation (AC-7)
- T-7.1: No error if button pressed (even without radio selection)
- T-7.2: Error if neither radio selected nor button pressed

### Updated Routing (AC-9, AC-10)
- Update existing tests to new destination routes

**Estimated new tests:** ~8  
**Tests to update:** ~6  
**New total:** ~50 tests (was 42)

---

## Questions for Steve

**Q1:** The "Add additional grounds" button - should this be a **secondary button** style (grey) or **primary button** style (green)?

**Q2:** Should the button be positioned:
- a) Before the radio options?
- b) After the radio options?
- c) Next to the radio label?

**Q3:** What's the button's exact label text? "Add additional grounds" or something else?

**Q4:** Screen 16 (`/claims/preaction-protocol`) - does this exist yet, or is it a placeholder?

**Q5:** The "Additional grounds for possession" page title requirement - should this be enforced in tests, or is it just guidance for when that screen is built?

---

## Recommended Approach

1. Get answers to Q1-Q5
2. Update all 4 test artifact files
3. Add ~8 new tests + update ~6 existing tests
4. Update implementation guide for Claude

---

Awaiting your answers, Steve! 🎯
