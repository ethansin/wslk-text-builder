import { app } from 'electron'
import { join } from 'path'

/**
 * Templates/tags/day-translations are authored in the repo (templates/, tags.json,
 * day-translations.json at the root) and pushed to GitHub; this folder is just the
 * app's local synced copy, downloaded fresh on every launch — not meant to be
 * browsed or hand-edited, so it lives in Electron's internal per-app data directory
 * rather than somewhere user-visible like Documents. Overridable via TEXTBUILDER_HOME
 * for repeatable manual testing.
 */
export function getBaseDir(): string {
  if (process.env.TEXTBUILDER_HOME) {
    return process.env.TEXTBUILDER_HOME
  }
  return app.getPath('userData')
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
