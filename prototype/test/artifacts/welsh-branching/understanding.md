# Understanding: Welsh Branching (Border Postcode)

## Q1: What is the purpose of this screen?
To capture whether the property is in Wales or England, storing a boolean in session for downstream branching.

## Q2: What are the entry and exit routes?
Entry: /claims/border-postcode (GET)
Exit: Next journey screen (branching by isWales), Previous: /claims/start, Cancel: /case-list

## Q3: What data is captured?
A boolean (isWales) indicating if the property is in Wales.

## Q4: What are the validation rules?
Selection is required. Error summary and field errors must be shown if not selected.

## Q5: What are the accessibility requirements?
GOV.UK error summary, labelled fields, keyboard accessible, focus management.

## Q6: What is out of scope?
Postcode format validation, address lookup, downstream Wales forms.

---

See user story for full ACs and session shape.