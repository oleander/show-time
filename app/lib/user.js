import postJSON from "./postJSON";
import globals from "./globals";
import login from "./login";
import getProfile from "./getProfile";
import languages from "./languages";

export default Ember.Object.extend({
  isLoggedIn: false,
  init: function(){
    var raw = window.localStorage.getItem("user");
    if(!raw){ return; }

    try {
      var self = JSON.parse(raw);
    } catch(e) { return; }

    if(!self){ return; }
    this.set("isLoggedIn", !! self.accessToken);
    this.set("accessToken", self.accessToken);
    this.set("expiresAt", self.expiresAt);
    this.set("refreshToken", self.refreshToken);
    this.set("avatar", self.avatar);
    this.set("username", self.username);
    this.set("joinedAt", self.joinedAt);
    this.set("exclude", self.exclude);
    this.set("include", self.include);
    this.set("language", self.language);
  },
  defaultLanguage: function() {
    return this.get("language") || "None";
  },
  defaultLanguageKey: function(){
    return languages.content[this.defaultLanguage()];
  },
  getAccessToken: function() {
    var today = new Date();
    var data = {
      "client_id": globals.getClientID(),
      "client_secret": globals.getClientSecret(),
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
        console.error("User not logged in");
        return failed("User not logged in");
      }
      if(!self.get("refreshToken")) {
        console.error("No refreshToken set on user");
        return failed("No refreshToken set on user");
      }

      if(today < self.get("expiresAt")){
        console.info("Return already existing token");
        console.info(today, self.get("expiresAt"));
        return resolve(self.get("accessToken"));
      }

      postJSON(options).then(function(data){
        if(data["error"]) {
          console.error("failed", data);
          return failed(data);
        }

        var expiresAt = new Date();
        expiresAt.setSeconds(
          expiresAt.getSeconds() +
          // (data["expires_in"] / 1000)
          24 * 60 * 60 // One day
        );

        console.info("Set new accessToken", data["access_token"]);
        console.info("expires in", expiresAt);
        console.info("plain expires", data["expires_in"]);
        
        self.set("accessToken", data["access_token"]);
        self.set("refreshToken", data["refresh_token"]);
        self.set("expiresAt", expiresAt);
        self.set("isLoggedIn", true);
        resolve(data["access_token"]);
      }).catch(failed);
    });
  },
  loadProfile: function(){
    var self = this;
    return new Promise(function(resolve, reject){
      self.getAccessToken().then(function(token){
        getProfile(token).then(function(data){
          self.set("username", data.user.username);
          self.set("avatar", data.user.images.avatar.full);
          self.set("joinedAt", new Date(data.user.joined_at));
          resolve();
        }, reject);
      }, reject);
    })
  },

  save: function(){
    var self = {
      accessToken: this.get("accessToken"),
      expiresAt: this.get("expiresAt"),
      refreshToken: this.get("refreshToken"),
      avatar: this.get("avatar"),
      username: this.get("username"),
      joinedAt: this.get("joinedAt"),
      exclude: this.get("exclude"),
      include: this.get("include"),
      language: this.get("language")
    };

    window.localStorage.setItem("user", JSON.stringify(self));
  }.observes("accessToken", "expiresAt", "refreshToken", "username", "avatar", "joinedAt", "include", "exclude", "language"),
  logout: function(){
    window.localStorage.setItem("user", null);
    this.set("isLoggedIn", false);
  },
  clearFields: function(){
    if(this.get("isLoggedIn")) { return; }
    this.set("accessToken", null);
    this.set("expiresAt", null);
    this.set("refreshToken", null);
    this.set("avatar", null);
    this.set("username", null);
    this.set("joinedAt", null);
    this.set("exclude", null);
    this.set("include", null);
    this.set("language", null);
  }.observes("isLoggedIn"),
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
        self.loadProfile();
        resolve();
      }, reject);
    });
  }
});