var app = require('app');
var BrowserWindow = require('browser-window');
var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

var Tray = require('tray');
var Menu = require('menu');
var ipc = require('ipc');
// app.dock.hide();

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1000, height: 600});

  mainWindow.loadUrl("http://localhost:4200/");
  mainWindow.openDevTools();

  // mainWindow.setSkipTaskbar(false);
  mainWindow.module = undefined;
  mainWindow.setTitle("NeverAgain");
  mainWindow.setResizable(false)
  // mainWindow.setMenuBarVisibility(false);
  // mainWindow.setAutoHideMenuBar(true);
  // mainWindow.setSkipTaskbar(true);

  var template = [
    {
      label: 'NeverAgain',
      submenu: [
        {
          type: 'separator'
        },
        {
          label: 'Hide NeverAgain',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        }
      ]
    }
  ];

  // menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu); 

  var toggle = {
    "true":  "assets/star-o.png",
    "false": "assets/star.png"
  }

  appIcon = new Tray(toggle["true"]);
  appIcon.on("clicked", function() {
    appIcon.setImage(toggle["false"])
    mainWindow.focus();
  });

  ipc.on('newBackgroundEpisodes', function(event, arg) {
    if(!mainWindow.isFocused()){
      appIcon.setImage(toggle["false"]);
    }
  });

  mainWindow.webContents.on("new-window", function(e, url) {
    require('shell').openExternal(url);
    e.preventDefault()
  });

  mainWindow.on("focus", function() {
    appIcon.setImage(toggle["true"]);
  });
});