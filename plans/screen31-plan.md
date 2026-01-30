# Screen 31 Implementation Plan

**Created:** 2026-01-30
**Screen:** Underlessee or Mortgagee Details
**Route:** `/claims/underlessee-or-mortgagee-details`

---

## Summary

Captures details about underlessees or mortgagees entitled to claim relief against forfeiture, including their name, correspondence address, and ability to add multiple entries.

---

## Understanding

- Three sections: Name, Address, Additional parties
- Each section has Yes/No radio with conditional reveal
- Address section includes postcode lookup and manual entry
- Multiple entries supported via "Add new" flow
- 26 acceptance criteria

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `prototype/src/routes/claims.js` | Modify | Add GET/POST routes, update Screen 30 redirect |
| `prototype/src/views/pages/claims/underlessee-or-mortgagee-details.njk` | Create | New template |

---

## Implementation Steps

1. Update Screen 30 POST to redirect to Screen 31 when Yes selected
2. Add GET route handler for Screen 31
3. Create Nunjucks template with three sections
4. Add POST route with validation
5. Implement session persistence
6. Run tests and fix failures

---

## Session Data

**Read:**
- `session.claim.underlesseeOrMortgageeDetails` - array of entries

**Write:**
- `session.claim.underlesseeOrMortgageeDetails` - updated array

---

## Validation Rules

- knowsName: Required ("Select yes if you know the underlessee or mortgagee's name")
- name: Required when knowsName=yes ("Enter the underlessee or mortgagee's name")
- knowsAddress: Required ("Select yes if you know the underlessee or mortgagee's correspondence address")
- buildingAndStreet: Required when knowsAddress=yes ("Enter the building and street")
- townOrCity: Required when knowsAddress=yes ("Enter the town or city")
- postcode: Required when knowsAddress=yes ("Enter the postcode")
- hasAdditional: Required ("Select yes if you need to add another underlessee or mortgagee")

---

## Definition of Done

- [ ] All tests passing
- [ ] Lint passing
- [ ] Route accessible at /claims/underlessee-or-mortgagee-details
- [ ] Previous/Continue/Cancel navigation working
