import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@shared/ipcChannels'
import type { Template, TemplatesListResult, DayTranslations } from '@shared/types'

const api = {
  listTemplates: (): Promise<TemplatesListResult> => ipcRenderer.invoke(IPC.LIST_TEMPLATES),

  getTemplate: (id: string): Promise<Template> => ipcRenderer.invoke(IPC.GET_TEMPLATE, id),

  getTags: (): Promise<string[]> => ipcRenderer.invoke(IPC.GET_TAGS),

  getDayTranslations: (): Promise<DayTranslations> => ipcRenderer.invoke(IPC.GET_DAY_TRANSLATIONS),

  copyToClipboard: (text: string): Promise<void> => ipcRenderer.invoke(IPC.COPY_TO_CLIPBOARD, text),

  openTemplatesFolder: (): Promise<void> => ipcRenderer.invoke(IPC.OPEN_TEMPLATES_FOLDER),

  onTemplatesChanged: (callback: () => void): (() => void) => {
    const listener = (): void => callback()
    ipcRenderer.on(IPC.TEMPLATES_CHANGED, listener)
    return () => ipcRenderer.removeListener(IPC.TEMPLATES_CHANGED, listener)
  }
}

export type TextBuilderAPI = typeof api

contextBridge.exposeInMainWorld('api', api)
