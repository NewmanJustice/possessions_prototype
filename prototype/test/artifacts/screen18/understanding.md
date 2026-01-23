# Screen 18 — Notice of intention (Understanding)

## Purpose

This screen captures declarative confirmation from the solicitor about whether they have served notice of their intention to begin possession proceedings to the defendants.

---

## User story reference

`businessArtifacts/userstories/screen18.txt`

---

## Journey context

- **Entry point:** Screen 17 (Mediation and settlement)
- **User type:** Professional (Solicitor)
- **Claim type:** England standard possession claim
- **Journey:** Assured tenancy rent arrears journey

---

## Routes

- **GET:** `/claims/notice-of-intention`
- **POST:** `/claims/notice-of-intention`

---

## Page content

### Guidance (AC-1)
- Guidance explaining:
  - Notice periods vary depending on grounds
  - Some grounds may not require notice
  - Link to external guidance on possession notice periods
    - Opens in new tab (`target="_blank"`)
    - Has security attributes (`rel="noopener noreferrer"`)
- **Warning message:** Judge may not grant order if notice procedure not followed
- **Test approach:** Presence-only (Q2) + link attributes verification (Q1)

### Question (AC-2)
- Question: "Have you served notice to the defendants?"
- Radio options: **Yes** / **No**
- Required field

---

## Session data

### Storage location
```js
session.claim.noticeOfIntention = {
  noticeServed: true | false
}
```

### Data flow
- User selects **Yes** → `noticeServed: true`
- User selects **No** → `noticeServed: false`
- Both values stored regardless of choice
- Data persists across navigation
- Previous answer can be changed (updates stored value)

---

## Navigation outcomes

### Forward navigation (AC-5)
- **Destination:** `/claims/notice-details` (Q3)
- **Trigger:** Continue button + validation passed
- Both Yes and No go to same destination

### Backward navigation (AC-6)
- **Previous** → `/claims/mediation-settlement` (Screen 17)
- Previous selections preserved

### Cancel (AC-7)
- **Cancel** → `/case-list`
- Claim draft remains in session

---

## Validation (AC-3)

### Required field
- **Field:** Notice served radio
- **Trigger:** No selection made + Continue clicked
- **Error message:** "Select whether you have served notice to the defendants"
- **Error behavior:** GOV.UK error summary + inline error + focus to summary

---

## Accessibility (AC-8)

- Error summary displayed at top
- Error links to radio group
- Focus moves to error summary
- Radio inputs properly labelled
- Keyboard accessible

---

## Testing considerations

1. **Simple declarative screen** — no complex branching, single radio question
2. **Convergent routing** — both Yes/No lead to same next screen
3. **External link** — must verify presence AND attributes (target, rel) (Q1)
4. **Presence-only content** — don't test specific guidance text (Q2)
5. **Standard pattern** — follows GOV.UK Design System radio pattern
6. **Similar to Screen 16** — same structure and validation approach

---

## Explicit non-goals

- No validation of whether notice was legally required
- No collection of notice dates or documents
- No prevention of progression if notice not served
- Declarative only (details collected on next screen)
