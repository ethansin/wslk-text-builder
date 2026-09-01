// Regenerates resources/seed/ (bundled into the packaged app as an offline first-run
// fallback) from the repo's tracked source-of-truth files: templates/, tags.json, and
// day-translations.json. resources/seed/ itself is gitignored/generated — never edit it
// directly, edit the root-level files instead and rerun this (or just `npm run dev`/`build`,
// which do it automatically via predev/prebuild).
import { mkdirSync, readdirSync, copyFileSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const seedDir = join(rootDir, 'resources', 'seed')
const seedTemplatesDir = join(seedDir, 'templates')

rmSync(seedDir, { recursive: true, force: true })
mkdirSync(seedTemplatesDir, { recursive: true })

const templatesSrc = join(rootDir, 'templates')
const mdFiles = readdirSync(templatesSrc).filter((f) => f.endsWith('.md'))
for (const file of mdFiles) {
  copyFileSync(join(templatesSrc, file), join(seedTemplatesDir, file))
}

copyFileSync(join(rootDir, 'tags.json'), join(seedDir, 'tags.json'))
copyFileSync(join(rootDir, 'day-translations.json'), join(seedDir, 'day-translations.json'))

console.log(`Seed data prepared: ${mdFiles.length} template(s) + tags.json + day-translations.json`)
