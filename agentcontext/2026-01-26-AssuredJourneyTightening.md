# Assured journey — “Additional grounds for possession (RR)” tightening notes (by design)

## What needs tightening up

### 1) RR-specific grounding is missing
- **Current state:** “Additional grounds for possession” is treated as generic.
- **Gap:** No explicit acknowledgement (copy or data) that these are **Renters Reform (RR)**-affected additional grounds.
- **Tighten by:**
  - Add a lightweight `groundsContext` flag (e.g. `RR_ADDITIONAL`) and/or
  - Add minimal RR-specific copy to anchor user + tests (no complex rules yet).

---

### 2) No contract for “RR additional grounds” vs “base grounds”
- **Current state:** `/claims/grounds-for-possession` can be reused from multiple entry points.
- **Gap:** No explicit definition that the screen is operating in an RR additional grounds context (vs other contexts).
- **Tighten by:**
  - Define/record the **entry context** in session (e.g. `session.claim.grounds.context = 'RR_ADDITIONAL'`)
  - Ensure Nigel’s tests can assert correct context and Claude can safely specialise behaviour later.

---

### 3) Downstream dependency is implicit, not explicit
- **Current state:** We store the additional grounds but don’t state that downstream steps may vary due to RR context.
- **Gap:** Intent is known but not captured as an explicit “this may affect later routing/content”.
- **Tighten by:**
  - Add an explicit note/AC that downstream screens may use `groundsContext` for conditional content/routing.
  - Keep it non-blocking: record intent without enforcing legal logic yet.

---

### 4) No reconciliation point yet (rent arrears + RR additional grounds)
- **Current state:** Rent arrears grounds and RR additional grounds are captured, but not reconciled.
- **Gap:** No defined summary/merge step that states “these are the complete grounds for this claim”.
- **Tighten by:**
  - Add a clear reconciliation point later (e.g. grounds summary / check answers section) where:
    - assured rent arrears grounds + RR additional grounds are presented together
    - the combined “grounds model” is the canonical record.

---

## Why this is safe to defer (and why the approach so far was right)
- These gaps are **structural/contextual**, not functional blockers.
- Secure/flexible journeys can proceed without them because:
  - current behaviour still captures the user’s selections correctly,
  - the routes work,
  - and the missing pieces are mainly about **explicit context** for future specialisation.
- Deferring avoids premature complexity while we:
  - fan out into secure/flexible paths,
  - then return for a single “normalisation pass” to:
    - introduce `groundsContext`,
    - formalise screen reuse contracts,
    - and add the reconciliation point consistently across journeys.
