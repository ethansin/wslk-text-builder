import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { TagsFileSchema } from '@shared/schemas'
import { getTagsFilePath } from './paths'
import { ensureTagsSeeded } from './firstRun'

/** Reads tags.json, regenerating it from the bundled seed if it was deleted. */
export async function getTags(): Promise<string[]> {
  const path = getTagsFilePath()
  if (!existsSync(path)) {
    await ensureTagsSeeded()
  }
  if (!existsSync(path)) return []

  try {
    const raw = await readFile(path, 'utf-8')
    const parsed = TagsFileSchema.parse(JSON.parse(raw))
    return parsed.tags
  } catch (err) {
    console.warn('Failed to read tags.json:', err)
    return []
  }
}
