import { useMemo, useState } from 'react'
import { HOUR_OPTIONS, PERIOD_OPTIONS, buildMinuteOptions, parseTime, formatTime } from '../../lib/timeOptions'

interface Props {
  value: string
  onChange: (value: string) => void
}

interface TimeParts {
  hour: string
  minute: string
  period: string
}

export function TimeField({ value, onChange }: Props): JSX.Element {
  const minuteOptions = useMemo(() => buildMinuteOptions(), [])
  // Tracked locally rather than re-derived from `value` each render: the combined
  // "H:MM AM/PM" string is only non-empty once all three parts are chosen, so deriving
  // display state from it would reset the first two dropdowns back to blank as soon as
  // they're picked (formatTime returns '' until the set is complete).
  const [parts, setParts] = useState<TimeParts>(() => parseTime(value))

  const update = (patch: Partial<TimeParts>): void => {
    const next = { ...parts, ...patch }
    setParts(next)
    onChange(formatTime(next.hour, next.minute, next.period))
  }

  return (
    <div className="time-field">
      <select
        className="time-field-select"
        value={parts.hour}
        onChange={(e) => update({ hour: e.target.value })}
      >
        <option value="" disabled>
          Hour
        </option>
        {HOUR_OPTIONS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      <select
        className="time-field-select"
        value={parts.minute}
        onChange={(e) => update({ minute: e.target.value })}
      >
        <option value="" disabled>
          Min
        </option>
        {minuteOptions.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        className="time-field-select"
        value={parts.period}
        onChange={(e) => update({ period: e.target.value })}
      >
        <option value="" disabled>
          AM/PM
        </option>
        {PERIOD_OPTIONS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  )
}
