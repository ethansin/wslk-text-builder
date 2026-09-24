---
name: In-Lab NPSG Appointment Screening Note
language: en
tags:
  - intake notes
  - In-Lab
elements:
  - name: patientFirstName
    prompt: Patient First Name
    type: plaintext
  - name: patientLastName
    prompt: Patient Last Name
    type: plaintext
  - name: apptDay
    prompt: What day of the week is the appointment?
    type: day
  - name: apptDate
    prompt: What is the appointment date?
    type: date
  - name: apptTime
    prompt: What time is the appointment?
    type: time
  - name: SMS
    prompt: What phone number were the appointment details texted to?
    type: plaintext
  - name: sex
    prompt: Male or Female?
    type: plaintext
  - name: language
    prompt: Patient's language?
    type: plaintext
  - name: parkingPermit
    prompt: Describe Patient's method of transportation to the appointment, and whether or not they need a parking permit.
    type: plaintext
  - name: caregiver
    prompt: Describe whether or not the patient will have someone with them
    type: plaintext
  - name: o2Support
    prompt: Does the patient need to be on oxygen?
    type: plaintext
  - name: wheelchair
    prompt: Does the patient use a wheelchair?
    type: plaintext
  - name: walker
    prompt: Does the patient use a walker?
    type: plaintext
  - name: cane
    prompt: Does the patient use a cane?
    type: plaintext
  - name: bed
    prompt: Does the patient need help getting on/off the bed?
    type: plaintext
  - name: referral
    prompt: Where did the patient get referred from? Either write ZSFG or the referring MD's name.
    type: plaintext
---
In Lab PSG Study (SPLIT-NIGHT IF POSSIBLE) for {{patientLastName}}, {{patientFirstName}}.
{{apptDay}} {{apptDate}} @ {{apptTime}}

Appointment details were texted to {{SMS}}

Gender: {{sex}}
Language: {{language}}
Transportation: {{parkingPermit}}
Accompaniment: {{caregiver}}

O2 Support: {{o2Support}}
Wheelchair: {{wheelchair}}
Walker: {{walker}}
Cane: {{cane}}
Assistance getting on/off the bed: {{bed}}

{{referral}}