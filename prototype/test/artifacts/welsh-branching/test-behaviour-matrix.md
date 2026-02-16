# Test Behaviour Matrix: Welsh Branching (Border Postcode)

| Scenario | Input | Action | Expected Outcome |
|----------|-------|--------|------------------|
| 1 | Wales | Continue | isWales=true in session, next screen |
| 2 | England | Continue | isWales=false in session, next screen |
| 3 | None | Continue | Error summary, focus on error |
| 4 | Wales | Previous | Returns to /claims/start, data preserved |
| 5 | England | Previous | Returns to /claims/start, data preserved |
| 6 | Wales | Cancel | Returns to /case-list, draft preserved |
| 7 | England | Cancel | Returns to /case-list, draft preserved |
