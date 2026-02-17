# Screen 40: Claimant Ineligible (Welsh) - Test Behaviour Matrix

## AC-1: Ineligibility message is displayed
| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-1.1   | Ineligibility message is present and prominent | Happy path |
| T-1.2   | Message uses h1 heading | Accessibility |

## AC-2: Content matches design
| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-2.1   | Page content matches Figma (headings, text, links) | Happy path |
| T-2.2   | All required links and contact details are present | Happy path |

## AC-3: No further claim progression
| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-3.1   | No continue/submit/claim progression options | Negative |
| T-3.2   | Only navigation is to case list or exit | Negative |

## AC-4: Return to case list navigation
| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-4.1   | Navigation link/button returns to /case-list | Happy path |
| T-4.2   | Session claimDraft remains unchanged | Happy path |

## AC-5: Accessibility compliance
| Test ID | Behaviour | Type |
|---------|-----------|------|
| T-5.1   | Ineligibility message is h1 | Accessibility |
| T-5.2   | All content is keyboard and screen reader accessible | Accessibility |
| T-5.3   | Page structure meets WCAG 2.1 AA | Accessibility |

---

## Traceability Table
| Acceptance Criterion | Test IDs | Notes |
|---------------------|----------|-------|
| AC-1 | T-1.1, T-1.2 | Ineligibility message |
| AC-2 | T-2.1, T-2.2 | Content matches design |
| AC-3 | T-3.1, T-3.2 | No claim progression |
| AC-4 | T-4.1, T-4.2 | Navigation to case list |
| AC-5 | T-5.1, T-5.2, T-5.3 | Accessibility |

**Total: 12 test cases covering 5 acceptance criteria**
