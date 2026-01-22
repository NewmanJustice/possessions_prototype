# Screen 12: Tenancy or Licence Details - Test Behaviour Matrix

## AC-1: Tenancy/licence type required

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-1 | Page shows radio options for tenancy type | T-1.1 | Happy |
| AC-1 | All six tenancy types displayed | T-1.2 | Happy |
| AC-1 | Submit without selection shows error summary | T-1.3 | Error |
| AC-1 | Error message "Select the tenancy or licence type" | T-1.4 | Error |
| AC-1 | Focus moves to error summary | T-1.5 | Error |
| AC-1 | Valid selection (assured-tenancy) accepted | T-1.6 | Happy |
| AC-1 | Valid selection (secure-tenancy) accepted | T-1.7 | Happy |
| AC-1 | Valid selection (introductory-tenancy) accepted | T-1.8 | Happy |
| AC-1 | Valid selection (flexible-tenancy) accepted | T-1.9 | Happy |
| AC-1 | Valid selection (demoted-tenancy) accepted | T-1.10 | Happy |

## AC-2: "Other" reveals optional free-text

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-2 | Selecting "Other" reveals free-text field | T-2.1 | Happy |
| AC-2 | Free-text field labelled "Please specify" | T-2.2 | Happy |
| AC-2 | "Other" with blank free-text accepted | T-2.3 | Happy |
| AC-2 | "Other" with populated free-text accepted | T-2.4 | Happy |
| - | Free-text exceeding 255 chars shows error | T-2.E.1 | Boundary |
| - | Free-text preserved on validation failure | T-2.E.2 | Error |

## AC-3: Optional start date validation

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-3 | Empty date fields allowed (no error) | T-3.1 | Happy |
| AC-3 | Complete valid date accepted | T-3.2 | Happy |
| AC-3 | Date saved to session | T-3.3 | State |
| AC-3 | Partial date (day only) shows error | T-3.4 | Error |
| AC-3 | Partial date (month only) shows error | T-3.5 | Error |
| AC-3 | Partial date (year only) shows error | T-3.6 | Error |
| AC-3 | Partial date (day+month) shows error | T-3.7 | Error |
| AC-3 | Error message describes date problem | T-3.8 | Error |
| - | Year 1799 shows error (below minimum) | T-3.E.1 | Boundary |
| - | Year 1800 accepted (minimum valid) | T-3.E.2 | Boundary |
| - | Year 2100 accepted (maximum valid) | T-3.E.3 | Boundary |
| - | Year 2101 shows error (above maximum) | T-3.E.4 | Boundary |
| - | Day 0 shows error | T-3.E.5 | Boundary |
| - | Day 32 shows error | T-3.E.6 | Boundary |
| - | Month 0 shows error | T-3.E.7 | Boundary |
| - | Month 13 shows error | T-3.E.8 | Boundary |
| - | Date values preserved on validation failure | T-3.E.9 | Error |

## AC-4: Upload tenancy/licence agreement (simulated)

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-4 | Upload control with "Add new" button present | T-4.1 | Happy |
| AC-4 | Upload is optional (no file allowed) | T-4.2 | Happy |
| AC-4 | Valid file upload stores metadata in session | T-4.3 | Happy |
| AC-4 | Uploaded file shown in list | T-4.4 | Happy |
| AC-4 | Disallowed file type shows error | T-4.5 | Error |
| AC-4 | File over size limit shows error | T-4.6 | Error |
| - | PDF file accepted | T-4.E.1 | Happy |
| - | DOC file accepted | T-4.E.2 | Happy |
| - | DOCX file accepted | T-4.E.3 | Happy |
| - | JPG file accepted | T-4.E.4 | Happy |
| - | PNG file accepted | T-4.E.5 | Happy |
| - | File can be removed from list | T-4.E.6 | Happy |
| - | Multiple files can be uploaded | T-4.E.7 | Happy |

## AC-5: Preserve inputs on validation error

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-5 | Tenancy type preserved on error | T-5.1 | Error |
| AC-5 | Date values preserved on error | T-5.2 | Error |
| AC-5 | Uploaded files preserved on error | T-5.3 | Error |
| AC-5 | "Other" free-text preserved on error | T-5.4 | Error |

## AC-6: Continue saves and redirects

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-6 | Continue saves tenancy to session | T-6.1 | Happy |
| AC-6 | Session contains type field | T-6.2 | State |
| AC-6 | Session contains startDate (when provided) | T-6.3 | State |
| AC-6 | Session contains documents array | T-6.4 | State |
| AC-6 | Redirects to /claims/grounds | T-6.5 | Happy |

## AC-7: Previous & Cancel behaviour

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-7 | Previous link to /claims/defendant-details | T-7.1 | Happy |
| AC-7 | Previous preserves entered data | T-7.2 | Happy |
| AC-7 | Cancel link to /case-list | T-7.3 | Happy |
| AC-7 | Cancel preserves claim draft | T-7.4 | Happy |

## AC-8: Accessibility

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-8 | Error summary shown on validation failure | T-8.1 | Error |
| AC-8 | Error links to corresponding field | T-8.2 | Error |
| AC-8 | Focus moves to error summary | T-8.3 | Error |
| AC-8 | Form controls have associated labels | T-8.4 | UX |

## Cross-Cutting

| Behaviour | Test ID | Type |
|-----------|---------|------|
| Unauthenticated user redirected to sign-in | T-X.1 | Security |
| Page requires SOLICITOR role | T-X.2 | Security |
| Page has correct title pattern | T-X.3 | UX |
| Error page title includes "Error:" prefix | T-X.4 | UX |
| Re-visiting page shows previously saved tenancy | T-X.5 | State |
