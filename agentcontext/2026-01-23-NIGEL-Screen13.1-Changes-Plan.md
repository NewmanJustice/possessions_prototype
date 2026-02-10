# Screen 13.1 Update Plan - Assured Journey Confirmation
**Date:** 2026-01-23  
**Tester:** Nigel  
**For:** Steve (review) → Claude (implementation)

## Summary

Screen 13.1 has been **completely replaced** with new functionality. The old "rent arrears question" has been replaced with an "assured journey confirmation" screen.

---

## What's Changed

### OLD Screen 13.1 (Rent Arrears Question)
- **Route:** `/claims/grounds`
- **Question:** "Are you claiming possession because of rent arrears?"
- **Purpose:** Branch between rent arrears grounds (8/10/11) and other grounds
- **Branching:**
  - Yes → `/claims/assured-tenancy-grounds-selection`
  - No → `/claims/other-tenancy-grounds`
- **Session:** `session.claim.grounds.rentArrears = true | false`

### NEW Screen 13.1 (Assured Journey Confirmation)
- **Route:** `/claims/grounds-for-possession-assured-confirmation`
- **Question:** "Do you want to proceed with assured-tenancy grounds?"
- **Purpose:** Confirm if user wants to use assured-tenancy grounds or switch to alternate flow
- **Branching:**
  - Yes → `/claims/grounds-for-possession-assured-selection` (Screen 13.1.1)
  - No → `/claims/grounds-for-possession` (Screen 14.1 - alternate grounds)
- **Session:** `session.claim.grounds.assuredProceed = true | false`

---

## Impact Analysis

### 1. Complete Rewrite Required

**This is NOT an update - it's a full replacement:**
- Different route name
- Different question
- Different session data structure
- Different branching logic
- Different next destinations

### 2. Files to Replace

**Test Artifacts:**
- `prototype/test/artifacts/screen13.1/understanding.md` - REWRITE
- `prototype/test/artifacts/screen13.1/test-plan.md` - REWRITE
- `prototype/test/artifacts/screen13.1/test-matrix.md` - REWRITE
- `prototype/test/artifacts/screen13.1/traceability.md` - REWRITE

**Executable Tests:**
- `prototype/test/routes/grounds.test.js` - REWRITE (17 tests)
  - Currently tests rent arrears question at `/claims/grounds`
  - Needs to test assured confirmation at `/claims/grounds-for-possession-assured-confirmation`

**Implementation:**
- Route handler needs complete replacement
- Template needs complete replacement

---

## Key Questions for Steve

**Q1:** What happened to the "rent arrears" question? Is it:
- a) Removed entirely from the journey?
- b) Moved to a different screen?
- c) Merged into Screen 13.1.1 (assured selection)?

**Q2:** The new Screen 13.1 "No" path goes to `/claims/grounds-for-possession` (Screen 14.1). Is this:
- a) A new general grounds selection page (not assured-specific)?
- b) The same as the old `/claims/other-tenancy-grounds`?
- c) Something different?

**Q3:** User story says "If `/claims/grounds-for-possession` has already been visited in this session, then previously stored answers for that screen are preserved." Does this mean:
- a) Users can toggle between assured and non-assured grounds?
- b) This is for the back button scenario?

**Q4:** Journey flow - is this correct?
```
Screen 12 (Tenancy) → Select "Assured"
  ↓
Screen 13.1 (NEW - Assured Confirmation) → "Proceed with assured grounds?"
  ├─ Yes → Screen 13.1.1 (Assured grounds selection - 8/10/11)
  └─ No → Screen 14.1 (General grounds selection?)
```

**Q5:** Should the old `/claims/grounds` route be:
- a) Deleted completely?
- b) Renamed to the new route?
- c) Kept for backward compatibility?

---

## Recommended Approach

### Option A: Get Clarifications First (RECOMMENDED)
1. Wait for Steve's answers to Q1-Q5
2. Understand the full journey flow
3. Then rewrite all artifacts and tests

### Option B: Proceed with Assumptions
1. Assume rent arrears question is removed
2. Assume Screen 14.1 is a new generic grounds page
3. Rewrite Screen 13.1 based on new user story
4. Flag assumptions for Steve to confirm

---

## Awaiting Steve's Guidance

Which option should I take, Steve? I recommend **Option A** to ensure I understand the full picture before rewriting.

