# Screen 31 — Underlessee or Mortgagee Details

## Understanding

### Summary
This screen captures detailed information about underlessees (subtenants) or mortgagees (mortgage lenders) who may be entitled to claim relief against forfeiture. It is reached when the user selects "Yes" on Screen 30, indicating there is an underlessee or mortgagee. The screen has three distinct sections:
1. **Name Section**: Captures whether the name is known, and if so, the actual name
2. **Address Section**: Captures whether the correspondence address is known, with postcode lookup and manual entry options
3. **Additional Parties Section**: Allows adding multiple underlessees/mortgagees via an "Add new" flow

The screen supports multiple entries stored as an array in session.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/underlessee-or-mortgagee` (Screen 30) after selecting "Yes"
2. Page displays heading "Underlessee or mortgagee details" with caption "Make a claim" and case number
3. **Section 1 - Name:**
   - Question: "Do you know the underlessee or mortgagee's name?"
   - Radio options: Yes, No
   - If Yes selected: reveals text input "What is their name?" with hint text
4. **Section 2 - Address:**
   - Question: "Do you know the underlessee or mortgagee's correspondence address?"
   - Radio options: Yes, No
   - If Yes selected: reveals postcode lookup with "Find address" button
   - Link "I can't enter a UK postcode" reveals manual address fields
   - Manual fields: Building and Street (required), Address line 2, Address line 3, Town or City (required), County, Country, Postcode (required)
5. **Section 3 - Additional Parties:**
   - Question: "Do you need to add another underlessee or mortgagee?"
   - Radio options: Yes, No
   - If Yes selected: reveals panel with "Add new" button
6. User clicks Continue
7. Data stored in `session.claim.underlesseeOrMortgageeDetails` array
8. User redirected to next screen (Screen 32, route TBD)

### Input Variations
- **Name known:** Yes (with name) or No
- **Address known:** Yes (with address via lookup or manual) or No
- **Additional parties:** Yes (with Add new button) or No
- **Address entry method:** Postcode lookup or manual entry
- **Multiple entries:** Array of entries when "Add new" used
- **Revisit scenario:** Previous entries displayed and editable

### Constraints

#### Business Rules
- **Name question required:** Must select Yes or No before continuing
- **Name input required when Yes:** Must enter name if Yes selected for name question
- **Address question required:** Must select Yes or No before continuing
- **Address fields required when Yes:** Building and Street, Town or City, Postcode required when Yes selected
- **Additional parties question required:** Must select Yes or No before continuing
- **Add new saves current entry:** Clicking "Add new" saves current form and presents fresh form
- **Multiple entries supported:** No limit on number of entries
- **Conditional reveals:** Various fields revealed based on Yes selections

#### Validation Rules
- **Name selection required:** "Select yes if you know the underlessee or mortgagee's name"
- **Name required when Yes:** "Enter the underlessee or mortgagee's name"
- **Address selection required:** "Select yes if you know the underlessee or mortgagee's correspondence address"
- **Address fields when Yes:**
  - "Enter the building and street"
  - "Enter the town or city"
  - "Enter the postcode"
- **Additional parties selection required:** "Select yes if you need to add another underlessee or mortgagee"
- **GOV.UK error pattern:** Error summary at top, inline errors, focus management

#### Session Structure
```javascript
session.claim.underlesseeOrMortgageeDetails = [
  {
    knowsName: 'yes' | 'no' | null,
    name: 'string' | null,
    knowsAddress: 'yes' | 'no' | null,
    address: {
      buildingAndStreet: 'string' | null,
      addressLine2: 'string' | null,
      addressLine3: 'string' | null,
      townOrCity: 'string' | null,
      county: 'string' | null,
      country: 'string' | null,
      postcode: 'string' | null
    } | null,
    hasAdditional: 'yes' | 'no' | null
  }
  // Additional entries if "Add new" was used
]
```

**Storage rules:**
- First visit: Empty array or array with null/undefined values
- Add new: Appends new entry to array, resets form for next entry
- Revisit: Last entry in array displayed for editing
- Previous entries preserved when adding new

#### Navigation Rules
- **Previous:** `/claims/underlessee-or-mortgagee` (Screen 30); data preserved
- **Continue:** Next screen (Screen 32 route TBD); redirect only if validation passes
- **Cancel:** `/case-list`; claim draft remains in session
- **Add new:** Same page with form reset; current entry saved to array

### Initial Assumptions

1. **Entry condition:** Screen only accessible when Screen 30 answer is "Yes"
2. **Storage format:** String values 'yes' or 'no'; null on first visit
3. **Array storage:** Multiple entries stored as array elements
4. **Postcode lookup:** Uses stub/mock service (FEATURE_ADDRESS_LOOKUP flag)
5. **Manual entry link:** Does not hide postcode lookup when clicked
6. **Required address fields:** Building and Street, Town or City, Postcode
7. **Optional address fields:** Address line 2, Address line 3, County, Country (marked with "(Optional)")
8. **Add new behaviour:** Saves current entry, appends to array, resets form
9. **Editing entries:** Deferred to future iteration (not in scope)
10. **Case number display:** Follows existing pattern from other screens
11. **Error focus:** Focus moves to error summary on validation failure

### Out of Scope
- Validating legal status of underlessee or mortgagee
- Real address lookup API integration (stub/mock only)
- Limiting number of entries
- Verifying name against court records
- Editing or removing previously added entries
- International address formats beyond UK standard

### Relationship to Other Screens
- **Screen 30** (Underlessee or Mortgagee): Previous screen; user must select "Yes" to reach Screen 31
- **Screen 32** (TBD): Next screen; user reaches via Continue button
- **Case list:** Cancel destination

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-30 based on user story screen31.txt.*
