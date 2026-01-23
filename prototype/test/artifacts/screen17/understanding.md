# Screen 17 — Mediation and settlement (Understanding)

## Purpose

This screen captures declarative confirmation about whether mediation and settlement have been attempted with the defendants, along with optional brief details about those attempts.

---

## User story reference

`businessArtifacts/userstories/screen17.txt`

---

## Journey context

- **Entry point:** Screen 16 (Pre-action protocol)
- **User type:** Professional (Solicitor)
- **Claim type:** England standard possession claim
- **Journey:** Assured tenancy rent arrears journey (but generic for all claim types)

---

## Routes

- **GET:** `/claims/mediation-settlement`
- **POST:** `/claims/mediation-settlement`

---

## Page content

### Mediation section (AC-1, AC-2, AC-3)
- **Guidance:** Explains what mediation is and how it helps
- **Question:** "Have you attempted mediation with the defendants?"
- **Radio options:** Yes / No (required)
- **Conditional text area:** Shows when Yes selected
  - Label: "Give details about the attempted mediation and what the outcome was"
  - Helper text: "You can enter up to 250 characters"
  - **Optional** field (AC-4)
  - Character limit: 250 (AC-5)
  - Hidden when No selected (Q4)

### Settlement section (AC-6, AC-7, AC-8)
- **Guidance:** Generic for all claim types (Q1) - explains settlement steps
- **Question:** "Have you tried to reach a settlement with the defendants?"
- **Radio options:** Yes / No (required)
- **Conditional text area:** Shows when Yes selected
  - Label: "Explain what steps you've taken to reach a settlement"
  - Helper text: "You can enter up to 250 characters"
  - **Optional** field (AC-9)
  - Character limit: 250 (AC-10)
  - Hidden when No selected (Q4)

---

## Session data

### Storage location
```js
session.claim.mediationSettlement = {
  mediationAttempted: true | false,
  mediationDetails: string | null,
  settlementAttempted: true | false,
  settlementDetails: string | null
}
```

### Data flow
- **Mediation attempted:** Radio selection → boolean
- **Mediation details:** Text area value (or null if No selected)
- **Settlement attempted:** Radio selection → boolean
- **Settlement details:** Text area value (or null if No selected)

### Data clearing (Q4)
- When user switches from **Yes → No**, details should be cleared (set to null)
- Prevents stale data persisting when user changes their mind

---

## Conditional display logic

### Mediation details text area
- **Show:** When `mediationAttempted === 'true'` (or 'yes')
- **Hide:** When `mediationAttempted === 'false'` (or 'no')
- **Clear data:** When switching from Yes to No

### Settlement details text area
- **Show:** When `settlementAttempted === 'true'` (or 'yes')
- **Hide:** When `settlementAttempted === 'false'` (or 'no')
- **Clear data:** When switching from Yes to No

---

## Navigation outcomes

### Forward navigation (AC-14)
- **Destination:** `/claims/notice-of-intention` (Q3)
- **Trigger:** Continue button + validation passed

### Backward navigation (AC-15)
- **Previous** → `/claims/preaction-protocol` (Screen 16) (Q2)
- Previous selections preserved

### Cancel (AC-16)
- **Cancel** → `/case-list`
- Claim draft remains in session

---

## Validation (AC-5, AC-10, AC-11)

### Required fields
| Field | Rule | Error Message |
|-------|------|---------------|
| mediationAttempted | Required | "Select whether you have attempted mediation" |
| settlementAttempted | Required | "Select whether you have tried to reach a settlement" |

### Optional fields with limits
| Field | Rule | Error Message |
|-------|------|---------------|
| mediationDetails | Optional, max 250 chars | "Enter 250 characters or fewer" |
| settlementDetails | Optional, max 250 chars | "Enter 250 characters or fewer" |

**Character limit specifics (Q5):**
- 250 characters: ✅ Valid
- 251 characters: ❌ Error triggered
- Empty (when Yes selected): ✅ Valid (optional)

### Input preservation (AC-12)
- All entered values preserved on validation error
- Radio selections preserved
- Text area content preserved

---

## Accessibility (AC-17)

- Error summary displayed at top
- Error links to radio groups and text areas
- Focus moves to error summary
- Radio inputs properly labelled
- Text areas properly labelled
- Keyboard accessible

---

## Testing considerations

1. **Conditional display** — Text areas show/hide based on radio selection
2. **Data clearing** — Switching Yes→No should clear details (Q4)
3. **Optional fields** — Text areas can be empty (no validation when Yes + empty)
4. **Character limits** — Test exactly 251 chars triggers error (Q5)
5. **Multiple errors** — Can have errors on both radios + both text areas
6. **Generic guidance** — Settlement guidance not conditional on rent arrears (Q1)
7. **Input preservation** — All values preserved on error (AC-12)

---

## Explicit non-goals

- No validation of whether mediation/settlement was sufficient
- No requirement that mediation/settlement must be attempted
- No evidence, dates, or mediator details collected
- Declarative statements only (consequences handled downstream)
