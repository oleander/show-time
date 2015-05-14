var env         = nRequire("node-env-file");
var path        = nRequire("path");
var remote      = nRequire("remote");

var config = remote.getCurrentWindow().config;
var mode   = remote.getCurrentWindow().mode;

export default {
  getClientSecret: function() {
    return config.clientSecret;
  },
  getClientID: function() {
    return config.clientID;
  },
  getUrl: function() {
    return config.pinUrl;
  },
  isDev: function() {
    return mode == "development";
  }
}