import { app } from 'electron'
import { join } from 'path'

/**
 * Base folder for user data lives under Documents so the user can find and hand-edit
 * template/tag files directly. Overridable via TEXTBUILDER_HOME for repeatable manual
 * testing without touching the real Documents folder.
 */
export function getBaseDir(): string {
  if (process.env.TEXTBUILDER_HOME) {
    return process.env.TEXTBUILDER_HOME
  }
  return join(app.getPath('documents'), 'TextBuilder')
}

export function getTemplatesDir(): string {
  return join(getBaseDir(), 'templates')
}

export function getTagsFilePath(): string {
  return join(getBaseDir(), 'tags.json')
}

export function getDayTranslationsFilePath(): string {
  return join(getBaseDir(), 'day-translations.json')
}

/** Resolves the bundled seed data directory, both in dev and in a packaged build. */
export function getSeedDir(): string {
  if (app.isPackaged) {
    return join(process.resourcesPath, 'seed')
  }
  return join(__dirname, '../../resources/seed')
}
