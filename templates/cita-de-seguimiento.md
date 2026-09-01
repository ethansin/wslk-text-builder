---
name: Cita de Seguimiento
language: es
tags:
  - appointment reminder
  - appointment confirmation
elements:
  - name: patientName
    prompt: What is the patient's name?
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
---
Hola {{patientName}}, le recordamos que su cita de seguimiento está programada para el {{apptDay}}, {{apptDate}} a las {{apptTime}}.
