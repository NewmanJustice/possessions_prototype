# Screen 18 — Notice of intention (Traceability)

## User story → Test mapping

| Acceptance Criteria | Test File | Test IDs | Status |
|---------------------|-----------|----------|--------|
| AC-1: Display notice guidance | noticeOfIntention.test.js | D-1 to D-4, L-1 to L-3 | ⏳ Pending |
| AC-2: Ask whether notice served | noticeOfIntention.test.js | D-5, D-6, D-7, D-8 | ⏳ Pending |
| AC-3: Selection required | noticeOfIntention.test.js | V-1 to V-6 | ⏳ Pending |
| AC-4: Persist notice confirmation | noticeOfIntention.test.js | Y-1, Y-3, N-1, N-3 | ⏳ Pending |
| AC-5: Continue navigation | noticeOfIntention.test.js | Y-2, N-2 | ⏳ Pending |
| AC-6: Previous navigation | noticeOfIntention.test.js | P-1, P-2 | ⏳ Pending |
| AC-7: Cancel behaviour | noticeOfIntention.test.js | C-1, C-2 | ⏳ Pending |
| AC-8: Accessibility compliance | noticeOfIntention.test.js | A-1 to A-5 | ⏳ Pending |

---

## Additional coverage

| Requirement | Test File | Test IDs | Status |
|-------------|-----------|----------|--------|
| Session data updates | noticeOfIntention.test.js | S-1, S-2, S-3 | ⏳ Pending |
| Q1: Link attributes | noticeOfIntention.test.js | L-1, L-2 | ⏳ Pending |
| Q2: Presence-only content | noticeOfIntention.test.js | D-2, D-3 | ⏳ Pending |

---

## Test file summary

| Test File | Total Tests | ACs Covered | Status |
|-----------|-------------|-------------|--------|
| noticeOfIntention.test.js | 35 | AC-1 to AC-8 + session updates | ⏳ Not yet created |

---

## Coverage summary

- **Total ACs:** 8
- **Total tests planned:** 35
- **Coverage:** 100% (all ACs covered)
- **Additional tests:** 6 (external link attributes + session updates)

---

## Dependencies

### Prerequisite screens
- Screen 1: Claim type
- Screen 12: Tenancy type
- Screen 13.1: Assured confirmation
- Screen 13.1.1: Assured grounds selection
- Screen 16: Pre-action protocol
- Screen 17: Mediation and settlement

### Navigation helper
- `navigateToNoticeOfIntention(agent)` in `sessionHelper.js`

### Downstream screens
- Screen TBD: Notice details (`/claims/notice-details`) (Q3)

---

## Notes

- **Entry point:** Screen 17 (Mediation and settlement)
- **Route:** `/claims/notice-of-intention`
- **Session path:** `session.claim.noticeOfIntention.noticeServed`
- **Convergent routing:** Both Yes/No → `/claims/notice-details`
- **Previous:** Returns to Screen 17 (`/claims/mediation-settlement`)
- **Cancel:** Returns to `/case-list`
- **Content testing:** Presence-only (Q2)
- **External link:** Must verify `target="_blank"` and `rel="noopener noreferrer"` (Q1)
- **Similar pattern:** Same structure as Screen 16 (Pre-action protocol)
