import { useEffect, useState } from 'react'
import type { Template, DayTranslations } from '@shared/types'
import { generateText } from '../lib/generateText'
import { CopyButton } from '../components/CopyButton'

interface Props {
  template: Template
  answers: Record<string, string>
  onBack: () => void
  onStartOver: () => void
}

export function ResultScreen({ template, answers, onBack, onStartOver }: Props): JSX.Element {
  const [dayTranslations, setDayTranslations] = useState<DayTranslations | null>(null)

  useEffect(() => {
    window.api.getDayTranslations().then(setDayTranslations)
  }, [])

  if (!dayTranslations) {
    return (
      <div className="screen result-screen">
        <p className="empty-state">Loading…</p>
      </div>
    )
  }

  const text = generateText(template, answers, dayTranslations)

  return (
    <div className="screen result-screen">
      <button type="button" className="back-link" onClick={onBack}>
        ← Edit answers
      </button>
      <h2>{template.name}</h2>

      <textarea className="result-text" readOnly value={text} rows={12} />

      <div className="result-actions">
        <CopyButton text={text} />
        <button type="button" className="secondary-button" onClick={onStartOver}>
          Start Over
        </button>
      </div>
    </div>
  )
}
