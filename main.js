var app = require('app');
var BrowserWindow = require('browser-window');
var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl("http://localhost:4200/");
  mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  mainWindow.module = undefined
});