var env         = nRequire("node-env-file");
var path        = nRequire("path");
var remote      = nRequire("remote");
var environment = remote.getCurrentWindow().environment;

export default {
  getClientSecret: function() {
    if(!environment.client_secret){
      throw "client secret in .env not set";
    }

    return environment.client_secret;
  },
  getClientID: function() {
    if(!environment.client_id){
      throw "client id in .env not set";
    }
    return environment.client_id;
  },
  isDev: function() {
    return environment.mode == "development";
  }
}