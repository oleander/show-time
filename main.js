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
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl("http://localhost:4200/");
  mainWindow.openDevTools();

  // mainWindow.on('closed', function() {
  //   mainWindow = null;
  // });
  mainWindow.module = undefined

  // TODO: Check if url is magnet link
  mainWindow.webContents.on("new-window", function(e, url) {
    require('shell').openExternal(url);
    e.preventDefault()
  });

  appIcon = new Tray('/Users/linus/Desktop/icon.png');
  appIcon.on("clicked", function() {
    console.info("Tray clicked");
    mainWindow.focus();
  });
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' },
  ]);
  // appIcon.setToolTip('This is my application.');
  // appIcon.setContextMenu(contextMenu);

});

// app.on("window-all-closed", function() {
//   console.info("=====> do nothing");
// });
