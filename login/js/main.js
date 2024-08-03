const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    }
  });

  mainWindow.loadFile('../html/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('open-main-page', (event, username) => {
  console.log('Received open-main-page with username:', username); // Debug statement
  mainWindow.loadFile('../../mainPage/html/mainPage.html').then(() => {
    console.log('Main page loaded'); // Debug statement
    console.log("Sending: ", username)
    mainWindow.webContents.send('set-username', username);
    console.log("Sent")
  }).catch(err => {
    console.error('Failed to load main page:', err); // Debug statement for error handling
  });
});
