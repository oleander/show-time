var app = require("app");
var BrowserWindow = require("browser-window");
var env = require("node-env-file");

var mainWindow = null;
var environment = env(__dirname + "/.env")["ENV"];

app.on("window-all-closed", function() {
  if (process.platform != "darwin")
    app.quit();
});

var Tray = require("tray");
var Menu = require("menu");
var ipc = require("ipc");

app.on("ready", function() {
  app.commandLine.appendSwitch("disable-web-security");
  mainWindow = new BrowserWindow({
    width: 1000, 
    height: 800,
    "web-preferences": {
      "web-security": false
    }
  });

  mainWindow.module = undefined;
  mainWindow.setTitle("NeverAgain");
  if(environment === "development"){
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.setSkipTaskbar(true);
    mainWindow.setSkipTaskbar(false);
    mainWindow.openDevTools();
    mainWindow.setSize(1200, 1200);
    mainWindow.loadUrl("http://localhost:4200/");
  } else if (environment === "production"){
    mainWindow.loadUrl("file://" + __dirname + "/index.html");
    // app.dock.hide();
    mainWindow.setResizable(false);
  } else {
    throw "not supported " + environment;
  }

  mainWindow.center();

  // var toggle = {
  //   "true":  "assets/star-o.png",
  //   "false": "assets/star.png"
  // }

  // appIcon = new Tray(toggle["true"]);
  // appIcon.on("clicked", function() {
  //   appIcon.setImage(toggle["false"])
  //   mainWindow.focus();
  // });

  ipc.on("newBackgroundEpisodes", function(event, arg) {
    if(!mainWindow.isFocused()){
      // appIcon.setImage(toggle["false"]);
    }
  });

  mainWindow.webContents.on("new-window", function(e, url) {
    require("shell").openExternal(url);
    e.preventDefault()
  });

  mainWindow.on("focus", function() {
    // appIcon.setImage(toggle["true"]);
  });
});