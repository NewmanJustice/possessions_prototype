# Screen 32 Implementation Plan

**Created:** 2026-02-02T12:30:00Z
**Screen:** Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture
**Route:** `/claims/underlessee-mortgagee-forfeiture-relief`

---

## Summary

Screen 32 asks the solicitor to confirm whether there is an underlessee or mortgagee entitled to claim relief against forfeiture. Based on the answer:
- Yes → Screen 33 (upload additional document)
- No → Screen 34 (applications)

This screen has dynamic Previous navigation depending on how the user reached it.

---

## Understanding

- Simple yes/no question with required validation
- Conditional Continue navigation based on selection
- Dynamic Previous navigation based on journey path
- Test count: 27 tests

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `prototype/src/routes/claims.js` | Modify | Add GET/POST routes for Screen 32 |
| `prototype/src/views/pages/claims/underlessee-mortgagee-forfeiture-relief.njk` | Create | New template |
| `prototype/src/routes/claims.js` | Modify | Update Screen 30 "No" redirect to Screen 32 |
| `prototype/src/routes/claims.js` | Modify | Update Screen 31 Continue redirect to Screen 32 |

---

## Implementation Steps

1. Create the Nunjucks template for Screen 32
2. Add GET route handler for Screen 32
3. Add POST route handler with:
   - Cancel → /case-list
   - Previous → dynamic (Screen 30 or 31)
   - Validation
   - Conditional Continue (Yes → Screen 33, No → Screen 34)
4. Update Screen 30 POST handler: "No" path → Screen 32
5. Update Screen 31 POST handler: Continue → Screen 32
6. Run tests and fix failures

---

## Session Data

**Read:**
- `session.claim.underlesseeOrMortgagee.hasUnderlesseeOrMortgagee` - to determine Previous destination
- `session.claim.forfeitureRelief.hasUnderlesseeOrMortgageeForRelief` - for pre-population

**Write:**
- `session.claim.forfeitureRelief.hasUnderlesseeOrMortgageeForRelief` - 'yes' | 'no'

---

## Validation Rules

- hasUnderlesseeOrMortgageeForRelief: Required - "Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture"

---

## Template Components

- govukErrorSummary (conditional)
- govukRadios (yes/no)
- govukButton group (Continue, Previous, Cancel)
- Caption: "Make a claim"
- Page heading
- Case number display

---

## Navigation Logic

### Previous (Dynamic)
```javascript
const hasUnderlesseeOrMortgagee = req.session.claim?.underlesseeOrMortgagee?.hasUnderlesseeOrMortgagee;
if (hasUnderlesseeOrMortgagee === 'yes') {
  return res.redirect('/claims/underlessee-or-mortgagee-details'); // Screen 31
} else {
  return res.redirect('/claims/underlessee-or-mortgagee'); // Screen 30
}
```

### Continue (Conditional)
```javascript
if (selection === 'yes') {
  return res.redirect('/claims/upload-additional-document'); // Screen 33
} else {
  return res.redirect('/claims/applications'); // Screen 34
}
```

---

## Definition of Done

- [ ] All 27 tests passing
- [ ] Lint passing
- [ ] Route accessible at /claims/underlessee-mortgagee-forfeiture-relief
- [ ] Previous/Continue/Cancel navigation working
- [ ] Screen 30 "No" path redirects to Screen 32
- [ ] Screen 31 Continue redirects to Screen 32
