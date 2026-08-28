import { useState } from 'react'
import type { Template } from '@shared/types'
import { PlainTextField } from '../components/fields/PlainTextField'
import { DateField } from '../components/fields/DateField'
import { TimeField } from '../components/fields/TimeField'
import { DayField } from '../components/fields/DayField'

interface Props {
  template: Template
  onGenerate: (answers: Record<string, string>) => void
  onBack: () => void
}

export function FillFormScreen({ template, onGenerate, onBack }: Props): JSX.Element {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const setAnswer = (name: string, value: string): void => {
    setAnswers((prev) => ({ ...prev, [name]: value }))
  }

  const allFilled = template.elements.every((el) => (answers[el.name] ?? '').trim() !== '')

  return (
    <div className="screen fill-form-screen">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back
      </button>
      <h2>{template.name}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onGenerate(answers)
        }}
      >
        {template.elements.map((el) => (
          <div key={el.name} className="form-field">
            <label className="field-label">{el.prompt}</label>
            {el.type === 'plaintext' && (
              <PlainTextField value={answers[el.name] ?? ''} onChange={(v) => setAnswer(el.name, v)} />
            )}
            {el.type === 'date' && (
              <DateField value={answers[el.name] ?? ''} onChange={(v) => setAnswer(el.name, v)} />
            )}
            {el.type === 'time' && (
              <TimeField value={answers[el.name] ?? ''} onChange={(v) => setAnswer(el.name, v)} />
            )}
            {el.type === 'day' && (
              <DayField value={answers[el.name] ?? ''} onChange={(v) => setAnswer(el.name, v)} />
            )}
          </div>
        ))}

        <button type="submit" className="primary-button" disabled={!allFilled}>
          Generate
        </button>
      </form>
    </div>
  )
}
