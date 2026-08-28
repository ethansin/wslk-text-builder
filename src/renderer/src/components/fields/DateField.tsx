import { useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

const DATE_RE = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/

/** Auto-inserts slashes as digits are typed, e.g. "0315" -> "03/15" -> "03/15/2026". */
function maskDate(input: string, previous: string): string {
  const digitsOnly = input.replace(/[^\d/]/g, '')
  // If the user deleted a character, don't fight them by re-inserting the slash.
  if (digitsOnly.length < previous.length) return digitsOnly

  const rawDigits = digitsOnly.replace(/\//g, '').slice(0, 8)
  let out = rawDigits.slice(0, 2)
  if (rawDigits.length > 2) out += '/' + rawDigits.slice(2, 4)
  if (rawDigits.length > 4) out += '/' + rawDigits.slice(4, 8)
  return out
}

export function DateField({ value, onChange }: Props): JSX.Element {
  const [touched, setTouched] = useState(false)
  const isValid = value === '' || DATE_RE.test(value)

  return (
    <div>
      <input
        type="text"
        className="field-input"
        placeholder="MM/DD/YYYY"
        value={value}
        onChange={(e) => onChange(maskDate(e.target.value, value))}
        onBlur={() => setTouched(true)}
      />
      {touched && !isValid && (
        <p className="field-error">Enter a date as MM/DD/YYYY</p>
      )}
    </div>
  )
}
