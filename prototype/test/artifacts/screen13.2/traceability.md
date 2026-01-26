# Traceability Table: Screen 13.2 — Secure/Flexible Tenancy Grounds Selection

## Acceptance Criteria → Test Coverage

| AC | Description | Test IDs | Coverage | Notes |
|----|-------------|----------|----------|-------|
| **AC-1** | Display grounds list | T-1.1 to T-1.11 | ✅ Complete | All 8 grounds (9 checkboxes including 2A) |
| **AC-2** | Multiple selection allowed | T-2.1 to T-2.4 | ✅ Complete | At least 1 required (Q4 clarification) |
| **AC-3** | Reveal sub-question (Ground 1) | T-3.1 to T-3.6 | ✅ Complete | Conditional radio reveal/hide |
| **AC-4** | Sub-option required (Ground 1) | T-4.1 to T-4.6 | ✅ Complete | Rent arrears or breach validation |
| **AC-5** | Preserve sub-selection | T-5.1 to T-5.4 | ✅ Complete | Ground 1 + type on revisit |
| **AC-6** | Persist grounds in session | T-6.1 to T-6.10 | ✅ Complete | Session structure and values |
| **AC-7** | Continue route | T-7.1 to T-7.3 | ✅ Complete | Redirect to rent-arrears-breach-of-tenency |
| **AC-8** | Previous and Cancel | T-8.1 to T-8.6 | ✅ Complete | Navigation and data preservation |
| **AC-9** | Validation errors | T-9.1 to T-9.7 | ✅ Complete | GOV.UK error patterns |
| **AC-10** | Accessibility | T-10.1 to T-10.7 | ✅ Complete | Keyboard, ARIA, screen readers |

---

## Test Categories → Acceptance Criteria

### Display Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-1.1 | AC-1 | Page shows grounds list |
| T-1.2 | AC-1 | Ground 1 checkbox |
| T-1.3 | AC-1 | Ground 2 checkbox |
| T-1.4 | AC-1 | Ground 2A checkbox |
| T-1.5 | AC-1 | Ground 3 checkbox |
| T-1.6 | AC-1 | Ground 4 checkbox |
| T-1.7 | AC-1 | Ground 5 checkbox |
| T-1.8 | AC-1 | Ground 6 checkbox |
| T-1.9 | AC-1 | Ground 7 checkbox |
| T-1.10 | AC-1 | Ground 8 checkbox |
| T-1.11 | AC-1 | Multiple checkboxes selectable |

**Coverage:** AC-1 fully covered

---

### Multiple Selection Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-2.1 | AC-2 | At least one ground required |
| T-2.2 | AC-2 | Single ground accepted |
| T-2.3 | AC-2 | Multiple grounds accepted |
| T-2.4 | AC-2 | All grounds can be selected |

**Coverage:** AC-2 fully covered

---

### Conditional Reveal Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-3.1 | AC-3 | Conditional initially hidden |
| T-3.2 | AC-3 | Conditional revealed on Ground 1 check |
| T-3.3 | AC-3 | Rent arrears option present |
| T-3.4 | AC-3 | Breach of tenancy option present |
| T-3.5 | AC-3 | Conditional hidden on uncheck |
| T-3.6 | AC-3 | Other grounds don't trigger reveal |

**Coverage:** AC-3 fully covered

---

### Ground 1 Validation Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-4.1 | AC-4 | Ground 1 without sub-option → error |
| T-4.2 | AC-4 | Error summary displayed |
| T-4.3 | AC-4 | Focus on error summary |
| T-4.4 | AC-4 | Error link to radio group |
| T-4.5 | AC-4 | Rent arrears selection valid |
| T-4.6 | AC-4 | Breach selection valid |

**Coverage:** AC-4 fully covered

---

### Preservation Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-5.1 | AC-5 | Ground 1 checkbox preserved |
| T-5.2 | AC-5 | Rent arrears radio preserved |
| T-5.3 | AC-5 | Breach radio preserved |
| T-5.4 | AC-5 | Conditional revealed on revisit |

**Coverage:** AC-5 fully covered

---

### Session Persistence Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-6.1 | AC-6 | Store ground1 flag |
| T-6.2 | AC-6 | Store ground1Type (rentArrears) |
| T-6.3 | AC-6 | Store ground1Type (breach) |
| T-6.4 | AC-6 | ground1Type null when not selected |
| T-6.5 | AC-6 | Store ground2 flag |
| T-6.6 | AC-6 | Store ground2A flag (camelCase) |
| T-6.7 | AC-6 | Store ground3 flag |
| T-6.8 | AC-6 | Store multiple grounds |
| T-6.9 | AC-6 | Session structure correct |
| T-6.10 | AC-6 | Clear ground1Type on deselect |

**Coverage:** AC-6 fully covered

---

### Routing Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-7.1 | AC-7 | Redirect on success (no Ground 1) |
| T-7.2 | AC-7 | Redirect with Ground 1 |
| T-7.3 | AC-7 | Placeholder route exists |

**Coverage:** AC-7 fully covered

---

### Navigation Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-8.1 | AC-8 | Previous button present |
| T-8.2 | AC-8 | Previous → /claims/tenancy |
| T-8.3 | AC-8 | Data preserved on previous |
| T-8.4 | AC-8 | Cancel button present |
| T-8.5 | AC-8 | Cancel → /case-list |
| T-8.6 | AC-8 | Draft preserved on cancel |

**Coverage:** AC-8 fully covered

---

### Error Handling Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-9.1 | AC-9 | Error summary (no selection) |
| T-9.2 | AC-9 | Error summary (Ground 1 missing type) |
| T-9.3 | AC-9 | Multiple errors displayed |
| T-9.4 | AC-9 | Error links functional |
| T-9.5 | AC-9 | Inline error on checkboxes |
| T-9.6 | AC-9 | Inline error on Ground 1 radio |
| T-9.7 | AC-9 | Values preserved on error |

**Coverage:** AC-9 fully covered

---

### Accessibility Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-10.1 | AC-10 | Error summary focus (tabindex) |
| T-10.2 | AC-10 | Error summary links to controls |
| T-10.3 | AC-10 | Keyboard accessible |
| T-10.4 | AC-10 | Labels properly associated |
| T-10.5 | AC-10 | Conditional radio announced |
| T-10.6 | AC-10 | ARIA on conditional reveal |
| T-10.7 | AC-10 | Screen reader support |

**Coverage:** AC-10 fully covered

---

### Edge Case Tests
| Test ID | AC | Description |
|---------|-----|-------------|
| T-E.1 | AC-3, AC-4 | Check/uncheck Ground 1 multiple times |
| T-E.2 | AC-2, AC-6 | All grounds + Ground 1 type |
| T-E.3 | AC-5, AC-6 | Change Ground 1 type on revisit |
| T-E.4 | AC-6 | Ground 2A camelCase storage |
| T-E.5 | AC-2 | Only mandatory ground (Ground 8) |
| T-E.6 | AC-9 | Preserve on validation error |
| T-E.7 | AC-4, AC-9 | Ground 1 error recovery |

**Coverage:** Cross-cutting validation

---

## Coverage Summary

| Category | Test Count | ACs Covered | Status |
|----------|-----------|-------------|---------|
| Display | 11 | AC-1 | ✅ Complete |
| Multiple selection | 4 | AC-2 | ✅ Complete |
| Conditional reveal | 6 | AC-3 | ✅ Complete |
| Ground 1 validation | 6 | AC-4 | ✅ Complete |
| Preservation | 4 | AC-5 | ✅ Complete |
| Session persistence | 10 | AC-6 | ✅ Complete |
| Routing | 3 | AC-7 | ✅ Complete |
| Navigation | 6 | AC-8 | ✅ Complete |
| Error handling | 7 | AC-9 | ✅ Complete |
| Accessibility | 7 | AC-10 | ✅ Complete |
| Edge cases | 7 | Multiple | ✅ Complete |
| **TOTAL** | **71** | **10/10** | ✅ **100%** |

---

## Uncovered Scenarios

❌ **None** — All acceptance criteria have comprehensive test coverage.

---

## Test Priorities

### P1 - Critical (Must Pass)
- All validation tests (T-2.1, T-4.1, T-4.2)
- Conditional reveal (T-3.x)
- Session persistence (T-6.x)
- Ground 1 type validation (T-4.x)

### P2 - High (Should Pass)
- Display tests (T-1.x)
- Error handling (T-9.x)
- Preservation (T-5.x)
- Accessibility (T-10.x)

### P3 - Medium (Important)
- Navigation (T-8.x)
- Routing (T-7.x)
- Edge cases (T-E.x)

---

## Questions & Assumptions

### Resolved via Clarifications
✅ **Q1 — Grounds list:** All 8 grounds from screen13.2.png  
✅ **Q2 — Ground 1 label:** "Rent arrears or breach of the tenancy"  
✅ **Q3 — Session values:** 'rentArrears' and 'breach'  
✅ **Q4 — Zero selections:** At least 1 required  
✅ **Q5 — Next route:** /claims/rent-arrears-breach-of-tenency  
✅ **Q6 — Placeholder:** Yes, create placeholder

### Testing Assumptions
- **A1:** Error messages match AC text exactly
- **A2:** Conditional reveal uses GOV.UK `govuk-radios__conditional` pattern
- **A3:** Ground 2A stored as `ground2A` (camelCase)
- **A4:** Session initialized via navigation helper chain
- **A5:** Placeholder route returns 200 status with basic HTML

---

## Implementation Notes for Developer

### Session Structure
```javascript
session.claim.grounds.secureFlexible = {
  ground1: true,
  ground1Type: 'rentArrears',  // or 'breach' or null
  ground2: false,
  ground2A: false,
  ground3: false,
  ground4: false,
  ground5: false,
  ground6: false,
  ground7: false,
  ground8: true
}
```

### Validation Rules
```javascript
// At least one ground required
if (!hasAnyGroundSelected()) {
  errors.grounds = 'Select at least one ground for possession';
}

// Ground 1 type required when Ground 1 selected
if (ground1 && !ground1Type) {
  errors.ground1Type = 'Select whether ground 1 is rent arrears or breach of tenancy';
}
```

### Conditional Reveal Pattern
```javascript
// Use GOV.UK conditional pattern
{
  value: "ground1",
  text: "Rent arrears or breach of the tenancy",
  conditional: {
    html: radiosHtml  // Render radios for ground1Type
  }
}
```

### Routing Logic
```javascript
// After successful validation
res.redirect('/claims/rent-arrears-breach-of-tenency');
```

---

**Status:** ✅ Traceability complete  
**Coverage:** 71 tests covering 10 acceptance criteria  
**Next:** Create executable test file
