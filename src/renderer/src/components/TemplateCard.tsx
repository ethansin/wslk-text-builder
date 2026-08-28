import { LANGUAGE_LABELS, type TemplateSummary } from '@shared/types'

interface Props {
  template: TemplateSummary
  onClick: () => void
}

export function TemplateCard({ template, onClick }: Props): JSX.Element {
  return (
    <button type="button" className="template-card" onClick={onClick}>
      <div className="template-card-header">
        <span className="template-card-name">{template.name}</span>
        <span className="template-card-lang">{LANGUAGE_LABELS[template.language]}</span>
      </div>
      {template.tags.length > 0 && (
        <div className="template-card-tags">
          {template.tags.map((tag) => (
            <span key={tag} className="template-card-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
