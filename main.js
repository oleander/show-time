var app = require('app');
var BrowserWindow = require('browser-window');
var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

var Menu = require('menu');
var Tray = require('tray');

// app.dock.hide();

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1000, height: 600});
  mainWindow.loadUrl("http://localhost:4200/");
  mainWindow.openDevTools();

  mainWindow.module = undefined

  appIcon = new Tray('assets/star-o.png');
  appIcon.on("clicked", function() {
    console.info("Tray clicked");
    mainWindow.focus();
  });

  // TODO: Check if url is magnet link
  mainWindow.webContents.on("new-window", function(e, url) {
    require('shell').openExternal(url);
    e.preventDefault()
  });

  // appIcon.setToolTip('This is my application.');
  // appIcon.setContextMenu(contextMenu);

});

// app.on("window-all-closed", function() {
//   console.info("=====> do nothing");
// });
