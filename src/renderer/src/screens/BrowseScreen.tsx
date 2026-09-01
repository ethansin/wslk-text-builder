import { useEffect, useMemo, useState } from 'react'
import type { TemplateSummary, LoadWarning } from '@shared/types'
import { SearchInput } from '../components/SearchInput'
import { TagFilterBar } from '../components/TagFilterBar'
import { TemplateCard } from '../components/TemplateCard'
import { filterTemplates } from '../lib/filterTemplates'

interface Props {
  onSelectTemplate: (id: string) => void
}

type SyncStatus = { state: 'idle' } | { state: 'syncing' } | { state: 'done'; message: string; ok: boolean }

export function BrowseScreen({ onSelectTemplate }: Props): JSX.Element {
  const [templates, setTemplates] = useState<TemplateSummary[]>([])
  const [warnings, setWarnings] = useState<LoadWarning[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [sync, setSync] = useState<SyncStatus>({ state: 'idle' })

  const refresh = async (): Promise<void> => {
    const [{ templates: list, warnings: warns }, tagList] = await Promise.all([
      window.api.listTemplates(),
      window.api.getTags()
    ])
    setTemplates(list)
    setWarnings(warns)
    setTags(tagList)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    const unsubscribe = window.api.onTemplatesChanged(() => {
      refresh()
    })
    return unsubscribe
  }, [])

  const filtered = useMemo(
    () => filterTemplates(templates, query, selectedTags),
    [templates, query, selectedTags]
  )

  const toggleTag = (tag: string): void => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const handleSync = async (): Promise<void> => {
    setSync({ state: 'syncing' })
    const result = await window.api.syncTemplates()
    setSync({ state: 'done', message: result.message, ok: result.status === 'updated' })
    setTimeout(() => setSync({ state: 'idle' }), 3000)
  }

  return (
    <div className="screen browse-screen">
      <div className="browse-header">
        <h1>TextBuilder</h1>
        <div className="browse-header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleSync}
            disabled={sync.state === 'syncing'}
          >
            {sync.state === 'syncing' ? 'Syncing…' : 'Sync Templates'}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => window.api.openTemplatesFolder()}
          >
            Open Templates Folder
          </button>
        </div>
      </div>

      {sync.state === 'done' && (
        <div className={sync.ok ? 'sync-banner sync-banner-ok' : 'sync-banner sync-banner-error'}>
          {sync.ok ? 'Templates are up to date.' : `Sync failed: ${sync.message}`}
        </div>
      )}

      <SearchInput value={query} onChange={setQuery} />
      <TagFilterBar tags={tags} selected={selectedTags} onToggle={toggleTag} />

      {warnings.length > 0 && (
        <div className="warning-banner">
          {warnings.length} template file{warnings.length > 1 ? 's' : ''} couldn't be loaded:{' '}
          {warnings.map((w) => w.file).join(', ')}
        </div>
      )}

      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">
          {templates.length === 0
            ? 'No templates yet. Click Sync Templates, or add a .md template file to your templates folder to get started.'
            : 'No templates match your search or filters.'}
        </p>
      ) : (
        <div className="template-list">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} onClick={() => onSelectTemplate(t.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
