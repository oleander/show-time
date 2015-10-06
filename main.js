var BrowserWindow = require("browser-window");
var app           = require("app");
var env           = require("node-env-file");
var Tray          = require("tray");
var Menu          = require("menu");
var ipc           = require("ipc");
var path          = require("path");

var config      = require("./config.json")
var envPath     = path.join(__dirname, "environment");
var environment = env(envPath);
var mainWindow  = null;
var appIcon     = null;
var toggle      = {
  "true":  path.join(__dirname, "assets/star.png"),
  "false": path.join(__dirname, "assets/star-o.png")
}

if(!environment.mode) {
  throw "invalid .env file, mode not set";
}

if(!config.pinUrl) {
  throw "invalid config.json file, pinUrl not set";
}

if(!config.clientID) {
  throw "invalid config.json file, clientID not set";
}

if(!config.clientSecret) {
  throw "invalid config.json file, clientSecret not set";
}

var init = function() {
  app.commandLine.appendSwitch("disable-web-security");
  mainWindow = new BrowserWindow({
    "min-width": 1200,
    "min-height": 800,
    height: 800,
    width: 1200,
    "title-bar-style": "hidden",
    "web-preferences": {
      "web-security": false
    }
  });

  mainWindow.mode = environment.mode;
  mainWindow.config = config;

  mainWindow.module = undefined;
  mainWindow.setTitle("ShowTime");
  if(environment.mode === "development"){
    mainWindow.loadUrl("http://localhost:4200/");
    mainWindow.openDevTools();
  } else if (environment.mode === "production"){
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.setSkipTaskbar(true);
    mainWindow.setSkipTaskbar(false);
    mainWindow.loadUrl("file://" + __dirname + "/index.html");
  } else {
    throw "not supported " + environment;
  }

  mainWindow.maximize();

  mainWindow.webContents.on("new-window", function(e, url) {
    require("shell").openExternal(url);
    e.preventDefault()
  });

  mainWindow.on("focus", function() {
    appIcon.setImage(toggle["true"]);
  });
};

app.on("ready", function() {
  init();

  // main.js
  var template = [
    {
      label: 'ShowTime',
      submenu: [
        {
          label: 'About ShowTime',
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide Electron',
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
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        },
      ]
    }, {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
        },
      ]
    }, {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        },
      ]
    },
    {
      label: 'Help',
      submenu: []
    },
  ];

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  appIcon = new Tray(toggle["true"]);

  appIcon.on("clicked", function() {
    appIcon.setImage(toggle["true"]);
    if(mainWindow.isVisible()){
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  ipc.on("newBackgroundEpisodes", function(event, arg) {
    if(!mainWindow.isFocused()){
      appIcon.setImage(toggle["false"]);
    }
  });
});

app.on("activate-with-no-open-windows", function() {
  init();
});