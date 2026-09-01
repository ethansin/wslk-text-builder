---
name: HST Intake Instructions
language: en
tags:
  - intake notes
  - HST
elements:
  - name: patientName
    prompt: What is the patient's name?
    type: plaintext
  - name: pickupDate
    prompt: What is the device pickup date?
    type: date
  - name: pickupDay
    prompt: What day of the week is the pickup?
    type: day
---
Hi {{patientName}}, thanks for scheduling your Home Sleep Test (HST).

Please pick up your device on {{pickupDay}}, {{pickupDate}} at our front desk. Bring a photo ID and your insurance card.

A few reminders before your study night:
- Avoid caffeine and alcohol after 2:00 PM.
- Don't nap the day of the test — it can affect your results.
- If a sensor comes loose overnight, that's okay — just do your best to reattach it and go back to sleep.

Questions? Just reply to this message and we'll get back to you as soon as we can. We're looking forward to helping you get some answers about your sleep!
