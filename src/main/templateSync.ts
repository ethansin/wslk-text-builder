import { createWriteStream, existsSync } from 'fs'
import { mkdir, readdir, rm, cp } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { randomUUID } from 'crypto'
import https from 'https'
import * as tar from 'tar'
import type { SyncResult } from '@shared/types'
import { getBaseDir, getTemplatesDir, getTagsFilePath, getDayTranslationsFilePath } from './paths'

const GITHUB_OWNER = 'ethansin'
const GITHUB_REPO = 'wslk-text-builder'
const GITHUB_BRANCH = 'main'
const TARBALL_URL = `https://codeload.github.com/${GITHUB_OWNER}/${GITHUB_REPO}/tar.gz/refs/heads/${GITHUB_BRANCH}`
const DOWNLOAD_TIMEOUT_MS = 15_000

function downloadTarball(destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(destPath)
    const request = https.get(TARBALL_URL, { headers: { 'User-Agent': 'wslk-text-builder' } }, (res) => {
      if (res.statusCode !== 200) {
        file.close()
        reject(new Error(`GitHub returned HTTP ${res.statusCode}`))
        return
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve()))
      file.on('error', reject)
    })
    request.setTimeout(DOWNLOAD_TIMEOUT_MS, () => request.destroy(new Error('Download timed out')))
    request.on('error', reject)
  })
}

/**
 * Pulls the latest templates/, tags.json, and day-translations.json straight from the
 * public GitHub repo — no git required on the machine, no auth (repo is public), just a
 * plain HTTPS download of the repo tarball. This is the "push-button update" path for
 * coworkers who don't use git: click Sync, get whatever was last pushed to main.
 */
export async function syncTemplatesFromGitHub(): Promise<SyncResult> {
  const workDir = join(tmpdir(), `textbuilder-sync-${randomUUID()}`)
  const tarballPath = join(workDir, 'repo.tar.gz')

  try {
    await mkdir(workDir, { recursive: true })
    await downloadTarball(tarballPath)
    await tar.extract({ file: tarballPath, cwd: workDir })

    const entries = await readdir(workDir)
    const repoDirName = entries.find((e) => e.endsWith('.tar.gz') === false)
    if (!repoDirName) throw new Error('Downloaded archive was empty')
    const repoDir = join(workDir, repoDirName)

    const srcTemplatesDir = join(repoDir, 'templates')
    const srcTags = join(repoDir, 'tags.json')
    const srcDayTranslations = join(repoDir, 'day-translations.json')

    if (!existsSync(srcTemplatesDir) || !existsSync(srcTags) || !existsSync(srcDayTranslations)) {
      throw new Error('Downloaded repo is missing templates/, tags.json, or day-translations.json')
    }

    await mkdir(getBaseDir(), { recursive: true })

    // Replace the templates folder wholesale (not merge) so templates removed upstream
    // are removed locally too, not left behind as stale files.
    await rm(getTemplatesDir(), { recursive: true, force: true })
    await cp(srcTemplatesDir, getTemplatesDir(), { recursive: true })
    await cp(srcTags, getTagsFilePath())
    await cp(srcDayTranslations, getDayTranslationsFilePath())

    return { status: 'updated', message: 'Templates synced from GitHub.' }
  } catch (err) {
    return { status: 'error', message: err instanceof Error ? err.message : String(err) }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {})
  }
}
