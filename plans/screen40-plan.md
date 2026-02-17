# Screen 40 Implementation Plan

## Summary
- **Screen title:** Claimant Ineligible (Welsh)
- **Purpose:** Inform solicitor that the claim is ineligible for the England possession claim service due to property being in Wales and claimant type.
- **Route:** GET /claims/claimant-ineligible-welsh

## Understanding
- **Key behaviors:**
  - Prominent ineligibility message (h1)
  - Guidance for Welsh claims, links as per Figma
  - No claim progression; only navigation to case list or exit
  - No form, no POST handler, no session writes
  - Accessibility: heading structure, keyboard/screen reader accessible
- **Test coverage:**
  - 5 tests: message display, content/guidance, absence of progression, navigation, accessibility

## Files to Create/Modify
- `prototype/src/routes/claims.js`: Add GET handler for /claims/claimant-ineligible-welsh
- `prototype/src/views/pages/claims/claimant-ineligible-welsh.njk`: New template for this screen
- (Reference only) `test/routes/claimantIneligibleWelsh.test.js`: Tests already exist

## Implementation Steps
1. Add GET route handler in `claims.js` for /claims/claimant-ineligible-welsh
2. Create Nunjucks template at `pages/claims/claimant-ineligible-welsh.njk` per Figma and guidance
3. Ensure navigation link/button returns to /case-list (and exit if required)
4. Confirm no POST handler, no form, no session writes
5. Run and verify all 5 tests pass
6. Run linter and fix any issues

## Session Data
- **Read:**
  - `session.claimDraft.isWales`
  - `session.claimDraft.claimantType`
- **Write:** None

## Validation Rules
- None (no form inputs, no POST)

## Template Components
- GOV.UK components:
  - `govukHeadingL` (h1)
  - `govukBody`, `govukList`, `govukLink`
  - Navigation link/button to `/case-list`
- No conditional reveals
- Error handling: not required (no form)

## Risks / Questions
- Confirm exact content/wording with Figma (welsh-screen1.png)
- If exit link is required, clarify destination
- Ensure no accidental claim progression or session mutation

## Definition of Done
- [ ] All 5 tests passing
- [ ] Lint passing
- [ ] Route accessible at /claims/claimant-ineligible-welsh
- [ ] Previous/Continue/Cancel navigation working (only navigation to case list/exit present)
