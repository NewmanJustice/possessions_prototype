# Screen 11: Defendant Details - Test Behaviour Matrix

## Defendant Name (AC-1 to AC-3)

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-1 | Page asks "Do you know the defendant's name?" with Yes/No radios | T-1.1 | Happy |
| AC-2 | Selecting Yes shows first name and last name fields | T-2.1 | Happy |
| AC-2 | Missing first name shows error | T-2.2 | Error |
| AC-2 | Missing last name shows error | T-2.3 | Error |
| AC-2 | Missing both names shows errors for both | T-2.4 | Error |
| AC-2 | Error summary displayed with focus | T-2.5 | Error |
| AC-2 | Valid first and last name accepted | T-2.6 | Happy |
| AC-3 | Selecting No hides name fields | T-3.1 | Happy |
| AC-3 | Changing from Yes to No clears stored name values | T-3.2 | State |
| - | Whitespace-only first name shows error | T-2.E.1 | Error |
| - | Whitespace-only last name shows error | T-2.E.2 | Error |
| - | First name exceeding 255 chars shows error | T-2.E.3 | Boundary |
| - | Last name exceeding 255 chars shows error | T-2.E.4 | Boundary |
| - | Names with special characters accepted (O'Brien) | T-2.E.5 | Edge |
| - | Entered names preserved on validation failure | T-2.E.6 | Error |
| - | No name radio selected shows error | T-2.E.7 | Error |

## Defendant Correspondence Address - Known/Unknown (AC-4 to AC-5)

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-4 | Page asks "Do you know defendant's correspondence address?" with Yes/No | T-4.1 | Happy |
| AC-5 | Selecting No hides address fields | T-5.1 | Happy |
| AC-5 | Selecting No allows continuation without address | T-5.2 | Happy |
| AC-5 | Selecting No stores addressKnown=false | T-5.3 | State |
| - | No address radio selected shows error | T-5.E.1 | Error |

## Same as Property Address (AC-6 to AC-8)

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-6 | Selecting Yes (address known) asks "same as property?" | T-6.1 | Happy |
| AC-7 | Selecting Yes (same as property) copies property address | T-7.1 | Happy |
| AC-7 | Selecting Yes (same as property) clears any manual address | T-7.2 | State |
| AC-8 | Selecting No (different address) shows postcode lookup | T-8.1 | Happy |
| AC-8 | Selecting No (different address) shows manual address fields | T-8.2 | Happy |
| - | No "same as property" radio selected shows error | T-8.E.1 | Error |

## Address Entry and Validation (AC-9 to AC-12)

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-9 | Find address button present for postcode lookup | T-9.1 | Happy |
| AC-10 | Manual address fields are editable | T-10.1 | Happy |
| AC-11 | Missing Building/Street shows error | T-11.1 | Error |
| AC-11 | Missing Town/City shows error | T-11.2 | Error |
| AC-11 | Missing Postcode shows error | T-11.3 | Error |
| AC-11 | County is optional (no error if empty) | T-11.4 | Happy |
| AC-11 | Country is optional (no error if empty) | T-11.5 | Happy |
| AC-12 | Error summary displayed for missing address fields | T-12.1 | Error |
| AC-12 | Focus moves to error summary | T-12.2 | Error |
| - | Entered address values preserved on validation failure | T-12.E.1 | Error |

## Additional Defendants (AC-13 to AC-15)

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-13 | Page asks "Do you need to add another defendant?" with Yes/No | T-13.1 | Happy |
| AC-14 | Selecting Yes shows "not supported" message | T-14.1 | Happy |
| AC-14 | Selecting Yes does not redirect to different page | T-14.2 | Edge |
| AC-15 | Selecting No allows continuation to next step | T-15.1 | Happy |
| - | No additional defendants radio selected shows error | T-15.E.1 | Error |

## Navigation and Submission (AC-16 to AC-18)

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-16 | Continue saves defendant to session | T-16.1 | Happy |
| AC-16 | Continue redirects to /claims/grounds | T-16.2 | Happy |
| AC-17 | Previous navigates to /claims/contact-preferences | T-17.1 | Happy |
| AC-17 | Previous preserves entered data | T-17.2 | Happy |
| AC-18 | Cancel link to /case-list exists | T-18.1 | Happy |
| AC-18 | Cancel preserves claim draft in session | T-18.2 | Happy |

## Accessibility and Persistence (AC-19 to AC-20)

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-19 | Error summary shown on validation failure | T-19.1 | Error |
| AC-19 | Error links to corresponding field | T-19.2 | Error |
| AC-19 | Focus moves to error summary | T-19.3 | Error |
| AC-19 | Previously entered values preserved | T-19.4 | Error |
| AC-20 | Defendant stored as array in session | T-20.1 | State |
| AC-20 | Session structure matches schema | T-20.2 | State |

## Cross-Cutting

| Behaviour | Test ID | Type |
|-----------|---------|------|
| Unauthenticated user redirected to sign-in | T-X.1 | Security |
| Page requires SOLICITOR role | T-X.2 | Security |
| Page has correct title pattern | T-X.3 | UX |
| Error page title includes "Error:" prefix | T-X.4 | UX |
| Re-visiting page shows previously saved defendant | T-X.5 | State |
