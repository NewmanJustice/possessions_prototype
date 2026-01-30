# Test Behaviour Matrix — Screen 31: Underlessee or Mortgagee Details

## Acceptance Criteria to Test Behaviours

### AC-1: Display page heading, caption, and case number
- T-1.1: Page displays heading "Underlessee or mortgagee details"
- T-1.2: Caption displays "Make a claim"
- T-1.3: Case number displayed below caption
- T-1.4: Page accessible at `/claims/underlessee-or-mortgagee-details`

### AC-2: Display name section heading and question
- T-2.1: Section heading "Underlessee or mortgagee name" displayed
- T-2.2: Question "Do you know the underlessee or mortgagee's name?" displayed
- T-2.3: Yes radio option displayed
- T-2.4: No radio option displayed
- T-2.5: Radio uses name="knowsName"

### AC-3: Conditional reveal for name input
- T-3.1: Selecting Yes reveals name input
- T-3.2: Label "What is their name?" displayed
- T-3.3: Hint text about first/last name or company displayed
- T-3.4: Input uses name="name"

### AC-4: Hide name input on No selection
- T-4.1: Selecting No hides name input
- T-4.2: Previously entered name retained in session

### AC-5: Display address section heading and question
- T-5.1: Section heading "Underlessee or mortgagee correspondence address" displayed
- T-5.2: Question about knowing address displayed
- T-5.3: Yes and No radio options displayed
- T-5.4: Radio uses name="knowsAddress"

### AC-6: Conditional reveal for postcode lookup
- T-6.1: Selecting Yes reveals address entry section
- T-6.2: Subheading "Enter address details" displayed
- T-6.3: Postcode input with label "Enter a UK postcode" displayed
- T-6.4: "Find address" button displayed

### AC-7: Postcode lookup behaviour
- T-7.1: Find address with valid postcode shows dropdown
- T-7.2: Dropdown labelled "Select an address"
- T-7.3: Dropdown contains matching addresses

### AC-8: Address selection from dropdown
- T-8.1: Selecting address populates manual fields
- T-8.2: All address fields pre-filled from selection

### AC-9: Manual address entry link
- T-9.1: Link "I can't enter a UK postcode" displayed
- T-9.2: Clicking link reveals manual address fields
- T-9.3: Postcode lookup remains visible

### AC-10: Manual address fields
- T-10.1: Building and Street field displayed (required)
- T-10.2: Address line 2 field displayed (Optional)
- T-10.3: Address line 3 field displayed (Optional)
- T-10.4: Town or City field displayed (required)
- T-10.5: County field displayed (Optional)
- T-10.6: Country field displayed (Optional)
- T-10.7: Postcode field displayed (required)

### AC-11: Hide address section on No selection
- T-11.1: Selecting No hides address entry section
- T-11.2: Previously entered address retained in session

### AC-12: Display additional party section heading and question
- T-12.1: Section heading "Additional underlessees or mortgagees" displayed
- T-12.2: Question about adding another displayed
- T-12.3: Yes and No radio options displayed
- T-12.4: Radio uses name="hasAdditional"

### AC-13: Conditional reveal for add new button
- T-13.1: Selecting Yes reveals add new panel
- T-13.2: Subheading "Add underlessee or mortgagee" displayed
- T-13.3: "Add new" button displayed
- T-13.4: Help text about adding to case displayed

### AC-14: Add new button behaviour
- T-14.1: Clicking Add new saves current entry to session
- T-14.2: Page refreshes with empty fields
- T-14.3: Previous entries remain in session array

### AC-15: Hide add new panel on No selection
- T-15.1: Selecting No hides add new panel

### AC-16: Name question selection is required
- T-16.1: No selection shows validation error
- T-16.2: Error message: "Select yes if you know the underlessee or mortgagee's name"
- T-16.3: GOV.UK error summary displayed
- T-16.4: Error link targets #knowsName

### AC-17: Name is required when Yes selected
- T-17.1: Yes selected without name shows error
- T-17.2: Error message: "Enter the underlessee or mortgagee's name"
- T-17.3: Error link targets #name

### AC-18: Address question selection is required
- T-18.1: No selection shows validation error
- T-18.2: Error message: "Select yes if you know the underlessee or mortgagee's correspondence address"
- T-18.3: Error link targets #knowsAddress

### AC-19: Required address fields validation
- T-19.1: Missing building/street shows error
- T-19.2: Missing town/city shows error
- T-19.3: Missing postcode shows error
- T-19.4: Error messages match spec

### AC-20: Additional party question selection is required
- T-20.1: No selection shows validation error
- T-20.2: Error message: "Select yes if you need to add another underlessee or mortgagee"
- T-20.3: Error link targets #hasAdditional

### AC-21: Persist underlessee/mortgagee details
- T-21.1: Data stored in session.claim.underlesseeOrMortgageeDetails array
- T-21.2: knowsName stored correctly
- T-21.3: name stored correctly
- T-21.4: knowsAddress stored correctly
- T-21.5: address object stored correctly
- T-21.6: hasAdditional stored correctly

### AC-22: Preserve selections and data on revisit
- T-22.1: Previous Yes/No selections pre-selected
- T-22.2: Entered name pre-filled
- T-22.3: Address fields pre-filled
- T-22.4: Conditional reveals match selections

### AC-23: Previous navigation
- T-23.1: Previous redirects to /claims/underlessee-or-mortgagee
- T-23.2: Data preserved in session

### AC-24: Continue navigation
- T-24.1: Continue with valid data redirects to next screen
- T-24.2: Data persisted before navigation

### AC-25: Cancel behaviour
- T-25.1: Cancel redirects to /case-list
- T-25.2: Claim draft remains in session

### AC-26: Accessibility compliance
- T-26.1: GOV.UK error summary on validation failure
- T-26.2: Error links to relevant fields
- T-26.3: Focus moves to error summary
- T-26.4: All inputs properly labelled
- T-26.5: Keyboard accessible
- T-26.6: Conditional reveals announced to screen readers

---

## Open Questions

**Q1:** What is the exact route for Screen 32 (Continue destination)?
**Q2:** Should "Find address" button work without JavaScript (form POST)?
**Q3:** Is there a maximum character limit for the name field?
**Q4:** What happens if user navigates back after Add new - which entry to show?
**Q5:** Should postcode validation occur before Find address API call?
**Q6:** How is the current entry index tracked (session or query param)?

---

## Traceability Table

| AC | Test IDs | Notes |
|----|----------|-------|
| AC-1 | T-1.1 to T-1.4 | Page content |
| AC-2 | T-2.1 to T-2.5 | Name section |
| AC-3 | T-3.1 to T-3.4 | Name conditional reveal |
| AC-4 | T-4.1 to T-4.2 | Name hide |
| AC-5 | T-5.1 to T-5.4 | Address section |
| AC-6 | T-6.1 to T-6.4 | Address reveal |
| AC-7 | T-7.1 to T-7.3 | Postcode lookup |
| AC-8 | T-8.1 to T-8.2 | Address selection |
| AC-9 | T-9.1 to T-9.3 | Manual entry link |
| AC-10 | T-10.1 to T-10.7 | Manual fields |
| AC-11 | T-11.1 to T-11.2 | Address hide |
| AC-12 | T-12.1 to T-12.4 | Additional section |
| AC-13 | T-13.1 to T-13.4 | Add new reveal |
| AC-14 | T-14.1 to T-14.3 | Add new behaviour |
| AC-15 | T-15.1 | Add new hide |
| AC-16 | T-16.1 to T-16.4 | Name validation |
| AC-17 | T-17.1 to T-17.3 | Name required |
| AC-18 | T-18.1 to T-18.3 | Address validation |
| AC-19 | T-19.1 to T-19.4 | Address fields validation |
| AC-20 | T-20.1 to T-20.3 | Additional validation |
| AC-21 | T-21.1 to T-21.6 | Persistence |
| AC-22 | T-22.1 to T-22.4 | Pre-population |
| AC-23 | T-23.1 to T-23.2 | Previous nav |
| AC-24 | T-24.1 to T-24.2 | Continue nav |
| AC-25 | T-25.1 to T-25.2 | Cancel |
| AC-26 | T-26.1 to T-26.6 | Accessibility |

---

*Test behaviour matrix created by Nigel (Tester Agent) on 2026-01-30.*
