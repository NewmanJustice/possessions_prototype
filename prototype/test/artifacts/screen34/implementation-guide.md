# Implementation Guide — Screen 34: Applications

## Route Configuration

```javascript
GET  /claims/applications
POST /claims/applications
```

## Session Structure

```javascript
session.claim.applications = {
  planningApplication: 'yes' | 'no' | null
}
```

## Navigation Logic

### Previous (Dynamic)
```javascript
const uploadedDocuments = req.session.claim?.uploadedDocuments || [];
if (uploadedDocuments.length > 0) {
  return res.redirect('/claims/upload-additional-document');
} else {
  return res.redirect('/claims/underlessee-mortgagee-forfeiture-relief');
}
```

### Continue
```javascript
return res.redirect('/claims/language-used');
```

## Validation

- planningApplication: Required - "Select yes if you are planning to make an application at the same time as your claim"

## Template Components

- govukRadios for Yes/No selection
- Multiple paragraphs of explanatory text
- Bullet list of application examples
- govukErrorSummary for validation errors
