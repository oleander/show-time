var BrowserWindow = require("browser-window");
var app           = require("app");
var env           = require("node-env-file");
var Tray          = require("tray");
var Menu          = require("menu");
var ipc           = require("ipc");
var path          = require("path");

var config = require("./config.json")
var envPath = path.join(__dirname, "environment");
var environment = env(envPath);

if(!environment.mode) {
  throw "invalid .env file, mode not set";
}

if(!config.clientID) {
  throw "invalid config.json file, clientID not set";
}

if(!config.clientSecret) {
  throw "invalid config.json file, clientSecret not set";
}

app.on("ready", function() {
  app.commandLine.appendSwitch("disable-web-security");
  mainWindow = new BrowserWindow({
    "min-width": 1200,
    "min-height": 800,
    height: 800,
    width: 1200,
    "web-preferences": {
      "web-security": false
    }
  });

  mainWindow.mode = environment.mode;
  mainWindow.config = config;

  mainWindow.module = undefined;
  mainWindow.setTitle("NeverAgain");
  if(environment.mode === "development"){
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.setSkipTaskbar(true);
    mainWindow.setSkipTaskbar(false);
    mainWindow.loadUrl("http://localhost:4200/");
  } else if (environment.mode === "production"){
    mainWindow.loadUrl("file://" + __dirname + "/index.html");
  } else {
    throw "not supported " + environment;
  }

  mainWindow.center();

  var toggle = {
    "true":  path.join(__dirname, "assets/star.png"),
    "false": path.join(__dirname, "assets/star-o.png")
  }

  var appIcon = new Tray(toggle["true"]);

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

  mainWindow.webContents.on("new-window", function(e, url) {
    require("shell").openExternal(url);
    e.preventDefault()
  });

  mainWindow.on("focus", function() {
    appIcon.setImage(toggle["true"]);
  });
});