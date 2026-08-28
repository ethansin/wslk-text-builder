import chokidar, { type FSWatcher } from 'chokidar'
import type { BrowserWindow } from 'electron'
import { IPC } from '@shared/ipcChannels'
import { getTemplatesDir, getTagsFilePath, getDayTranslationsFilePath } from './paths'

let watcher: FSWatcher | null = null

export function startWatcher(getWindow: () => BrowserWindow | null): void {
  const watched = [getTemplatesDir(), getTagsFilePath(), getDayTranslationsFilePath()]
  watcher = chokidar.watch(watched, { ignoreInitial: true })

  let debounceTimer: NodeJS.Timeout | null = null
  const notify = (): void => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      const win = getWindow()
      win?.webContents.send(IPC.TEMPLATES_CHANGED)
    }, 300)
  }

  watcher.on('add', notify).on('change', notify).on('unlink', notify)
}

export function stopWatcher(): void {
  void watcher?.close()
  watcher = null
}
