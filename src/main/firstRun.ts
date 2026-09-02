import { existsSync } from 'fs'
import { mkdir, cp, readdir } from 'fs/promises'
import { join } from 'path'
import { getBaseDir, getTemplatesDir, getTagsFilePath, getDayTranslationsFilePath, getSeedDir } from './paths'

/**
 * Creates the app's local data folder (see paths.ts) and seeds templates/tags.json/
 * day-translations.json from the bundled offline fallback if missing. This only fires
 * when GitHub sync (templateSync.ts) hasn't populated the folder yet — e.g. first
 * launch with no network — so the app is never empty. Each piece is guarded
 * independently so deleting just one file (e.g. tags.json) regenerates only that file
 * on next launch, not the whole folder.
 */
export async function ensureUserData(): Promise<void> {
  const baseDir = getBaseDir()
  if (!existsSync(baseDir)) {
    await mkdir(baseDir, { recursive: true })
  }

  await ensureTemplatesSeeded()
  await ensureTagsSeeded()
  await ensureDayTranslationsSeeded()
}

async function ensureTemplatesSeeded(): Promise<void> {
  const templatesDir = getTemplatesDir()
  if (existsSync(templatesDir)) {
    const files = await readdir(templatesDir)
    if (files.some((f) => f.endsWith('.md'))) return
  } else {
    await mkdir(templatesDir, { recursive: true })
  }

  const seedTemplatesDir = join(getSeedDir(), 'templates')
  if (existsSync(seedTemplatesDir)) {
    await cp(seedTemplatesDir, templatesDir, { recursive: true })
  }
}

export async function ensureTagsSeeded(): Promise<void> {
  const tagsPath = getTagsFilePath()
  if (existsSync(tagsPath)) return
  const seedTagsPath = join(getSeedDir(), 'tags.json')
  if (existsSync(seedTagsPath)) {
    await cp(seedTagsPath, tagsPath)
  }
}

async function ensureDayTranslationsSeeded(): Promise<void> {
  const dayTranslationsPath = getDayTranslationsFilePath()
  if (existsSync(dayTranslationsPath)) return
  const seedPath = join(getSeedDir(), 'day-translations.json')
  if (existsSync(seedPath)) {
    await cp(seedPath, dayTranslationsPath)
  }
}
