import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { ensureUserData } from './firstRun'
import { registerIpcHandlers } from './ipcHandlers'
import { startWatcher, stopWatcher } from './watcher'
import { buildAppMenu } from './menu'
import { syncTemplatesFromGitHub } from './templateSync'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 640,
    minHeight: 480,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.westlakesleep.textbuilder')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await ensureUserData()
  registerIpcHandlers()
  buildAppMenu()
  createWindow()
  startWatcher(() => mainWindow)

  // Best-effort background sync from GitHub on every launch — not awaited, so a slow
  // or offline network never blocks startup. ensureUserData() above already guarantees
  // the folder is non-empty (bundled fallback); if this succeeds it overwrites that with
  // whatever's latest on main, and the watcher above picks up the change and refreshes
  // the UI automatically. If it fails (offline), whatever's already on disk is left alone.
  void syncTemplatesFromGitHub()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  stopWatcher()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
