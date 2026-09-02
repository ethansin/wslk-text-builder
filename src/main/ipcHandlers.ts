import { ipcMain, clipboard } from 'electron'
import { IPC } from '@shared/ipcChannels'
import { listTemplateSummaries, getTemplateById } from './templateStore'
import { getTags } from './tagsStore'
import { getDayTranslations } from './dayTranslations'
import { syncTemplatesFromGitHub } from './templateSync'

export function registerIpcHandlers(): void {
  ipcMain.handle(IPC.LIST_TEMPLATES, () => listTemplateSummaries())

  ipcMain.handle(IPC.GET_TEMPLATE, (_event, id: string) => getTemplateById(id))

  ipcMain.handle(IPC.GET_TAGS, () => getTags())

  ipcMain.handle(IPC.GET_DAY_TRANSLATIONS, () => getDayTranslations())

  ipcMain.handle(IPC.COPY_TO_CLIPBOARD, (_event, text: string) => {
    clipboard.writeText(text)
  })

  ipcMain.handle(IPC.SYNC_TEMPLATES, () => syncTemplatesFromGitHub())
}
