# Screen 40: Claimant Ineligible (Welsh) - Understanding

## Summary

Screen 40 informs the solicitor that their client is not eligible to use the England possession claim service because the property is in Wales and the claimant type is ineligible. The page provides a clear ineligibility message, guidance for Welsh claims, and navigation to return to the case list or exit. No claim data is written; the screen is reached via specific session state (isWales = true, ineligible claimant type).

## Q1-Q6 Clarification Pattern

### Q1: What is the primary purpose of this screen?
To inform the user that the claim is ineligible for the England service due to the property being in Wales and claimant type, and to direct them to the correct next steps.

### Q2: What data is captured on this screen?
None. This is a read-only informational page.

### Q3: What is the entry point to this screen?
User has indicated the property is in Wales and selected an ineligible claimant type at `/claims/claimant-type`.

### Q4: What are the exit points from this screen?
- Return to case list (`/case-list`)
- Exit (if provided)

### Q5: What validation is required?
None. No form inputs exist; only navigation links/buttons.

### Q6: What session data is read/written?
- Read: `session.claimDraft.isWales`, `session.claimDraft.claimantType`
- Write: None

## Key Behaviours
- Display a prominent ineligibility message (h1)
- Content matches Figma design (headings, body, links)
- No option to continue the England claim journey
- Navigation: return to case list or exit
- Accessibility: heading structure, keyboard/screen reader accessible

## Initial Assumptions
- The ineligibility message and guidance text are as per Figma (welsh-screen1.png)
- Only navigation is to case list or exit; no further claim progression
- No POST handler required unless for analytics or feedback (not in scope)
- No session data is modified
- The page is GET-only

## Out of Scope
- Wales-specific claim submission or redirection
- Eligibility appeals or overrides
- Editing claim data from this page
