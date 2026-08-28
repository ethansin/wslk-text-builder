interface Props {
  tags: string[]
  selected: Set<string>
  onToggle: (tag: string) => void
}

export function TagFilterBar({ tags, selected, onToggle }: Props): JSX.Element | null {
  if (tags.length === 0) return null

  return (
    <div className="tag-filter-bar">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className={selected.has(tag) ? 'tag-chip tag-chip-selected' : 'tag-chip'}
          onClick={() => onToggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
