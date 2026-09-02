---
name: HST Appointment Confirmation
language: en
tags:
  - appointment confirmation
elements:
  - name: expDate
    prompt: When did the patient's insurance expire?
    type: date
  - name: contact
    prompt: Who can be contacted for updated insurance info?
    type: plaintext
---
New HST order received

Insurance expired as of {{expDate}}, contact Patient or {{contact}} for updated insurance information.