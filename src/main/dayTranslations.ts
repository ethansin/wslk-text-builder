import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { DayTranslationsSchema } from '@shared/schemas'
import type { DayTranslations } from '@shared/types'
import { getDayTranslationsFilePath } from './paths'

export async function getDayTranslations(): Promise<DayTranslations> {
  const path = getDayTranslationsFilePath()
  if (!existsSync(path)) return {} as DayTranslations

  try {
    const raw = await readFile(path, 'utf-8')
    return DayTranslationsSchema.parse(JSON.parse(raw)) as DayTranslations
  } catch (err) {
    console.warn('Failed to read day-translations.json:', err)
    return {} as DayTranslations
  }
}
