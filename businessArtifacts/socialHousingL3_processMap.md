# Social Housing L3 Process Map

Civil Possession – Make a Claim (Social Housing Providers)

```mermaid
flowchart LR
  %% Civil Possession – Make a Claim (Social Housing Providers) – High-level service map
  %% Source: Civil Possession - base board for exporting as PDF
  %% Notes:
  %% - This is a high-level structural map + agreed branching rules.
  %% - Micro-steps not yet legible or not yet built are represented as stubs/placeholders.

  subgraph A[Access & Entry]
    A1[Access code gate] --> A2["Login / Register - HMCTS IDAM-like"]
    A2 --> A3[Service landing: Possessions]
    A3 --> A4[Case list]
    A4 --> A5[Create / open draft case]
  end

  subgraph B[Start claim & eligibility]
    B1[Start claim] --> B2[Eligibility notice]
    B2 --> B3{Border postcode?<br/>England/Wales}
    B3 -->|England| B4[England route continues]
    B3 -->|Wales| B5["Wales route - stub"]
    B4 --> B6[Claimant type]
    B6 --> B7[Claim type]
  end

  subgraph C[Claimant & contact]
    C1[Name of claimant] --> C2[Claimant details]
    C2 --> C3[Contact preferences]
  end

  subgraph D[Defendant]
    D1[Defendant details] --> D2{Add another defendant?}
    D2 -->|No| D3[Continue]
    D2 -->|Yes| D4["Additional defendants<br/>NOT SUPPORTED - placeholder"]
  end

  subgraph E[Tenancy / Licence]
    E1["Tenancy or licence details - Screen 12"]
    E1 --> E2{groundsModel derived<br/>from tenancy type}
    E2 -->|ASSURED| E3[groundsModel = ASSURED]
    E2 -->|SECURE & FLEXIBLE | E4[groundsModel = SECURE_LIKE]
    E2 -->|INTRO/DEMOTED/OTHER| E5["Tenancy type not supported<br/>- placeholder"]
  end

  subgraph F[Grounds – entry question]
    F1["Grounds for possession - Screen 13<br/>Rent arrears?"]
    F1 --> F2{Rent arrears?}
  end

  %% Routing from tenancy model + arrears question
  E3 --> F1
  E4 --> F1
  E5 --> Z1[Exit / stop path]

  F2 -->|Yes & ASSURED| G1["/claims/assured-tenancy-grounds-selection<br/>Screen 13.1.1"]
  F2 -->|No & ASSURED| H1[/claims/secure-tenancy-grounds/]
  F2 -->|Yes & SECURE_LIKE| H1
  F2 -->|No & SECURE_LIKE| H1

  subgraph G[Assured tenancy – rent arrears grounds]
    G1 --> G2["Select rent-arrears grounds<br/>8/10/11 all optional"]
    G2 --> G3{Any other grounds?}
    G3 -->|Yes| G4["/claims/other-tenancy-grounds<br/>Screen 13.3"]
    G3 -->|No| G5[/claims/reasons-for-possessions/]
  end

  subgraph I[Other grounds – decision & selection]
    G4 --> I1{Do you have grounds<br/>for possession?}
    I1 -->|Yes| I2["/claims/other-tenancy-grounds-selection<br/>checkbox list"]
    I1 -->|No| G5
  end

  subgraph H["Secure-like grounds - stub"]
    H1 --> H2["Secure-like grounds screens<br/>stub / to be defined"]
    H2 --> H3["Next steps - stub"]
  end

  subgraph J["Reasons / supporting details - stub"]
    G5 --> J1["Reasons for possession<br/>stub / to be defined"]
    J1 --> J2["Supporting details / evidence<br/>stub"]
  end

  subgraph K["Submission - stub"]
    J2 --> K1["Check answers - stub"]
    K1 --> K2["Submit claim - stub"]
    K2 --> K3["Confirmation + reference<br/>stub"]
  end

  %% Connect major phases
  A5 --> B1
  B7 --> C1
  C3 --> D1
  D3 --> E1
  J2 --> K1

  %% End
  K3 --> Z1[End of make-a-claim journey]
```
