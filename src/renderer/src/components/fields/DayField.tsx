import { DAY_KEYS, DAY_LABELS_EN } from '@shared/types'

interface Props {
  value: string
  onChange: (value: string) => void
}

/**
 * Always displays day names in English, per spec, regardless of the template's
 * language — the stored value is the canonical lowercase key (e.g. "monday"),
 * translated at generate-time in generateText.ts.
 */
export function DayField({ value, onChange }: Props): JSX.Element {
  return (
    <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        Select a day…
      </option>
      {DAY_KEYS.map((key) => (
        <option key={key} value={key}>
          {DAY_LABELS_EN[key]}
        </option>
      ))}
    </select>
  )
}
