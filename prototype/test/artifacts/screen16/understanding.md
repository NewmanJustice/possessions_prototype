# Screen 16 — Pre-action protocol (Understanding)

## Purpose

This screen captures declarative confirmation from the solicitor about whether they have followed the pre-action protocol before making a possession claim.

---

## User story reference

`businessArtifacts/userstories/screen16.txt`

---

## Journey context

- **Entry point:** Screen 13.1.1 (Grounds for Possession - Assured Selection) when user selects **No** (no additional grounds)
- **User type:** Professional (Solicitor)
- **Claim type:** England standard possession claim
- **Journey:** Assured tenancy rent arrears journey

---

## Routes

- **GET:** `/claims/preaction-protocol`
- **POST:** `/claims/preaction-protocol`

---

## Page content

### Guidance (AC-1)
- Guidance text explaining registered providers should follow pre-action protocol
- Additional guidance about rent arrears claims
- Prominent warning about delays/rejection if protocol not followed
- **Test approach:** Presence-only (not specific text)

### Question (AC-2)
- Question: "Have you followed the pre-action protocol?"
- Radio options: **Yes** / **No**
- Required field

---

## Session data

### Storage location
```js
session.claim.preActionProtocol = {
  followed: true | false
}
```

### Data flow
- User selects **Yes** → `followed: true`
- User selects **No** → `followed: false`
- Both values stored regardless of choice
- Data persists across navigation
- Previous answer can be changed (updates stored value)

---

## Navigation outcomes

### Forward navigation (AC-4, AC-5)

| User selection | Session value | Destination |
|---|---|---|
| Yes | `followed: true` | `/claims/mediation-settlement` |
| No | `followed: false` | `/claims/mediation-settlement` |

> Both paths intentionally converge to same destination. The stored value is retained for downstream consideration (e.g., court decision-making).

### Backward navigation (AC-6)
- **Previous** → `/claims/grounds-for-possession-assured-confirmation` (Screen 13.1)
- Previous selections preserved

### Cancel (AC-7)
- **Cancel** → `/case-list`
- Claim draft remains in session

---

## Validation (AC-3)

### Required field
- **Field:** Pre-action protocol confirmation radio
- **Trigger:** No selection made + Continue clicked
- **Error message:** "Select whether you have followed the pre-action protocol"
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

1. **Simple declarative screen** — no complex branching, no conditional logic
2. **Convergent routing** — both answers lead to same next screen
3. **Session updates** — test that changing answer updates stored value
4. **Presence-only content** — don't test specific guidance text
5. **Standard pattern** — follows GOV.UK Design System radio pattern
