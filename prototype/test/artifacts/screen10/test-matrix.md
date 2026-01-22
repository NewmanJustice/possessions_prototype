# Screen 10: Contact Preferences - Test Behaviour Matrix

## Story 1: Notifications Email

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-1.1 | Registered email displayed read-only | T-1.1.1 | Happy |
| AC-1.1 | Label shows "Your My HMCTS registered email address is:" | T-1.1.2 | Happy |
| AC-1.2 | Selecting Yes sets notificationEmail to registered email | T-1.2.1 | Happy |
| AC-1.2 | Selecting Yes clears alternateEmail from session | T-1.2.2 | Happy |
| AC-1.3 | Selecting No reveals email input field | T-1.3.1 | Happy |
| AC-1.3 | Invalid email shows error summary | T-1.3.2 | Error |
| AC-1.3 | Invalid email shows inline error "Enter an email address in the correct format" | T-1.3.3 | Error |
| AC-1.3 | Focus moves to error summary on validation failure | T-1.3.4 | Error |
| AC-1.3 | Valid alternate email saved to session | T-1.3.5 | Happy |
| AC-1.3 | notificationEmail set to alternate email value | T-1.3.6 | Happy |
| AC-1.4 | Only single notification email stored | T-1.4.1 | Edge |
| - | Empty email (No selected) shows error | T-1.E.1 | Error |
| - | Whitespace-only email shows error | T-1.E.2 | Error |
| - | Email exceeding 254 chars shows error | T-1.E.3 | Edge |
| - | Entered email preserved on validation failure | T-1.E.4 | Error |
| - | No radio selected shows error | T-1.E.5 | Error |

## Story 2: Correspondence Address

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-2.1 | Registered address displayed read-only | T-2.1.1 | Happy |
| AC-2.1 | Label shows "Your organisation's My HMCTS registered address is:" | T-2.1.2 | Happy |
| AC-2.2 | Selecting Yes sets correspondenceAddress to registered | T-2.2.1 | Happy |
| AC-2.2 | Selecting Yes clears alternateAddress from session | T-2.2.2 | Happy |
| AC-2.3 | Selecting No reveals postcode input and Find address button | T-2.3.1 | Happy |
| AC-2.3 | Selecting No reveals address fields | T-2.3.2 | Happy |
| AC-2.4 | Postcode lookup returns dummy addresses in select | T-2.4.1 | Happy |
| AC-2.4 | Selecting address populates Building/Street, Town/City, Postcode | T-2.4.2 | Happy |
| AC-2.5 | Fields remain editable after address selection | T-2.5.1 | Happy |
| AC-2.6 | Missing Building/Street shows error | T-2.6.1 | Error |
| AC-2.6 | Missing Town/City shows error | T-2.6.2 | Error |
| AC-2.6 | Missing Postcode shows error | T-2.6.3 | Error |
| AC-2.6 | Error summary displayed with focus | T-2.6.4 | Error |
| - | Entered address values preserved on validation failure | T-2.E.1 | Error |
| - | No radio selected shows error | T-2.E.2 | Error |

## Story 3: Contact Phone Number

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-3.1 | Phone option displayed with Yes/No radios | T-3.1.1 | Happy |
| AC-3.1 | Label indicates phone is optional | T-3.1.2 | Happy |
| AC-3.2 | Selecting Yes reveals phone input | T-3.2.1 | Happy |
| AC-3.2 | Invalid phone shows error summary and inline error | T-3.2.2 | Error |
| AC-3.2 | Focus moves to error summary on phone validation failure | T-3.2.3 | Error |
| AC-3.3 | Selecting No sets contactPhoneActive to false | T-3.3.1 | Happy |
| AC-3.3 | Existing phone retained when No selected | T-3.3.2 | Edge |
| AC-3.4 | Valid phone saved to contactPhone in session | T-3.4.1 | Happy |
| AC-3.4 | contactPhoneActive set to true when phone provided | T-3.4.2 | Happy |
| - | Phone with 6 digits fails validation | T-3.E.1 | Boundary |
| - | Phone with 7 digits passes validation | T-3.E.2 | Boundary |
| - | Phone with 15 digits passes validation | T-3.E.3 | Boundary |
| - | Phone with 16 digits fails validation | T-3.E.4 | Boundary |
| - | Phone with spaces/formatting accepted | T-3.E.5 | Edge |
| - | Entered phone preserved on validation failure | T-3.E.6 | Error |

## Story 4: Save / Navigation Behaviour

| AC | Behaviour | Test ID | Type |
|----|-----------|---------|------|
| AC-4.1 | Continue saves contactPreferences to session | T-4.1.1 | Happy |
| AC-4.1 | Continue redirects to /claims/defendant-details | T-4.1.2 | Happy |
| AC-4.2 | Previous navigates to /claims/name-of-claimant | T-4.2.1 | Happy |
| AC-4.2 | Previous preserves session state | T-4.2.2 | Happy |
| AC-4.3 | Cancel navigates to /case-list | T-4.3.1 | Happy |
| AC-4.3 | Cancel preserves claim draft in session | T-4.3.2 | Happy |
| AC-4.4 | All registered + no phone allows submission | T-4.4.1 | Happy |
| - | Re-visiting page shows previously saved preferences | T-4.E.1 | Edge |

## Cross-Cutting

| Behaviour | Test ID | Type |
|-----------|---------|------|
| Unauthenticated user redirected to sign-in | T-X.1 | Security |
| Page requires SOLICITOR role | T-X.2 | Security |
| Page has correct title pattern | T-X.3 | UX |
| Error page title includes "Error:" prefix | T-X.4 | UX |
