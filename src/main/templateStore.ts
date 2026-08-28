import { readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, basename, extname } from 'path'
import { TemplateFileSchema } from '@shared/schemas'
import type { Template, TemplateSummary, LoadWarning, TemplatesListResult } from '@shared/types'
import { getTemplatesDir } from './paths'

/**
 * Reads and validates every .json file in the templates folder. A malformed file is
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
  const jsonFiles = entries.filter((f) => extname(f).toLowerCase() === '.json')

  for (const file of jsonFiles) {
    const filePath = join(dir, file)
    try {
      const raw = await readFile(filePath, 'utf-8')
      const parsed = JSON.parse(raw)
      const result = TemplateFileSchema.safeParse(parsed)
      if (!result.success) {
        warnings.push({ file, message: result.error.issues.map((i) => i.message).join('; ') })
        continue
      }
      const id = basename(file, '.json')
      templates.push({ id, ...result.data })
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
  const filePath = join(dir, `${id}.json`)
  const raw = await readFile(filePath, 'utf-8')
  const parsed = JSON.parse(raw)
  const result = TemplateFileSchema.parse(parsed)
  return { id, ...result }
}
