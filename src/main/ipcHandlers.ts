import { ipcMain, clipboard, shell } from 'electron'
import { IPC } from '@shared/ipcChannels'
import { listTemplateSummaries, getTemplateById } from './templateStore'
import { getTags } from './tagsStore'
import { getDayTranslations } from './dayTranslations'
import { getBaseDir, getTemplatesDir } from './paths'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'

export function registerIpcHandlers(): void {
  ipcMain.handle(IPC.LIST_TEMPLATES, () => listTemplateSummaries())

  ipcMain.handle(IPC.GET_TEMPLATE, (_event, id: string) => getTemplateById(id))

  ipcMain.handle(IPC.GET_TAGS, () => getTags())

  ipcMain.handle(IPC.GET_DAY_TRANSLATIONS, () => getDayTranslations())

  ipcMain.handle(IPC.COPY_TO_CLIPBOARD, (_event, text: string) => {
    clipboard.writeText(text)
  })

  ipcMain.handle(IPC.OPEN_TEMPLATES_FOLDER, async () => {
    const dir = getTemplatesDir()
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true })
    }
    const err = await shell.openPath(dir)
    if (err) {
      // Fall back to revealing the base folder if the templates subfolder can't be opened.
      shell.showItemInFolder(getBaseDir())
    }
  })
}
