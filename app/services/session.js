import login from "../lib/login";

export default Ember.Object.extend({
  currentUser: function() {
    var user = this.database().user;
    if(!user){ return; }
    var data = user.records;
    for (var key in data) {
      return this.store.serializerFor('user').
        normalize(this.store.modelFor('user'), data[key])
    }
  }.property(),
  database: function(){
    var db = window.localStorage.getItem("again");
    if(!db){ return {}; }
    return JSON.parse(db);
  },
  logout: function(){
    var db = this.database();
    var user = db.user;
    if(!user){ return; }
    var data = user.records;
    data.user = [];
    window.localStorage.setItem("again", JSON.stringify(db));
    this.propertyWillChange("currentUser");
  },
  login: function(authToken){
    var self = this;
    return new Promise(function(resolve, reject) {
      login(authToken).then(function(token){
        self.store.find("user").then(function(users){
          if(users.get("users")){
            self.propertyDidChange("currentUser");
            resolve();
          } else {
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
            self.propertyDidChange("currentUser");
            resolve();
          }
        }, reject);
      }, reject);
    });
  }
});
