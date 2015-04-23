export default Ember.Controller.extend({
  isLoading: false,
  error: false,
  needs: ["application"],
  currentUser: function() {
    return this.get('controllers.application.currentUser');
  }.property('controllers.application.currentUser'),
  actions: {
    login: function () {
      var self = this;
      if(self.get("currentUser")){
        return self.transitionToRoute("current");
      }

      self.set("isLoading", true)
      self.set("error", false);

      login(this.get("token"), function(token, error){
        self.set("isLoading", false);

        if(error){
          return self.set("error", true);
        }

        self.store.find("user").then(function(users){
          if(users.get("length") > 0) { return; }

          var expiresAt = new Date();
          expiresAt.setSeconds(
            expiresAt.getSeconds() + token["expires_in"]
          );

          var user = self.store.createRecord("user", {
            accessToken: token["access_token"],
            refreshToken: token["refresh_token"],
            expiresAt: expiresAt
          })

          user.save();

          self.get("controllers.application").
            set("currentUser", user);
          self.transitionToRoute("current");
        });
      });
    }
  }
});

var login = function(token, callback) {
  var request = nRequire('request');
  var data = {
     "code": token,
     "client_id": "123eaefe74369e41a98369af821d59a52c9283b20d79fead29e284ada23a1874",
     "client_secret": "d56b08ccf707fff156b8993d520c0e851c0e7ff18386a394aa6d10ed285b2a20",
     "redirect_uri": "urn:ietf:wg:oauth:2.0:oob",
     "grant_type": "authorization_code"
  }

  var headers = {
    "Content-Type": "application/json",
  }

  var options = {
    url: "https://api-v2launch.trakt.tv/oauth/token",
    headers: headers,
    form: data
  };

  request.post(options, function(error, response, raw){
    if(error) { return callback(null, error); }
    var body = JSON.parse(raw);
    if(body["access_token"]) {
      callback(body, null);
    } else {
      callback(null, body);
    }
  });
}