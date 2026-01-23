# Screen 16 — Pre-action protocol (Traceability)

## User story → Test mapping

| Acceptance Criteria | Test File | Test IDs | Status |
|---------------------|-----------|----------|--------|
| AC-1: Display pre-action protocol guidance | preActionProtocol.test.js | D-1, D-2, D-3 | ⏳ Pending |
| AC-2: Ask whether protocol followed | preActionProtocol.test.js | D-4, D-5, D-6, D-7 | ⏳ Pending |
| AC-3: Selection required | preActionProtocol.test.js | V-1 to V-6 | ⏳ Pending |
| AC-4: Yes path (protocol followed) | preActionProtocol.test.js | Y-1, Y-2, Y-3 | ⏳ Pending |
| AC-5: No path (protocol not followed) | preActionProtocol.test.js | N-1, N-2, N-3 | ⏳ Pending |
| AC-6: Previous navigation | preActionProtocol.test.js | P-1, P-2 | ⏳ Pending |
| AC-7: Cancel behaviour | preActionProtocol.test.js | C-1, C-2 | ⏳ Pending |
| AC-8: Accessibility compliance | preActionProtocol.test.js | A-1 to A-5 | ⏳ Pending |

---

## Additional coverage

| Requirement | Test File | Test IDs | Status |
|-------------|-----------|----------|--------|
| Session data updates (Q3) | preActionProtocol.test.js | S-1, S-2, S-3 | ⏳ Pending |

---

## Test file summary

| Test File | Total Tests | ACs Covered | Status |
|-----------|-------------|-------------|--------|
| preActionProtocol.test.js | 31 | AC-1 to AC-8 + Q3 | ⏳ Not yet created |

---

## Coverage summary

- **Total ACs:** 8
- **Total tests planned:** 31
- **Coverage:** 100% (all ACs covered)
- **Additional tests:** 3 (session update behavior)

---

## Dependencies

### Prerequisite screens
- Screen 1: Claim type
- Screen 12: Tenancy type
- Screen 13.1: Assured confirmation
- Screen 13.1.1: Assured grounds selection

### Navigation helper
- `navigateToPreActionProtocol(agent)` in `sessionHelper.js`

### Downstream screens
- Screen TBD: Mediation settlement (`/claims/mediation-settlement`)

---

## Notes

- **Entry point:** Screen 13.1.1 (No additional grounds)
- **Route:** `/claims/preaction-protocol`
- **Session path:** `session.claim.preActionProtocol.followed`
- **Convergent routing:** Both Yes/No → `/claims/mediation-settlement`
- **Previous:** Returns to Screen 13.1 (`/claims/grounds-for-possession-assured-confirmation`)
- **Cancel:** Returns to `/case-list`
- **Content testing:** Presence-only (not specific text)
