interface Props {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: Props): JSX.Element {
  return (
    <input
      type="text"
      className="search-input"
      placeholder="Search templates…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
