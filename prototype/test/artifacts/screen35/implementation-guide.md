# Implementation Guide - Screen 35: Language Used

## Route Configuration

```javascript
GET  /claims/language-used
POST /claims/language-used
```

## Session Structure

```javascript
session.claim.languageUsed = {
  language: 'english' | 'welsh' | 'english-and-welsh' | null
}
```

## Template Content

### Page Structure
1. Caption: "Make a claim" (`govuk-caption-l`)
2. Page heading: "Language used" (`govuk-heading-l`)
3. Case number display
4. Question (fieldset legend, bold): "Which language did you use to complete this service?"
5. Hint text: "If someone else helped you to answer a question in this service, ask them if they answered any questions in Welsh. We'll use this to make sure your claim is processed correctly"
6. Radio buttons:
   - English (value: `english`)
   - Welsh (value: `welsh`)
   - English and Welsh (value: `english-and-welsh`)
7. Continue button
8. Previous link
9. Cancel link

### Radio Button Configuration
```javascript
{
  name: 'language',
  fieldset: {
    legend: {
      text: 'Which language did you use to complete this service?',
      isPageHeading: false,
      classes: 'govuk-fieldset__legend--m'
    }
  },
  hint: {
    text: 'If someone else helped you to answer a question in this service, ask them if they answered any questions in Welsh. We\'ll use this to make sure your claim is processed correctly'
  },
  items: [
    { value: 'english', text: 'English' },
    { value: 'welsh', text: 'Welsh' },
    { value: 'english-and-welsh', text: 'English and Welsh' }
  ]
}
```

## Navigation Logic

### Previous
```javascript
return res.redirect('/claims/applications');
```

### Continue (on valid submission)
```javascript
return res.redirect('/claims/completing-your-claim');
```

### Cancel
```javascript
return res.redirect('/case-list');
```

## Validation

### Required Field
- Field: `language`
- Error message: "Select which language you used to complete this service"
- Error href: `#language`

### Validation Logic
```javascript
const errors = [];
if (!req.body.language) {
  errors.push({
    field: 'language',
    message: 'Select which language you used to complete this service',
    href: '#language'
  });
}
```

## Template Components

- `govukRadios` - For language selection
- `govukButton` - For Continue
- `govukErrorSummary` - For validation errors
- Standard Previous and Cancel link pattern

## Error State

When validation fails:
- Page title prefixed with "Error: "
- Error summary displayed at top
- Inline error on radio group
- Focus moves to error summary

## Test Navigation Helper

```javascript
async function navigateToLanguageUsed(agent) {
  await navigateToApplicationsViaNoDocuments(agent);

  // Screen 34: Submit applications question
  await agent
    .post('/claims/applications')
    .send({ planningApplication: 'no' })
    .expect(302);

  return agent;
}
```
