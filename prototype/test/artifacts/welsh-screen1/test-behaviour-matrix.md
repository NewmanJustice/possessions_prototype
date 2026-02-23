# welsh-screen1: Claimant Ineligible (Welsh) — Test Behaviour Matrix

## Mapping: Acceptance Criteria → Behaviours → Test IDs

---

### AC-1 — Page is rendered for ineligible Welsh claimants

| Behaviour                                                       | Test ID |
|-----------------------------------------------------------------|---------|
| GET returns HTTP 200 with correct session state                 | T-1.1   |

---

### AC-2 — Caption is displayed

| Behaviour                                       | Test ID |
|-------------------------------------------------|---------|
| Page contains caption text "Make a claim"       | T-2.1   |

---

### AC-3 — Heading is displayed

| Behaviour                                                                     | Test ID |
|-------------------------------------------------------------------------------|---------|
| Page contains h1 "You're not eligible for this online service"                | T-3.1   |
| h1 element is present                                                         | T-3.2   |

---

### AC-4 — Horizontal rule separator is displayed

| Behaviour                                                   | Test ID |
|-------------------------------------------------------------|---------|
| Page contains a `<hr>` element (section break)              | T-4.1   |

---

### AC-5 — Ineligibility body text is displayed

| Behaviour                                                                                      | Test ID |
|------------------------------------------------------------------------------------------------|---------|
| Page contains "This service is currently only available for registered community landlords."    | T-5.1   |

---

### AC-6 — "What to do next" subheading is displayed

| Behaviour                                      | Test ID |
|------------------------------------------------|---------|
| Page contains "What to do next" subheading     | T-6.1   |

---

### AC-7 — Form N5 Wales guidance is displayed

| Behaviour                                                                                     | Test ID |
|-----------------------------------------------------------------------------------------------|---------|
| Page contains "Use form N5 Wales and the correct particulars of claim form."                  | T-7.1   |

---

### AC-8 — "View the full list of property possessions forms" link is displayed

| Behaviour                                                                                     | Test ID |
|-----------------------------------------------------------------------------------------------|---------|
| Page contains link text "View the full list of property possessions forms (opens in new tab)" | T-8.1   |
| The link has `target="_blank"` attribute                                                       | T-8.2   |

---

### AC-9 — GOV.UK warning text component is displayed

| Behaviour                                                                                     | Test ID |
|-----------------------------------------------------------------------------------------------|---------|
| Page contains GOV.UK warning text component (class `govuk-warning-text`)                      | T-9.1   |
| Warning text contains "To exit back to the case list, select 'Cancel'"                        | T-9.2   |

---

### AC-10 — Previous navigation

| Behaviour                                                              | Test ID |
|------------------------------------------------------------------------|---------|
| Page contains a link pointing to `/claims/claimant-type`               | T-10.1  |
| The Previous link contains text "Previous"                             | T-10.2  |

---

### AC-11 — Continue navigation (POST)

| Behaviour                                                              | Test ID |
|------------------------------------------------------------------------|---------|
| Page contains a form with POST method                                  | T-11.1  |
| POST to `/claims/claimant-ineligible-welsh` returns 302                | T-11.2  |
| POST redirects to `/claims/start`                                      | T-11.3  |

---

### AC-12 — Cancel behaviour

| Behaviour                                                              | Test ID |
|------------------------------------------------------------------------|---------|
| Page contains Cancel link pointing to `/case-list`                     | T-12.1  |
| Cancel link contains text "Cancel"                                     | T-12.2  |

---

### AC-13 — Route protection (unauthenticated access)

| Behaviour                                                                | Test ID |
|--------------------------------------------------------------------------|---------|
| Unauthenticated GET returns 302 redirect to auth/access                  | T-13.1  |

---

### AC-14 — Accessibility: page structure

| Behaviour                                                                | Test ID |
|--------------------------------------------------------------------------|---------|
| Page has an h1 element                                                    | T-14.1  |
| h1 appears before any h2 in the document                                  | T-14.2  |
| GOV.UK warning text uses `govukWarningText` component class               | T-14.3  |
| External forms link has descriptive accessible text                       | T-14.4  |
| All links have `href` attributes                                          | T-14.5  |

---

### Regression — Old Screen 40 content must not appear

| Behaviour                                                                                       | Test ID |
|-------------------------------------------------------------------------------------------------|---------|
| Page does NOT contain "not eligible to use the England possession claim service"                 | T-15.1  |
| Page does NOT contain the old text "property is in Wales" as a standalone ineligibility message  | T-15.2  |

---

## Acceptance Criteria Coverage Summary

| Acceptance Criterion | Test IDs                       | Notes                                                       |
|----------------------|--------------------------------|-------------------------------------------------------------|
| AC-1                 | T-1.1                          |                                                             |
| AC-2                 | T-2.1                          |                                                             |
| AC-3                 | T-3.1, T-3.2                   |                                                             |
| AC-4                 | T-4.1                          |                                                             |
| AC-5                 | T-5.1                          |                                                             |
| AC-6                 | T-6.1                          |                                                             |
| AC-7                 | T-7.1                          |                                                             |
| AC-8                 | T-8.1, T-8.2                   |                                                             |
| AC-9                 | T-9.1, T-9.2                   |                                                             |
| AC-10                | T-10.1, T-10.2                 |                                                             |
| AC-11                | T-11.1, T-11.2, T-11.3         |                                                             |
| AC-12                | T-12.1, T-12.2                 |                                                             |
| AC-13                | T-13.1                         | Auth guard only; no additional Wales-condition guard tested |
| AC-14                | T-14.1, T-14.2, T-14.3, T-14.4, T-14.5 | Structural/attribute checks only; no WCAG audit |
| Regression           | T-15.1, T-15.2                 | Ensures old Screen 40 content is gone                       |
