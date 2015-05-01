var request = nRequire("request");
import login from "./login";

export default Ember.Object.extend({
  isLoggedIn: false,
  init: function(){
    var raw = window.localStorage.getItem("user");
    if(!raw){ return; }
    var self = JSON.parse(raw);
    if(!self){ return; }
    this.set("isLoggedIn", true);
    this.set("accessToken", self.accessToken);
    this.set("expiresAt", self.expiresAt);
    this.set("refreshToken", self.refreshToken);
  },
  getAccessToken: function() {
    var today = new Date();

    var data = {
       "client_id": "123eaefe74369e41a98369af821d59a52c9283b20d79fead29e284ada23a1874",
       "client_secret": "d56b08ccf707fff156b8993d520c0e851c0e7ff18386a394aa6d10ed285b2a20",
       "redirect_uri": "urn:ietf:wg:oauth:2.0:oob",
       "grant_type": "refresh_token",
       "refresh_token": this.get("refreshToken")
    };

    var headers = {
      "Content-Type": "application/json",
    };

    var options = {
      url: "https://api-v2launch.trakt.tv/oauth/token",
      headers: headers,
      form: data
    };

    var self = this;

    return new Promise(function(resolve, failed) {
      if(!self.get("isLoggedIn")){
        return failed("User not logged in");
      }
      if(!self.get("refreshToken")) {
        return failed("No refreshToken set on user");
      }

      if(today < self.get("expiresAt")){
        return resolve(self.get("accessToken"));
      }

      request.post(options, function(error, response, raw){
        if(error) { return failed(error); }

        data = JSON.parse(raw);

        if(data["error"]) {
          return failed(data);
        }

        var expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + data["expires_in"]);

        self.set("accessToken", data["access_token"]);
        self.set("refreshToken", data["refresh_token"]);
        self.set("expiresAt", expiresAt);
        self.set("isLoggedIn", true);
        resolve(data["access_token"]);
      });
    });
  },
  save: function(){
    var self = {
      accessToken: this.get("accessToken"),
      expiresAt: this.get("expiresAt"),
      refreshToken: this.get("refreshToken")
    };

    window.localStorage.setItem("user", JSON.stringify(self));
  }.observes("accessToken", "expiresAt", "refreshToken"),
  logout: function(){
    window.localStorage.setItem("user", null);
    this.set("isLoggedIn", false);
  },
  login: function(authToken){
    var self = this;
    return new Promise(function(resolve, reject) {
      if(self.get("isLoggedIn")){ 
        return reject("Already logged in"); 
      }

      login(authToken).then(function(token){
        var expiresAt = new Date();
        expiresAt.setSeconds(
          expiresAt.getSeconds() + token["expires_in"]
        );

        self.set("accessToken", token.access_token);
        self.set("expiresAt", expiresAt);
        self.set("refreshToken", token.refresh_token);
        self.set("isLoggedIn", true);
        resolve();

      }, reject);
    });
  }
});