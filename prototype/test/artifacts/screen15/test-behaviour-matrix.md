# Screen 15: Reasons for Possession - Test Behaviour Matrix

## AC-1: Display dynamic ground heading

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-1.1 | Display ground name in heading | AC-1 |
| T-1.2 | Display ground number in heading | AC-1 |
| T-1.3 | Format as "[Ground name] ([ground number])" | AC-1 |
| T-1.4 | Update heading for each ground in loop | AC-1 |

## AC-2: Display reasons input and guidance

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-2.1 | Display question "Why are you making a claim..." | AC-2 |
| T-2.2 | Display textarea with label "Give details about your reasons" | AC-2 |
| T-2.3 | Display hint about uploading documents later | AC-2 |
| T-2.4 | Display hint about 500 character limit | AC-2 |
| T-2.5 | Use govukCharacterCount component with maxlength 500 | AC-2 |

## AC-3: Reasons are optional

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-3.1 | Accept submission with empty textarea | AC-3 |
| T-3.2 | No required-field error displayed | AC-3 |

## AC-4: Character limit enforced

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-4.1 | Accept exactly 500 characters | AC-4 |
| T-4.2 | Show error for 501+ characters | AC-4 |
| T-4.3 | Error message: "Enter 500 characters or fewer" | AC-4 |
| T-4.4 | Display GOV.UK error summary | AC-4 |
| T-4.5 | Error summary links to textarea (#reasons) | AC-4 |
| T-4.6 | Focus moves to error summary | AC-4 |

## AC-5: Preserve input on validation failure

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-5.1 | Preserve entered text when validation fails | AC-5 |
| T-5.2 | Re-render with same ground heading | AC-5 |

## AC-6: Persist reasons per ground

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-6.1 | Store reasons keyed by ground identifier | AC-6 |
| T-6.2 | Store empty string when no reasons entered | AC-6 |
| T-6.3 | Pre-populate saved reasons on revisit | AC-6 |
| T-6.4 | Update stored value when modified | AC-6 |

## AC-7: Iterate through selected grounds

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-7.1 | Redirect to same route for next ground | AC-7 |
| T-7.2 | Increment currentIndex in reasonsLoop | AC-7 |
| T-7.3 | Display next ground's heading after submission | AC-7 |

## AC-8: Completion routes to pre-action protocol

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-8.1 | Redirect to /claims/preaction-protocol when last ground completed | AC-8 |
| T-8.2 | Clear reasonsLoop from session after completion | AC-8 |

## AC-9: Previous navigation within loop

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-9.1 | Previous from first ground goes to /claims/grounds-for-possession | AC-9 |
| T-9.2 | Previous from subsequent ground goes to previous ground | AC-9 |
| T-9.3 | Preserve current input when navigating back | AC-9 |
| T-9.4 | Decrement currentIndex in reasonsLoop | AC-9 |

## AC-10: Cancel behaviour

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-10.1 | Cancel link present on page | AC-10 |
| T-10.2 | Cancel link targets /case-list | AC-10 |
| T-10.3 | Claim draft remains in session after cancel | AC-10 |

## AC-11: Accessibility compliance

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-11.1 | Error summary displayed at top on validation failure | AC-11 |
| T-11.2 | Error summary links to textarea | AC-11 |
| T-11.3 | Focus moves to error summary | AC-11 |
| T-11.4 | Textarea properly labelled | AC-11 |
| T-11.5 | Keyboard accessible controls | AC-11 |
| T-11.6 | Page title prefixed with "Error:" on validation failure | AC-11 |

## Edge Cases

| Test ID | Behaviour | Relates to |
|---------|-----------|------------|
| T-E.1 | No grounds selected - redirect to pre-action protocol | Edge case |
| T-E.2 | Whitespace-only input trimmed before storage | Edge case |
| T-E.3 | Loop reinitialises if grounds change | Edge case |
| T-E.4 | Authentication required | Cross-cutting |

## Traceability Table

| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2, T-1.3, T-1.4 | Dynamic heading based on ground |
| AC-2 | T-2.1, T-2.2, T-2.3, T-2.4, T-2.5 | Input field and guidance |
| AC-3 | T-3.1, T-3.2 | Optional field |
| AC-4 | T-4.1, T-4.2, T-4.3, T-4.4, T-4.5, T-4.6 | Character limit validation |
| AC-5 | T-5.1, T-5.2 | Input preservation |
| AC-6 | T-6.1, T-6.2, T-6.3, T-6.4 | Session persistence |
| AC-7 | T-7.1, T-7.2, T-7.3 | Loop iteration |
| AC-8 | T-8.1, T-8.2 | Loop completion |
| AC-9 | T-9.1, T-9.2, T-9.3, T-9.4 | Previous navigation |
| AC-10 | T-10.1, T-10.2, T-10.3 | Cancel behaviour |
| AC-11 | T-11.1, T-11.2, T-11.3, T-11.4, T-11.5, T-11.6 | Accessibility |
