# Implementation Guide: Welsh Branching (Border Postcode)

- Use Supertest-session for navigation and session persistence
- Use sessionHelper for authenticated session setup
- Test GET and POST /claims/border-postcode
- Check session.claimDraft.isWales for correct value
- Validate error summary and accessibility
- Add navigation helper: goToBorderPostcode(session, { isWales })
- Reference user story and test plan for ACs
