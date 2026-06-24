const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow; // 🌸 Hold the single global reference

function createWindow() {
  // Prevent spawning a duplicate window if one already exists
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  // Inside main.cjs
// Inside main.cjs
mainWindow = new BrowserWindow({
  width: 1000,
  height: 700,
  frame: true, // 🌸 Brings back the dependable, native minimize/close buttons!
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
})  

  // 🌟 Remove the built-in operating system window menu bar entirely
  mainWindow.setMenu(null);

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
  } else {
    mainWindow.loadURL('http://localhost:5173')
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 🌟 Make sure app setup hooks handle singleton behavior cleanly
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})