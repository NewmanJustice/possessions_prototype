# Screen 39: Pay Claim Fee - Test Behaviour Matrix

## AC-1: Display page heading

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-1.1 | Page heading "Pay claim fee" is displayed | Happy path |
| T-1.2 | Page heading uses h1 element | Accessibility |

## AC-2: Display case number

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-2.1 | Case number text is displayed on the page | Happy path |
| T-2.2 | Case number follows expected format pattern | Happy path |

## AC-3: Display primary payment button

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-3.1 | "Pay £404 claim fee" button is displayed | Happy path |
| T-3.2 | Payment button is styled as start button (govuk-button--start) | Happy path |
| T-3.3 | Payment button contains £404 amount | Happy path |

## AC-4: Display payment section heading

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-4.1 | "Make a payment" heading is displayed | Happy path |
| T-4.2 | Heading uses appropriate level (h2) | Accessibility |

## AC-5: Display payment instruction text

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-5.1 | Instruction text mentions £404 claim fee | Happy path |
| T-5.2 | Instruction text explains claim will not progress until paid | Happy path |
| T-5.3 | "Pay the claim fee" link is present within text | Happy path |

## AC-6: Display close and return button

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-6.1 | "Close and return to case details" button is displayed | Happy path |
| T-6.2 | Close button is styled as secondary button | Happy path |

## AC-7: Pay claim fee button navigation

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-7.1 | Payment button links to /case-list | Happy path |

## AC-8: Pay the claim fee link navigation

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-8.1 | "Pay the claim fee" link points to /case-list | Happy path |

## AC-9: Close and return navigation

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-9.1 | Close button links to /case-list | Happy path |

## AC-10: No Previous button

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-10.1 | No Previous button is present on the page | Negative |
| T-10.2 | No action="previous" form element exists | Negative |

## AC-11: No Cancel link

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-11.1 | No Cancel link is present on the page | Negative |

## AC-12: Accessibility compliance

| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-12.1 | Page has proper h1 heading | Accessibility |
| T-12.2 | Buttons use govuk-button component | Accessibility |
| T-12.3 | Links are keyboard accessible (have href attribute) | Accessibility |
| T-12.4 | Page structure is logical (h1 followed by content) | Accessibility |

---

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2 | Page heading display |
| AC-2 | T-2.1, T-2.2 | Case number display |
| AC-3 | T-3.1, T-3.2, T-3.3 | Primary payment button |
| AC-4 | T-4.1, T-4.2 | Make a payment heading |
| AC-5 | T-5.1, T-5.2, T-5.3 | Instructional text with link |
| AC-6 | T-6.1, T-6.2 | Close and return button |
| AC-7 | T-7.1 | Payment button navigation |
| AC-8 | T-8.1 | Payment link navigation |
| AC-9 | T-9.1 | Close button navigation |
| AC-10 | T-10.1, T-10.2 | No Previous button |
| AC-11 | T-11.1 | No Cancel link |
| AC-12 | T-12.1, T-12.2, T-12.3, T-12.4 | Accessibility compliance |

**Total: 20 test cases covering 12 acceptance criteria**
