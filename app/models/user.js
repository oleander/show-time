export default DS.Model.extend({
  accessToken: DS.attr('string'),
  expiresAt: DS.attr('string'),
  refreshToken: DS.attr('string'),
  getAccessToken: function() {
    var request = nRequire("request");
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
      if(!self.get("refreshToken")) {
        return failed({error: "No refreshToken set on user"});
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
        self.save();

        resolve(data["access_token"]);
      })
    })

  }
});