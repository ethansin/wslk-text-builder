import { readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, basename, extname } from 'path'
import matter from 'gray-matter'
import { TemplateFrontmatterSchema } from '@shared/schemas'
import type { Template, TemplateSummary, LoadWarning, TemplatesListResult } from '@shared/types'
import { getTemplatesDir } from './paths'

/** Parses one template .md file: YAML frontmatter validated against the schema, body is the raw markdown below it (trimmed of the blank line the frontmatter delimiter leaves behind, otherwise untouched — no escaping). */
function parseTemplateFile(id: string, raw: string): Template {
  const { data, content } = matter(raw)
  const frontmatter = TemplateFrontmatterSchema.parse(data)
  return { id, ...frontmatter, body: content.trim() }
}

/**
 * Reads and validates every .md file in the templates folder. A malformed file is
 * skipped (with a warning) rather than crashing the whole list, so one bad hand-edit
 * doesn't take down the app.
 */
async function loadAllTemplates(): Promise<{ templates: Template[]; warnings: LoadWarning[] }> {
  const dir = getTemplatesDir()
  const templates: Template[] = []
  const warnings: LoadWarning[] = []

  if (!existsSync(dir)) {
    return { templates, warnings }
  }

  const entries = await readdir(dir)
  const mdFiles = entries.filter((f) => extname(f).toLowerCase() === '.md')

  for (const file of mdFiles) {
    const filePath = join(dir, file)
    try {
      const raw = await readFile(filePath, 'utf-8')
      const id = basename(file, '.md')
      templates.push(parseTemplateFile(id, raw))
    } catch (err) {
      warnings.push({ file, message: err instanceof Error ? err.message : String(err) })
    }
  }

  templates.sort((a, b) => a.name.localeCompare(b.name))
  return { templates, warnings }
}

export async function listTemplateSummaries(): Promise<TemplatesListResult> {
  const { templates, warnings } = await loadAllTemplates()
  const summaries: TemplateSummary[] = templates.map(({ id, name, language, tags }) => ({
    id,
    name,
    language,
    tags
  }))
  return { templates: summaries, warnings }
}

export async function getTemplateById(id: string): Promise<Template> {
  const dir = getTemplatesDir()
  const filePath = join(dir, `${id}.md`)
  const raw = await readFile(filePath, 'utf-8')
  return parseTemplateFile(id, raw)
}
