# Test Behaviour Matrix — Screen 26b: Reasons for requesting a suspension order

## Acceptance Criteria to Test Behaviours

### AC-1: Display page heading and guidance

**Behaviour:**
- T-1.1: Page displays heading "Reasons for requesting a suspension order"
- T-1.2: Guidance text explains why to provide reasons
- T-1.3: Guidance mentions court will use information
- T-1.4: Page is accessible at `/claims/reasons-for-suspension`

**Test IDs:** T-1.1, T-1.2, T-1.3, T-1.4

---

### AC-2: Display reasons text area

**Behaviour:**
- T-2.1: Textarea labelled "Explain the reasons for requesting a suspension order"
- T-2.2: Textarea uses correct name attribute (`reasons`)
- T-2.3: Textarea has appropriate ID for error linking (`reasons`)

**Test IDs:** T-2.1, T-2.2, T-2.3

---

### AC-3: Reasons are optional

**Behaviour:**
- T-3.1: Empty textarea accepted on submission
- T-3.2: No validation error when reasons field is empty
- T-3.3: Form redirects successfully when submitted empty

**Test IDs:** T-3.1, T-3.2, T-3.3

---

### AC-4: Character limit enforced

**Behaviour:**
- T-4.1: Submitting with > 950 chars shows error
- T-4.2: Error message: "Enter 950 characters or fewer"
- T-4.3: GOV.UK error summary displayed
- T-4.4: Inline error message displayed
- T-4.5: Error link targets textarea
- T-4.6: Focus moves to error summary
- T-4.7: Exactly 950 characters accepted
- T-4.8: 951 characters rejected

**Test IDs:** T-4.1, T-4.2, T-4.3, T-4.4, T-4.5, T-4.6, T-4.7, T-4.8

---

### AC-5: Persist suspension order reasons

**Behaviour:**
- T-5.1: Reasons stored in `session.claim.suspensionOrder.reasons`
- T-5.2: Empty input stores `null`
- T-5.3: Text input stores string value
- T-5.4: Existing suspensionOrder data preserved

**Test IDs:** T-5.1, T-5.2, T-5.3, T-5.4

---

### AC-6: Preserve input on revisit

**Behaviour:**
- T-6.1: First visit has empty textarea
- T-6.2: Previously entered text pre-populated on revisit
- T-6.3: Pre-population survives navigation back and forth
- T-6.4: Changed text updates session on resubmit

**Test IDs:** T-6.1, T-6.2, T-6.3, T-6.4

---

### AC-7: Previous navigation

**Behaviour:**
- T-7.1: Clicking Previous redirects to `/claims/alternative-to-possession`
- T-7.2: Previously entered data preserved in session
- T-7.3: No validation on Previous click

**Test IDs:** T-7.1, T-7.2, T-7.3

---

### AC-8: Continue navigation

**Behaviour:**
- T-8.1: Continue with empty reasons redirects to `/claims/claiming-costs`
- T-8.2: Continue with valid reasons redirects to `/claims/claiming-costs`
- T-8.3: Reasons persisted before navigation

**Test IDs:** T-8.1, T-8.2, T-8.3

---

### AC-9: Cancel behaviour

**Behaviour:**
- T-9.1: Clicking Cancel redirects to `/case-list`
- T-9.2: Draft claim remains in session after Cancel

**Test IDs:** T-9.1, T-9.2

---

### AC-10: Accessibility compliance

**Behaviour:**
- T-10.1: GOV.UK error summary displayed on validation failure
- T-10.2: Error links target textarea
- T-10.3: Focus moves to error summary (tabindex="-1")
- T-10.4: Textarea has proper label
- T-10.5: Textarea is keyboard accessible

**Test IDs:** T-10.1, T-10.2, T-10.3, T-10.4, T-10.5

---

## Additional Behaviours (Cross-Cutting)

### Pre-population Behaviour
- T-PRE-1: First visit has empty textarea
- T-PRE-2: Revisit pre-populates previously entered reasons
- T-PRE-3: Pre-population survives navigation

**Test IDs:** T-PRE-1, T-PRE-2, T-PRE-3

### Boundary Testing
- T-BND-1: 949 characters accepted
- T-BND-2: 950 characters accepted (exact boundary)
- T-BND-3: 951 characters rejected (over boundary)
- T-BND-4: Very long text (2000+ chars) rejected

**Test IDs:** T-BND-1, T-BND-2, T-BND-3, T-BND-4

### Session Integration
- T-SES-1: New submission creates suspensionOrder.reasons
- T-SES-2: Existing suspensionOrder data not overwritten
- T-SES-3: Update reasons on resubmit
- T-SES-4: Clear reasons (empty) sets to null

**Test IDs:** T-SES-1, T-SES-2, T-SES-3, T-SES-4

### Error Preservation
- T-ERR-1: Entered text preserved on validation error
- T-ERR-2: Multiple submissions preserve last valid state

**Test IDs:** T-ERR-1, T-ERR-2

---

## Open Questions

**Q1 - Form field name:** Awaiting confirmation on `reasons`
**Q2 - Character count display:** Confirm if live character count is required
**Q3 - Previous navigation:** User story says Screen 26, flow suggests Screen 26a - needs clarification
**Q4 - Empty string handling:** Confirm null vs empty string storage

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Page Display | 4 | AC-1 |
| Textarea Display | 3 | AC-2 |
| Optional Field | 3 | AC-3 |
| Character Limit | 8 | AC-4 |
| Persistence | 4 | AC-5 |
| Pre-population | 4 | AC-6 |
| Navigation (Prev) | 3 | AC-7 |
| Navigation (Cont) | 3 | AC-8 |
| Cancel | 2 | AC-9 |
| Accessibility | 5 | AC-10 |
| Pre-population (X) | 3 | Cross-cutting |
| Boundary | 4 | Cross-cutting |
| Session | 4 | Cross-cutting |
| Error Preservation | 2 | Cross-cutting |
| **Total** | **52** | **Estimated test count** |

**Note:** Some tests will be combined for efficiency in the executable test file, resulting in approximately 25-30 actual test cases.

---

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2, T-1.3, T-1.4 | Page heading and guidance |
| AC-2 | T-2.1, T-2.2, T-2.3 | Textarea display |
| AC-3 | T-3.1, T-3.2, T-3.3 | Optional field |
| AC-4 | T-4.1, T-4.2, T-4.3, T-4.4, T-4.5, T-4.6, T-4.7, T-4.8 | Character limit |
| AC-5 | T-5.1, T-5.2, T-5.3, T-5.4 | Session persistence |
| AC-6 | T-6.1, T-6.2, T-6.3, T-6.4 | Pre-population |
| AC-7 | T-7.1, T-7.2, T-7.3 | Previous navigation |
| AC-8 | T-8.1, T-8.2, T-8.3 | Continue navigation |
| AC-9 | T-9.1, T-9.2 | Cancel behaviour |
| AC-10 | T-10.1, T-10.2, T-10.3, T-10.4, T-10.5 | Accessibility |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-02-02.*
