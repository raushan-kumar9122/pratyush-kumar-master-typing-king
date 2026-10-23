/**
 * PRATYUSH KUMAR MASTER PRO - Native Windows Desktop Entry
 * Electron main process configuration for Windows 10 & Windows 11
 * The Future Track Computer Education
 */

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: 'PRATYUSH KUMAR MASTER PRO - The Future Track Computer Education',
    backgroundColor: '#070e1e',
    frame: true, // Native Windows chrome with custom title bar support
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: true,
    },
    icon: path.join(__dirname, 'public/icon.ico'),
    show: false,
  });

  // Load compiled production build or local dev server
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Remove default menu for clean commercial product feel
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Ensure single instance lock for native Windows operation
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
