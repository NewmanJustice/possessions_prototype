# Implementation Guide — Screen 31: Underlessee or Mortgagee Details

## Overview
This document provides implementation guidance for Claude (Developer Agent) to implement Screen 31.

---

## Route Configuration

### Routes to Implement
```javascript
GET  /claims/underlessee-or-mortgagee-details
POST /claims/underlessee-or-mortgagee-details
```

### Route File
Add routes to: `prototype/src/routes/claims.js`

---

## View Template

### Template Location
`prototype/src/views/claims/underlessee-or-mortgagee-details.njk`

---

## Form Fields

### Section 1: Name
| Field | Name | Type | Required |
|-------|------|------|----------|
| Name known | `knowsName` | Radio | Yes |
| Name | `name` | Text | When knowsName=yes |

### Section 2: Address
| Field | Name | Type | Required |
|-------|------|------|----------|
| Address known | `knowsAddress` | Radio | Yes |
| Postcode lookup | `postcodeSearch` | Text | No |
| Building and Street | `buildingAndStreet` | Text | When knowsAddress=yes |
| Address line 2 | `addressLine2` | Text | No |
| Address line 3 | `addressLine3` | Text | No |
| Town or City | `townOrCity` | Text | When knowsAddress=yes |
| County | `county` | Text | No |
| Country | `country` | Text | No |
| Postcode | `postcode` | Text | When knowsAddress=yes |

### Section 3: Additional
| Field | Name | Type | Required |
|-------|------|------|----------|
| Has additional | `hasAdditional` | Radio | Yes |

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| knowsName | Required | "Select yes if you know the underlessee or mortgagee's name" |
| name | Required when knowsName=yes | "Enter the underlessee or mortgagee's name" |
| knowsAddress | Required | "Select yes if you know the underlessee or mortgagee's correspondence address" |
| buildingAndStreet | Required when knowsAddress=yes | "Enter the building and street" |
| townOrCity | Required when knowsAddress=yes | "Enter the town or city" |
| postcode | Required when knowsAddress=yes | "Enter the postcode" |
| hasAdditional | Required | "Select yes if you need to add another underlessee or mortgagee" |

---

## Session Structure

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
]
```

---

## Navigation Logic

### Previous Button
```javascript
if (req.body.action === 'previous') {
  return res.redirect('/claims/underlessee-or-mortgagee');
}
```

### Continue Button
```javascript
// After validation passes
return res.redirect('/claims/check-answers'); // TBD
```

### Cancel Button
```javascript
if (req.body.action === 'cancel') {
  return res.redirect('/case-list');
}
```

### Add New Button
```javascript
if (req.body.action === 'addNew') {
  // Save current entry to array
  // Reset form for new entry
  return res.redirect('/claims/underlessee-or-mortgagee-details');
}
```

---

## GET Handler
```javascript
router.get('/underlessee-or-mortgagee-details', (req, res) => {
  const details = req.session.claim?.underlesseeOrMortgageeDetails || [];
  const currentEntry = details[details.length - 1] || {};

  res.render('claims/underlessee-or-mortgagee-details', {
    knowsName: currentEntry.knowsName || null,
    name: currentEntry.name || null,
    knowsAddress: currentEntry.knowsAddress || null,
    address: currentEntry.address || {},
    hasAdditional: currentEntry.hasAdditional || null,
    errors: []
  });
});
```

---

## POST Handler Structure
```javascript
router.post('/underlessee-or-mortgagee-details', (req, res) => {
  // Handle Previous
  if (req.body.action === 'previous') {
    return res.redirect('/claims/underlessee-or-mortgagee');
  }

  // Handle Cancel
  if (req.body.action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Add New
  if (req.body.action === 'addNew') {
    // Validate and save current entry
    // Add new empty entry
    return res.redirect('/claims/underlessee-or-mortgagee-details');
  }

  // Validate
  const errors = validateUnderlesseeOrMortgageeDetails(req.body);

  if (errors.length > 0) {
    return res.render('claims/underlessee-or-mortgagee-details', {
      ...req.body,
      errors
    });
  }

  // Save to session
  saveToSession(req);

  // Navigate to next screen
  res.redirect('/claims/check-answers'); // TBD
});
```

---

## Test File Reference
Tests: `prototype/test/routes/underlesseeOrMortgageeDetails.test.js`

Run: `npm test -- --grep "Screen 31"`

---

## Dependencies

### Session Helper
Add `navigateToUnderlesseeOrMortgageeDetails` to `prototype/test/helpers/sessionHelper.js`

### Placeholder Route
Create placeholder for Screen 32 (Continue destination).

---

*Implementation guide created by Nigel (Tester Agent) on 2026-01-30 for Screen 31.*
