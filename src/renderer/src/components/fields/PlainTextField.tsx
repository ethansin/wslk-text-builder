interface Props {
  value: string
  onChange: (value: string) => void
}

export function PlainTextField({ value, onChange }: Props): JSX.Element {
  return (
    <input
      type="text"
      className="field-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
