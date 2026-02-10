# Screen 22 — Details of Rent Arrears

## Understanding

### Summary
This screen collects comprehensive rent arrears information from the solicitor, including an optional rent statement upload, the total arrears amount, and details about any third-party payments (e.g., Universal Credit, Housing Benefit). The screen uses conditional reveals to show payment source checkboxes when third-party payments exist, and a further text input when "Other" is selected.

### Primary Behaviour (Happy Path)
1. User arrives from `/claims/daily-rent-amount` (Screen 21)
2. Page displays rent statement guidance and optional upload section
3. User optionally uploads rent statement document (stores metadata only)
4. User enters total rent arrears amount (£ format, validated)
5. User answers "Have any rent payments been paid by someone other than the defendants?"
6. If "Yes": User selects payment sources from checkboxes (with "Other" conditional reveal)
7. User clicks Continue
8. Data stored in `session.claim.rentArrears`
9. User redirected to `/claims/money-judgement` (Screen 23)

### Input Variations
- **File upload:** None (optional), one document
- **Total arrears:** Any amount from £0.01 to £1,000,000 (2 decimals max)
- **Third-party payments:** Yes (with sources) or No
- **Payment sources:** Single source, multiple sources, or all 5 sources
- **Other payment source:** Conditional text input when "Other" selected
- **Revisit scenario:** Pre-population of all fields

### Constraints

#### Business Rules
- **Upload optional:** User may proceed without uploading rent statement
- **Total arrears required:** Must be a number greater than 0
- **Third-party selection required:** Must select Yes or No
- **Payment sources conditional:** Only required if third-party payments = Yes
- **At least one source:** If Yes selected, at least one payment source must be chosen
- **Other details conditional:** Only required if "Other" payment source selected
- **No calculations:** Screen does not calculate or validate arrears math
- **Declarative only:** Records user-provided information without verification

#### Validation Rules

**Total Arrears:**
- Required: Yes
- Format: Currency (£)
- Minimum: £0.01
- Maximum: £1,000,000
- Decimals: Max 2 decimal places
- Error message: "Enter the total rent arrears as a number greater than 0"

**Third-Party Payments:**
- Required: Yes (must select Yes or No)
- Error message: "Select whether any rent payments were made by someone other than the defendants"

**Payment Sources (when Yes selected):**
- Required: Yes (at least one checkbox)
- Options: Universal Credit, Housing Benefit, Discretionary Housing Payment, Homeless prevention fund, Other
- Error message: "Select at least one payment source"

**Other Payment Source Details (when Other selected):**
- Required: Yes (when Other checkbox selected)
- Error message: "Enter the payment source"

#### Session Structure
```javascript
session.claim.rentArrears = {
  // Document upload (metadata only)
  documents: [
    {
      id: string,           // Document identifier
      name: string,         // Original filename
      uploadedAt: timestamp // Upload timestamp
    }
  ],
  
  // Total arrears
  totalArrears: number,     // e.g., 1250.50 (stored as number, no £ symbol)
  
  // Third-party payments
  thirdPartyPayments: true | false,
  
  // Payment sources (only populated if thirdPartyPayments === true)
  paymentSources: {
    universalCredit: true | false,
    housingBenefit: true | false,
    discretionaryHousingPayment: true | false,
    homelessPreventionFund: true | false,
    other: true | false,
    otherDetails: string | null  // Only populated if other === true
  }
}
```

**Key naming convention:**
- Payment source keys use camelCase
- Deselected sources set to `false` (not undefined or null)
- `otherDetails` set to `null` when Other not selected

#### Navigation Rules
- **Previous:** `/claims/daily-rent-amount` (Screen 21)
- **Continue:** `/claims/money-judgement` (Screen 23)
- **Cancel:** `/case-list`

### Initial Assumptions

1. **File upload scope:** Testing metadata storage only, not actual file upload mechanism
2. **Upload component:** "Add new" button present but implementation deferred
3. **Currency validation:** Same rules as Screen 20 (£0.01 to £1,000,000, max 2 decimals)
4. **Currency storage:** Stored as number without £ symbol (e.g., 1250.50 not "£1,250.50")
5. **Documents array:** May be empty `[]` if no upload, or contain metadata objects
6. **Payment sources initialization:** All set to `false` when not selected
7. **Other details handling:** Set to `null` when Other not selected, string when provided
8. **Guidance text:** From design file screen22.png
9. **Error focus:** Focus moves to error summary on validation failure
10. **Pre-population:** All fields including radio, checkboxes, and text inputs pre-populate on revisit

### Ambiguities Identified

✅ **Q1 - Design reference:** RESOLVED  
   - Using screen22.png for exact labels and guidance text

✅ **Q2 - File upload testing:** RESOLVED  
   - Skip actual upload testing
   - Test metadata storage only

✅ **Q3 - Total arrears validation:** RESOLVED  
   - Same as Screen 20: £0.01 to £1,000,000, max 2 decimals

✅ **Q4 - Payment sources keys:** RESOLVED  
   - Use camelCase: universalCredit, housingBenefit, etc.

✅ **Q5 - Deselected sources:** RESOLVED  
   - Set to `false` when not selected (like Screen 14)

✅ **Q6 - Next screen placeholder:** RESOLVED  
   - Create placeholder for Screen 23: `/claims/money-judgement`

### Out of Scope
- Actual file upload mechanism (multipart form handling)
- File storage and retrieval
- File type and size validation
- Rent arrears calculation or verification
- Reconciliation of third-party payments against total
- Validation of rent statement content
- Integration with external payment systems

### Relationship to Other Screens
- **Screen 21** (Daily rent amount): Previous screen, establishes daily rent context
- **Screen 23** (Money judgement): Next screen, receives rent arrears data
- **Case list:** Cancel destination

---

*This understanding document was created by Nigel (Tester Agent) on 2026-01-27 based on user story screen22.txt and design file screen22.png, with clarifications from Steve.*
