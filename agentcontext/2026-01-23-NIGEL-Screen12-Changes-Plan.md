# Screen 12 Update Plan - Grounds Model Logic
**Date:** 2026-01-23  
**Tester:** Nigel  
**Reviewed by:** Steve (pending)

## Summary
The Screen 12 user story has been updated with new ACs (AC-13 through AC-16) that introduce **grounds model determination** based on tenancy type. This plan outlines what needs to change in test artifacts, tests, and implementation.

---

## What's New in the Updated User Story

### New Acceptance Criteria

**AC-13: Determine grounds model from tenancy/licence type**
- When tenancy details are saved, the service must determine and store a `groundsModel`

**AC-14: Grounds model persistence**
- Store as `session.claim.tenancy.groundsModel`
- Used to drive subsequent routing and grounds selection

**AC-15: Grounds model mapping**
- Assured tenancy → `ASSURED`
- Secure tenancy → `SECURE_LIKE`
- Introductory tenancy → `SECURE_LIKE`
- Flexible tenancy → `SECURE_LIKE`
- Demoted tenancy → `OTHER_UNSUPPORTED`
- Other → `OTHER_UNSUPPORTED`

**AC-16: Clear incompatible downstream grounds data**
- If user changes tenancy type (causing groundsModel change), clear incompatible grounds selections

### Updated Session Model
```js
session.claim.tenancy = {
  type: 'assured-tenancy' | 'secure-tenancy' | 'introductory-tenancy' | 'flexible-tenancy' | 'demoted-tenancy' | 'other',
  otherTypeDetails: string | null,
  startDate: { day, month, year } | null,
  documents: [{ id, name, uploadedAt }],
  groundsModel: 'ASSURED' | 'SECURE_LIKE' | 'OTHER_UNSUPPORTED'  // ← NEW
}
```

---

## Impact Analysis

### 1. Test Artifacts (Medium Impact)

**Files to update:**
- `prototype/test/artifacts/screen12/understanding.md`
- `prototype/test/artifacts/screen12/test-plan.md`
- `prototype/test/artifacts/screen12/test-matrix.md`
- `prototype/test/artifacts/screen12/traceability.md`

**Changes needed:**
- Add groundsModel determination to key behaviours
- Add mapping table (tenancy type → groundsModel) to understanding
- Add state clearing logic when tenancy type changes
- Update session structure documentation

---

### 2. Executable Tests (Medium Impact)

**File to update:**
- `prototype/test/routes/tenancy.test.js` (currently 1067 lines, 68 tests)

**New test cases needed:**

#### Grounds Model Determination (AC-13, AC-14, AC-15)
- [ ] T-13.1: Assured tenancy sets groundsModel to 'ASSURED'
- [ ] T-13.2: Secure tenancy sets groundsModel to 'SECURE_LIKE'
- [ ] T-13.3: Introductory tenancy sets groundsModel to 'SECURE_LIKE'
- [ ] T-13.4: Flexible tenancy sets groundsModel to 'SECURE_LIKE'
- [ ] T-13.5: Demoted tenancy sets groundsModel to 'OTHER_UNSUPPORTED'
- [ ] T-13.6: Other tenancy sets groundsModel to 'OTHER_UNSUPPORTED'

#### State Clearing on Tenancy Change (AC-16)
- [ ] T-16.1: Changing from ASSURED to SECURE_LIKE clears assured grounds
- [ ] T-16.2: Changing from SECURE_LIKE to ASSURED clears secure grounds
- [ ] T-16.3: Changing within same groundsModel preserves grounds data
- [ ] T-16.4: No grounds data to clear doesn't cause errors
- [ ] T-16.5: Changing to OTHER_UNSUPPORTED clears all grounds

**Estimated new tests:** ~11 tests  
**New total:** ~79 tests

---

### 3. Implementation (Medium Impact)

**File to update:**
- `prototype/src/routes/claims.js` - POST /tenancy route handler

**Changes needed:**

#### Add groundsModel determination function
```js
function determineGroundsModel(tenancyType) {
  const mapping = {
    'assured-tenancy': 'ASSURED',
    'secure-tenancy': 'SECURE_LIKE',
    'introductory-tenancy': 'SECURE_LIKE',
    'flexible-tenancy': 'SECURE_LIKE',
    'demoted-tenancy': 'OTHER_UNSUPPORTED',
    'other': 'OTHER_UNSUPPORTED'
  };
  return mapping[tenancyType] || 'OTHER_UNSUPPORTED';
}
```

#### Update POST /tenancy handler
```js
// After successful validation, before saving to session:
const groundsModel = determineGroundsModel(tenancyType);

// Check if groundsModel changed from previous visit
const previousGroundsModel = req.session.claim?.tenancy?.groundsModel;
if (previousGroundsModel && previousGroundsModel !== groundsModel) {
  // Clear incompatible grounds data
  if (req.session.claim.grounds) {
    // Clear assured grounds if changing away from ASSURED
    if (previousGroundsModel === 'ASSURED' && groundsModel !== 'ASSURED') {
      delete req.session.claim.grounds.assuredTenancy;
      delete req.session.claim.grounds.rentArrears;
      delete req.session.claim.grounds.hasAdditionalGrounds;
    }
    // Clear secure-like grounds if changing away from SECURE_LIKE
    if (previousGroundsModel === 'SECURE_LIKE' && groundsModel !== 'SECURE_LIKE') {
      delete req.session.claim.grounds.secureTenancy;
      // Clear any other secure-specific data
    }
    // If changing to OTHER_UNSUPPORTED, clear all grounds
    if (groundsModel === 'OTHER_UNSUPPORTED') {
      delete req.session.claim.grounds;
    }
  }
}

// Save to session with groundsModel
req.session.claim.tenancy = {
  type: tenancyType,
  otherTypeDetails: otherTypeDetails || null,
  startDate: startDate || null,
  documents: documents || [],
  groundsModel: groundsModel  // ← NEW
};
```

---

### 4. Downstream Routing Impact (High Impact)

**Routing Table (from updated user story):**

| `groundsModel`      | Next route after Screen 12                                  | Notes                    |
| ------------------- | ----------------------------------------------------------- | ------------------------ |
| `ASSURED`           | `/claims/grounds-for-possession-assured` (Screen 13.1)      | Current flow remains     |
| `SECURE_LIKE`       | `/claims/grounds-for-possession-secure-flexible` (Screen 13.2) | New route needed      |
| `OTHER_UNSUPPORTED` | `/claims/grounds-for-possession-intro-demoted-other` (Screen 13.3) | New route needed  |

**Current State:**
- Screen 12 currently redirects to `/claims/grounds` (hardcoded)
- Screen 13.1 route is `/claims/grounds` (not `/claims/grounds-for-possession-assured`)

**Routing Changes Needed:**

#### Option A: Rename existing route (breaking change)
- Rename `/claims/grounds` → `/claims/grounds-for-possession-assured`
- Update all tests and navigation helpers

#### Option B: Keep existing route, add conditional routing
- Keep `/claims/grounds` as is (for ASSURED)
- Add conditional redirect logic in Screen 12:
  ```js
  if (groundsModel === 'ASSURED') {
    res.redirect('/claims/grounds');
  } else if (groundsModel === 'SECURE_LIKE') {
    res.redirect('/claims/grounds-for-possession-secure-flexible');
  } else if (groundsModel === 'OTHER_UNSUPPORTED') {
    res.redirect('/claims/grounds-for-possession-intro-demoted-other');
  }
  ```

**Steve's Answers:**
- Q2 (✓): Yes, rent arrears question (Screen 13.1) is ASSURED-only
- Q3 (✓): Routing table provided above
- Q4 (✓): Screen 13.3 work paused

---

## Recommended Approach

### Phase 1: Update Screen 12 (Immediate)
1. Update test artifacts to document groundsModel logic
2. Add 11 new tests for groundsModel determination and state clearing
3. Update implementation to set groundsModel and clear incompatible data
4. Keep current redirect to `/claims/grounds` for all tenancy types (backward compatible)

### Phase 2: Update Journey Routing (After Steve confirms routing)
1. Add conditional routing from Screen 12 based on groundsModel
2. Update Screen 13.1 to only show for ASSURED groundsModel
3. Create new grounds journeys for SECURE_LIKE and OTHER_UNSUPPORTED
4. Update navigation tests across affected screens

---

## Questions for Steve

**Q5:** Should we:
- **Option A:** Rename `/claims/grounds` → `/claims/grounds-for-possession-assured` (matches routing table, but breaks existing tests/implementation)
- **Option B:** Keep `/claims/grounds` for ASSURED, add new routes for SECURE_LIKE and OTHER_UNSUPPORTED (backward compatible)

**Q6:** Screen 13.1.1 (`/claims/assured-tenancy-grounds-selection`) - should this also be renamed to fit the new naming convention?

**Q7:** For this Screen 12 update, should I:
- Update tests/implementation to conditionally route based on groundsModel
- OR just add groundsModel to session and keep hardcoded redirect to `/claims/grounds` (Claude will add routing later when implementing Screen 13.2/13.3)

---

## Estimated Effort

**Phase 1 only (groundsModel determination + state clearing):**
- Update test artifacts: 30 mins
- Write 11 new tests: 45 mins
- Update implementation: 30 mins
- Verify all tests pass: 15 mins
- **Total: ~2 hours**

**Phase 2 (conditional routing based on groundsModel):**
- Depends on routing decisions (TBD)

---

## Dependencies

- Clarity on routing logic for different groundsModels
- Confirmation of which screens apply to which tenancy types
- Decision on whether to implement groundsModel in isolation or with full routing

---

## Next Steps

Awaiting Steve's answers to Q1-Q4 before proceeding with test artifact updates.

