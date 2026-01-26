# Understanding: Screen 13.2 — Secure/Flexible Tenancy Grounds Selection

## Story Summary
Solicitors working with secure or flexible tenancies need to select the applicable possession grounds from a predefined list. Ground 1 requires additional specification (rent arrears vs breach of tenancy) via a conditional radio group.

---

## Primary Behaviour (Happy Path)

1. User views list of grounds as checkboxes (discretionary + mandatory)
2. User selects one or more grounds (at least one required - Q4)
3. If Ground 1 selected:
   - Conditional radio group revealed
   - User must choose: Rent arrears OR Breach of tenancy
4. Click Continue
5. Selected grounds stored in session
6. Redirect to `/claims/rent-arrears-breach-of-tenency` (Q6)

---

## Key Behaviours

### Input Capture
- **Checkboxes:** Multiple selection allowed (8 grounds total)
- **Conditional Radio:** Appears only when Ground 1 is checked
- **Minimum selection:** At least 1 ground required (Q4)

### Grounds List (from screen13.2.png)

#### Discretionary Grounds
1. **Ground 1:** Rent arrears or breach of the tenancy
   - Conditional: Rent arrears / Breach of tenancy
2. **Ground 2:** Nuisance or annoyance
3. **Ground 2A:** Domestic violence
4. **Ground 3:** Deterioration of dwelling
5. **Ground 4:** Deterioration of furniture
6. **Ground 5:** False statement
7. **Ground 6:** Premium paid for assignment
8. **Ground 7:** Misconduct or conviction

#### Mandatory Ground
9. **Ground 8:** Serious rent arrears

### Conditional Logic
- **Trigger:** Ground 1 checkbox checked
- **Reveal:** Radio group with 2 options
- **Requirement:** One radio option MUST be selected when Ground 1 is checked
- **Hide:** Radio group hidden when Ground 1 is unchecked

---

## Variants

### Selection Variations
- Single ground selected (no Ground 1)
- Single ground selected (Ground 1 only)
- Multiple grounds including Ground 1
- Multiple grounds excluding Ground 1
- All grounds selected

### Ground 1 Conditional Variations
- Ground 1 selected → Rent arrears chosen
- Ground 1 selected → Breach of tenancy chosen
- Ground 1 selected → No sub-option (validation error)
- Ground 1 deselected → Radio group hidden

---

## Constraints

### Business Rules
1. At least one ground must be selected (Q4 clarification)
2. Ground 1 requires sub-selection (rent arrears or breach)
3. Grounds stored by number (ground1, ground2, etc.)
4. Ground 1 type stored separately (ground1Type)

### Technical Constraints
- Session path: `session.claim.grounds.secureFlexible`
- Conditional reveal using GOV.UK pattern
- Radio group announced to assistive tech when revealed
- Server-side validation for Ground 1 sub-option

### Security Constraints
- No legal validation of grounds (per explicit non-goals)
- No validation of grounds combination logic

---

## Assumptions

**A1 — At least one ground required:**  
User must select at least one ground to continue. Submitting with no grounds triggers validation error.  
**Rationale:** Q4 clarification from Steve ("At least 1")

**A2 — Ground 1 conditional is required:**  
When Ground 1 is selected, one of the two radio options MUST be chosen before continuing.  
**Rationale:** AC-4 explicitly requires sub-option selection

**A3 — Ground labels match image:**  
Checkbox labels and ground numbers match the design in `businessArtifacts/screen13.2.png`.  
**Rationale:** Q1/Q2 clarification from Steve

**A4 — Session value format:**  
Ground 1 sub-option stored as 'rentArrears' or 'breach' (not 'rent-arrears' or 'breach-of-tenancy').  
**Rationale:** Q3 clarification - session values from user story are fine

**A5 — Next screen route:**  
After successful submission, redirect to `/claims/rent-arrears-breach-of-tenency`.  
**Rationale:** Q5/Q6 clarification from Steve (overrides AC-7 which had typo)

**A6 — Placeholder route needed:**  
Create placeholder route for `/claims/rent-arrears-breach-of-tenency` to support testing.  
**Rationale:** Q6 clarification from Steve

**A7 — Ground 1 deselection behavior:**  
When Ground 1 is unchecked after being checked, the ground1Type value is cleared/set to null.  
**Rationale:** Standard form behavior - don't retain hidden conditional values

**A8 — Previous navigation:**  
Previous button returns to `/claims/tenancy` (Screen 12).  
**Rationale:** AC-8 specifies Screen 12 as previous page

**A9 — All grounds optional (except minimum one):**  
No specific ground is individually required; only requirement is at least one total selection.  
**Rationale:** AC-2 + Q4 clarification

**A10 — Error message text:**  
Ground 1 sub-option error: "Select whether ground 1 is rent arrears or breach of tenancy"  
No grounds selected error: "Select at least one ground for possession"  
**Rationale:** AC-4 provides explicit error text; minimum selection error inferred

---

## Ambiguities & Questions

✅ **Q1 — Complete grounds list:** RESOLVED — See screen13.2.png  
✅ **Q2 — Ground 1 label:** RESOLVED — "Rent arrears or breach of the tenancy"  
✅ **Q3 — Session values:** RESOLVED — 'rentArrears' and 'breach'  
✅ **Q4 — Zero selections:** RESOLVED — At least 1 required  
✅ **Q5 — Next route typo:** RESOLVED — Use /claims/rent-arrears-breach-of-tenency  
✅ **Q6 — Placeholder needed:** RESOLVED — Yes, create placeholder

---

## Session State Structure

```javascript
session.claim.grounds.secureFlexible = {
  ground1: true | false,
  ground1Type: 'rentArrears' | 'breach' | null,  // null when ground1 is false
  ground2: true | false,
  ground2A: true | false,
  ground3: true | false,
  ground4: true | false,
  ground5: true | false,
  ground6: true | false,
  ground7: true | false,
  ground8: true | false
}
```

### Storage Notes
- All grounds stored as boolean flags
- ground1Type only populated when ground1 === true
- Use camelCase for session keys (ground2A not ground2a)

---

## Out of Scope

- ❌ Legal validation of selected grounds
- ❌ Validation of grounds combinations
- ❌ Notice period calculations
- ❌ Arrears amounts (captured elsewhere)
- ❌ Preventing claim progression based on grounds
- ❌ Ground descriptions or legal text beyond labels

---

## Navigation Flow

```
Previous: /claims/tenancy (Screen 12)
  ↓
Current: /claims/grounds-for-possession-secure-flexible (Screen 13.2)
  ↓
Next: /claims/rent-arrears-breach-of-tenency (Screen 13.x - placeholder)

Cancel: /case-list (draft preserved)
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Conditional reveal not working | Low | High | Test with/without Ground 1 selection |
| Ground 1 validation bypass | Low | High | Test all Ground 1 conditional scenarios |
| Session data structure incorrect | Low | Medium | Explicitly test session structure |
| Checkbox state not preserved | Low | Medium | Test revisit scenarios |
| Accessibility issues with conditional | Medium | High | Test screen reader announcements |
| Error focus not working | Low | Medium | Test error summary focus management |

---

**Status:** ✅ Ready for test plan creation  
**Next Step:** Create test plan, test matrix, and traceability table
