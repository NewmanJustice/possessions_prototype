# Test Behaviour Matrix — Screen 23: Money Judgement

## Acceptance Criteria → Test Behaviours

### AC-1: Display money judgment question

**Behaviour:**
- T-1.1: Page displays question "Do you want the court to make a judgment for the outstanding arrears?"
- T-1.2: Yes radio option displayed
- T-1.3: No radio option displayed
- T-1.4: Radio options use correct name attribute

**Test IDs:** T-1.1, T-1.2, T-1.3, T-1.4

---

### AC-2: Selection is required

**Behaviour:**
- T-2.1: Submitting without selection shows error
- T-2.2: Error message: "Select whether you want the court to make a judgment for the outstanding arrears"
- T-2.3: GOV.UK error summary displayed
- T-2.4: Inline error message displayed
- T-2.5: Focus moves to error summary

**Test IDs:** T-2.1, T-2.2, T-2.3, T-2.4, T-2.5

---

### AC-3: Persist money judgment intention

**Behaviour:**
- T-3.1: Selecting Yes stores `moneyJudgement.requested: true`
- T-3.2: Selecting No stores `moneyJudgement.requested: false`
- T-3.3: Data stored in `session.claim.moneyJudgement` structure
- T-3.4: Session persists across requests

**Test IDs:** T-3.1, T-3.2, T-3.3, T-3.4

---

### AC-4: Previous navigation

**Behaviour:**
- T-4.1: Clicking Previous redirects to `/claims/details-of-rent-arrears`
- T-4.2: Previous inputs preserved in session

**Test IDs:** T-4.1, T-4.2

---

### AC-5: Continue navigation

**Behaviour:**
- T-5.1: Clicking Continue (valid) redirects to `/claims/claimants-circumstances`
- T-5.2: Selection persisted before navigation

**Test IDs:** T-5.1, T-5.2

---

### AC-6: Cancel behaviour

**Behaviour:**
- T-6.1: Clicking Cancel redirects to `/case-list`
- T-6.2: Draft claim remains in session after Cancel

**Test IDs:** T-6.1, T-6.2

---

### AC-7: Accessibility compliance

**Behaviour:**
- T-7.1: GOV.UK error summary displayed on validation failure
- T-7.2: Error link targets radio group
- T-7.3: Focus moves to error summary
- T-7.4: Radio inputs have proper labels
- T-7.5: Radio inputs are keyboard accessible

**Test IDs:** T-7.1, T-7.2, T-7.3, T-7.4, T-7.5

---

## Additional Behaviours (Cross-Cutting)

### Pre-Population on Revisit
- T-PRE-1: First visit has no radio pre-selected
- T-PRE-2: Yes pre-selected when `requested === true`
- T-PRE-3: No pre-selected when `requested === false`
- T-PRE-4: Pre-population works after validation error

**Test IDs:** T-PRE-1, T-PRE-2, T-PRE-3, T-PRE-4

### Selection Change Behavior
- T-CHG-1: Change from Yes to No updates to `false`
- T-CHG-2: Change from No to Yes updates to `true`
- T-CHG-3: Multiple changes preserve last selection

**Test IDs:** T-CHG-1, T-CHG-2, T-CHG-3

### Boolean Mapping
- T-MAP-1: Form value "yes" maps to `true` in session
- T-MAP-2: Form value "no" maps to `false` in session
- T-MAP-3: Session `true` pre-selects "yes" radio
- T-MAP-4: Session `false` pre-selects "no" radio

**Test IDs:** T-MAP-1, T-MAP-2, T-MAP-3, T-MAP-4

---

## Open Questions

**None** - All ambiguities resolved via Q1-Q4 clarification with Steve.

---

## Test Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| Question Display | 4 | AC-1 |
| Validation | 5 | AC-2 |
| Persistence | 4 | AC-3 |
| Navigation (Prev) | 2 | AC-4 |
| Navigation (Cont) | 2 | AC-5 |
| Cancel | 2 | AC-6 |
| Accessibility | 5 | AC-7 |
| Pre-Population | 4 | Cross-cutting |
| Selection Change | 3 | Cross-cutting |
| Boolean Mapping | 4 | Cross-cutting |
| **Total** | **35** | **Estimated test count** |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-27.*
