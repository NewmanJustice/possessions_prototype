# Understanding — Screen 34: Applications

## Summary

Screen 34 asks the solicitor whether they plan to make an application at the same time as their claim. This is a simple Yes/No question with informational content about what applications are and when to make them.

## Entry Conditions

Screen 34 is reached when:
- User selected "No" on Screen 32 (no forfeiture relief needed), OR
- User completed Screen 33 (uploaded documents)

## Key Behaviors

1. Display page heading: "Applications"
2. Display explanatory content about applications
3. Display question: "Are you planning to make an application at the same time as your claim?"
4. Two radio options: Yes, No
5. Required validation
6. Dynamic Previous navigation based on whether documents were uploaded

## Session Shape

```javascript
session.claim.applications = {
  planningApplication: 'yes' | 'no' | null
}
```

## Navigation

- Previous → Dynamic:
  - If uploadedDocuments exists and length > 0 → Screen 33
  - Otherwise → Screen 32
- Continue → Screen 35 (`/claims/language-used`)
- Cancel → `/case-list`
