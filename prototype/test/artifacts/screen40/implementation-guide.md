# Screen 40: Claimant Ineligible (Welsh) - Implementation Guide

## Overview
This document provides guidance for Claude (Developer) to implement Screen 40 based on the test specifications. This is an informational page with no form inputs, reached when the property is in Wales and the claimant type is ineligible.

## Route Configuration
- GET `/claims/claimant-ineligible-welsh` (no POST required unless for analytics)
- Requires session.claimDraft.isWales = true and ineligible claimant type
- Renders Nunjucks template with ineligibility message and guidance

## Template Structure
- File: `src/views/pages/claims/claimant-ineligible-welsh.njk`
- Prominent h1 ineligibility message
- Guidance text and links as per Figma (welsh-screen1.png)
- Navigation link/button to `/case-list` (and exit if present)
- No form or claim progression controls

## Session Data Structure
- Reads: `session.claimDraft.isWales`, `session.claimDraft.claimantType`
- Writes: None

## Test Data Requirements
- Navigation helper should:
  1. Create authenticated session
  2. Set `claimDraft.isWales = true` and ineligible `claimantType`
  3. Navigate to `/claims/claimant-ineligible-welsh`

## Key Implementation Notes
- GET-only route; no POST handler required
- No form elements or claim progression
- All navigation returns to `/case-list` or exits
- Content and structure must match Figma
- Accessibility: h1 for message, keyboard/screen reader accessible
- No session data is modified

## Elements NOT Present
- No continue/submit/claim progression
- No editing claim data
- No error summary or validation
- No Wales-specific claim submission
