# Test Behaviour Matrix: Screen 13.2 — Secure/Flexible Tenancy Grounds Selection

## AC-1 → Display grounds list

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-1.1 | Page displays grounds list | On secure/flexible grounds page | Page loads | See explanatory text and grounds checkboxes |
| T-1.2 | Ground 1 checkbox present | Viewing grounds page | Inspect checkboxes | "Rent arrears or breach of the tenancy" checkbox exists |
| T-1.3 | Ground 2 checkbox present | Viewing grounds page | Inspect checkboxes | "Nuisance or annoyance" checkbox exists |
| T-1.4 | Ground 2A checkbox present | Viewing grounds page | Inspect checkboxes | "Domestic violence" checkbox exists |
| T-1.5 | Ground 3 checkbox present | Viewing grounds page | Inspect checkboxes | "Deterioration of dwelling" checkbox exists |
| T-1.6 | Ground 4 checkbox present | Viewing grounds page | Inspect checkboxes | "Deterioration of furniture" checkbox exists |
| T-1.7 | Ground 5 checkbox present | Viewing grounds page | Inspect checkboxes | "False statement" checkbox exists |
| T-1.8 | Ground 6 checkbox present | Viewing grounds page | Inspect checkboxes | "Premium paid for assignment" checkbox exists |
| T-1.9 | Ground 7 checkbox present | Viewing grounds page | Inspect checkboxes | "Misconduct or conviction" checkbox exists |
| T-1.10 | Ground 8 checkbox present | Viewing grounds page | Inspect checkboxes | "Serious rent arrears" checkbox exists |
| T-1.11 | Checkboxes allow multiple | Viewing form | Inspect inputs | Multiple checkboxes can be selected |

---

## AC-2 → Multiple selection allowed

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-2.1 | At least one required | No grounds selected | Submit form | Error: "Select at least one ground for possession" |
| T-2.2 | Single ground accepted | Select one ground (not Ground 1) | Submit form | Accepted (no error) |
| T-2.3 | Multiple grounds accepted | Select multiple grounds | Submit form | All selections accepted |
| T-2.4 | All grounds can be selected | Select all 8 grounds + Ground 1 sub-option | Submit form | All selections accepted |

---

## AC-3 → Reveal sub-question when ground 1 selected

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-3.1 | Conditional initially hidden | On grounds page (Ground 1 not selected) | Page loads | Radio group not visible |
| T-3.2 | Conditional revealed on check | Ground 1 not selected | Check Ground 1 | Radio group with 2 options revealed |
| T-3.3 | Rent arrears option present | Ground 1 selected | View conditional | "Rent arrears" radio option visible |
| T-3.4 | Breach option present | Ground 1 selected | View conditional | "Breach of tenancy" radio option visible |
| T-3.5 | Conditional hidden on uncheck | Ground 1 selected | Uncheck Ground 1 | Radio group hidden |
| T-3.6 | Other grounds no reveal | Select Ground 2, 3, etc. | Check non-Ground-1 boxes | No conditional radio group appears |

---

## AC-4 → One sub-option required when ground 1 selected

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-4.1 | Ground 1 without sub-option | Ground 1 selected, no radio chosen | Submit form | Error: "Select whether ground 1 is rent arrears or breach of tenancy" |
| T-4.2 | Error summary displayed | Ground 1 without sub-option | Submit form | GOV.UK error summary shown |
| T-4.3 | Focus on error summary | Ground 1 validation fails | Page re-renders | Focus moves to error summary |
| T-4.4 | Error link to radio group | Error summary shown | Click error link | Focus moves to conditional radio group |
| T-4.5 | Rent arrears selected valid | Ground 1 + rent arrears | Submit form | Validation passes |
| T-4.6 | Breach selected valid | Ground 1 + breach | Submit form | Validation passes |

---

## AC-5 → Preserve sub-selection on revisit

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-5.1 | Ground 1 preserved | Submit with Ground 1 + rent arrears | Revisit page | Ground 1 checkbox checked |
| T-5.2 | Rent arrears preserved | Submit with Ground 1 + rent arrears | Revisit page | "Rent arrears" radio selected |
| T-5.3 | Breach preserved | Submit with Ground 1 + breach | Revisit page | "Breach of tenancy" radio selected |
| T-5.4 | Conditional revealed on revisit | Submit with Ground 1 selected | Revisit page | Radio group visible (not hidden) |

---

## AC-6 → Persist secure/flexible grounds

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-6.1 | Store Ground 1 flag | Select Ground 1 + rent arrears | Submit | `session.claim.grounds.secureFlexible.ground1 = true` |
| T-6.2 | Store ground1Type | Select Ground 1 + rent arrears | Submit | `session.claim.grounds.secureFlexible.ground1Type = 'rentArrears'` |
| T-6.3 | Store ground1Type (breach) | Select Ground 1 + breach | Submit | `session.claim.grounds.secureFlexible.ground1Type = 'breach'` |
| T-6.4 | ground1Type null when not selected | Submit without Ground 1 | Submit | `session.claim.grounds.secureFlexible.ground1Type = null` |
| T-6.5 | Store Ground 2 | Select Ground 2 | Submit | `session.claim.grounds.secureFlexible.ground2 = true` |
| T-6.6 | Store Ground 2A | Select Ground 2A | Submit | `session.claim.grounds.secureFlexible.ground2A = true` |
| T-6.7 | Store Ground 3 | Select Ground 3 | Submit | `session.claim.grounds.secureFlexible.ground3 = true` |
| T-6.8 | Store all selected grounds | Select Grounds 2, 5, 8 | Submit | All 3 flags set to true, others false |
| T-6.9 | Session structure correct | Submit valid form | Check session | `secureFlexible` object has all ground flags |
| T-6.10 | Clear ground1Type on deselect | Select Ground 1 + type, then deselect Ground 1 | Submit | `ground1Type = null` |

---

## AC-7 → Continue route

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-7.1 | Redirect on success | Valid submission (Ground 2 only) | Submit form | Redirect to `/claims/rent-arrears-breach-of-tenency` |
| T-7.2 | Redirect with Ground 1 | Valid submission (Ground 1 + rent arrears) | Submit form | Redirect to `/claims/rent-arrears-breach-of-tenency` |
| T-7.3 | Placeholder route exists | Submit valid form | Follow redirect | Placeholder page renders (200 status) |

---

## AC-8 → Previous and Cancel

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-8.1 | Previous button exists | On grounds page | View page | "Previous" link present |
| T-8.2 | Previous → tenancy | On grounds page | Click Previous | Navigate to `/claims/tenancy` |
| T-8.3 | Data preserved on previous | Select grounds | Click Previous → return | Selections preserved in session |
| T-8.4 | Cancel button exists | On grounds page | View page | "Cancel" link present |
| T-8.5 | Cancel → case list | On grounds page | Click Cancel | Navigate to `/case-list` |
| T-8.6 | Draft preserved on cancel | Select grounds | Click Cancel | Session data retained |

---

## AC-9 → Validation errors

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-9.1 | Error summary on no selection | No grounds selected | Submit | GOV.UK error summary displayed |
| T-9.2 | Error summary on Ground 1 miss | Ground 1 only, no sub-option | Submit | GOV.UK error summary displayed |
| T-9.3 | Multiple errors shown | No grounds + (if somehow possible) | Submit | All errors in summary |
| T-9.4 | Error links functional | Errors present | View summary | Links have `href` to fields |
| T-9.5 | Inline error on checkboxes | No grounds selected | Submit | Inline error on checkbox group |
| T-9.6 | Inline error on Ground 1 radio | Ground 1 without sub-option | Submit | Inline error on radio group |
| T-9.7 | Values preserved on error | Select grounds → validation fails | View re-rendered page | Previously selected values shown |

---

## AC-10 → Accessibility

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-10.1 | Error summary focus | Validation errors | Page re-renders | Error summary has `tabindex="-1"` |
| T-10.2 | Error summary links | Errors present | View summary | Links target correct form controls |
| T-10.3 | Keyboard accessible | View form | Tab through controls | All checkboxes and radios accessible |
| T-10.4 | Labels properly associated | View form | Inspect HTML | All inputs have associated labels |
| T-10.5 | Conditional radio announced | Ground 1 checked | Reveal occurs | Radio group has ARIA attributes |
| T-10.6 | ARIA on conditional | Ground 1 selected | View HTML | Conditional has `govuk-radios__conditional` |
| T-10.7 | Screen reader support | Errors present | Inspect HTML | Error messages linked via `aria-describedby` |

---

## Edge Cases & Additional Tests

| Test ID | Behaviour | Given | When | Then |
|---------|-----------|-------|------|------|
| T-E.1 | Check/uncheck Ground 1 multiple times | Ground 1 checked → unchecked → checked | Submit with sub-option | Validates correctly |
| T-E.2 | All grounds + Ground 1 type | Select all 8 grounds + rent arrears | Submit | All stored, including ground1Type |
| T-E.3 | Change Ground 1 type | Submit with rent arrears → revisit → change to breach | Re-submit | ground1Type updated to 'breach' |
| T-E.4 | Ground 2A stored correctly | Select Ground 2A | Submit | `ground2A = true` (camelCase, not ground2a) |
| T-E.5 | Only Ground 8 selected | Select only Ground 8 (mandatory) | Submit | Valid submission |
| T-E.6 | Preserve on validation error | Select multiple grounds → cause error | View re-rendered | All selections preserved |
| T-E.7 | Ground 1 conditional re-validation | Ground 1 + no type → error → add type | Re-submit | Validation passes |

---

## Total Tests by Category

- **Display:** 11 tests (T-1.x)
- **Multiple selection:** 4 tests (T-2.x)
- **Conditional reveal:** 6 tests (T-3.x)
- **Ground 1 validation:** 6 tests (T-4.x)
- **Preservation:** 4 tests (T-5.x)
- **Session persistence:** 10 tests (T-6.x)
- **Routing:** 3 tests (T-7.x)
- **Navigation:** 6 tests (T-8.x)
- **Error handling:** 7 tests (T-9.x)
- **Accessibility:** 7 tests (T-10.x)
- **Edge cases:** 7 tests (T-E.x)

**Total: 71 tests**

---

**Status:** ✅ Test matrix complete  
**Next:** Create traceability table mapping tests to acceptance criteria
