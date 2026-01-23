# Screen 17 — Mediation and settlement (Traceability)

## User story → Test mapping

| Acceptance Criteria | Test File | Test IDs | Status |
|---------------------|-----------|----------|--------|
| AC-1: Display mediation guidance | mediationSettlement.test.js | D-1, D-2 | ⏳ Pending |
| AC-2: Ask mediation question | mediationSettlement.test.js | D-3 | ⏳ Pending |
| AC-3: Mediation details when Yes | mediationSettlement.test.js | CD-2, CD-7 | ⏳ Pending |
| AC-4: Mediation details optional | mediationSettlement.test.js | OF-1, CV-1 | ⏳ Pending |
| AC-5: Mediation character limit | mediationSettlement.test.js | CV-2, CV-6 | ⏳ Pending |
| AC-6: Display settlement guidance | mediationSettlement.test.js | D-4 | ⏳ Pending |
| AC-7: Ask settlement question | mediationSettlement.test.js | D-5 | ⏳ Pending |
| AC-8: Settlement details when Yes | mediationSettlement.test.js | CD-5, CD-8 | ⏳ Pending |
| AC-9: Settlement details optional | mediationSettlement.test.js | OF-2, CV-3 | ⏳ Pending |
| AC-10: Settlement character limit | mediationSettlement.test.js | CV-4, CV-6 | ⏳ Pending |
| AC-11: Both selections required | mediationSettlement.test.js | RV-1 to RV-8 | ⏳ Pending |
| AC-12: Preserve inputs on error | mediationSettlement.test.js | IP-1 to IP-4 | ⏳ Pending |
| AC-13: Persist responses | mediationSettlement.test.js | SS-1 to SS-6 | ⏳ Pending |
| AC-14: Continue navigation | mediationSettlement.test.js | FN-1 to FN-3 | ⏳ Pending |
| AC-15: Previous navigation | mediationSettlement.test.js | BN-1, BN-2 | ⏳ Pending |
| AC-16: Cancel behaviour | mediationSettlement.test.js | BN-3, BN-4 | ⏳ Pending |
| AC-17: Accessibility compliance | mediationSettlement.test.js | A-1 to A-8 | ⏳ Pending |

---

## Additional coverage

| Requirement | Test File | Test IDs | Status |
|-------------|-----------|----------|--------|
| Q4: Data clearing when No selected | mediationSettlement.test.js | DC-1 to DC-4, CD-1, CD-3, CD-4, CD-6, OF-4 | ⏳ Pending |
| Q5: 251 characters trigger error | mediationSettlement.test.js | CV-2, CV-4 | ⏳ Pending |

---

## Test file summary

| Test File | Total Tests | ACs Covered | Status |
|-----------|-------------|-------------|--------|
| mediationSettlement.test.js | 62 | AC-1 to AC-17 + Q4, Q5 | ⏳ Not yet created |

---

## Coverage summary

- **Total ACs:** 17
- **Total tests planned:** 62
- **Coverage:** 100% (all ACs covered)
- **Additional tests:** 12 (conditional display + data clearing behavior)

---

## Dependencies

### Prerequisite screens
- Screen 1: Claim type
- Screen 12: Tenancy type
- Screen 13.1: Assured confirmation
- Screen 13.1.1: Assured grounds selection
- Screen 16: Pre-action protocol

### Navigation helper
- `navigateToMediationSettlement(agent)` in `sessionHelper.js`

### Downstream screens
- Screen TBD: Notice of intention (`/claims/notice-of-intention`)

---

## Implementation complexity

**Complexity:** ⭐⭐⭐ Medium-High

**Key challenges:**
1. **Conditional display logic** — Text areas show/hide via JavaScript
2. **Data clearing** — Must clear details when switching Yes→No
3. **Multiple validations** — 2 required fields + 2 optional char-limited fields
4. **Input preservation** — All 4 fields must preserve on error
5. **Complex error states** — Up to 4 simultaneous errors possible

**Frontend requirements:**
- JavaScript for conditional display (or progressive enhancement)
- Character counting hints (optional but helpful)
- Multiple error handling

---

## Notes

- **Entry point:** Screen 16 (Pre-action protocol)
- **Route:** `/claims/mediation-settlement`
- **Session path:** `session.claim.mediationSettlement`
- **Previous:** Returns to Screen 16 (`/claims/preaction-protocol`) (Q2)
- **Next:** Redirects to `/claims/notice-of-intention` (Q3)
- **Cancel:** Returns to `/case-list`
- **Settlement guidance:** Generic for all claim types (Q1)
- **Character limit:** Exactly 251 chars triggers error (Q5)
- **Details fields:** Optional when Yes selected (AC-4, AC-9)
- **Data clearing:** Switch Yes→No clears details (Q4)

---

## Session data structure

```js
session.claim.mediationSettlement = {
  mediationAttempted: true | false,     // Required
  mediationDetails: string | null,      // Optional, max 250 chars
  settlementAttempted: true | false,    // Required
  settlementDetails: string | null      // Optional, max 250 chars
}
```

**Storage rules:**
- Radio No → details = null (cleared)
- Radio Yes + empty → details = "" or null
- Radio Yes + text → details = string (max 250)
- Switching Yes→No → clear details (set to null)
