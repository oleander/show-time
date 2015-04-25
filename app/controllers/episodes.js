var rpc = nRequire('jrpc2');
var request = nRequire("request");
var Base64 = nRequire('js-base64').Base64;

export default Ember.Controller.extend({
  episodes: [],
  needs: ["application"],
  currentUser: function() {
    return this.get('controllers.application.currentUser');
  }.property('controllers.application.currentUser'),
  deactivateUpdateAll: function() {
    return this.get('controllers.application.deactivateUpdateAll');
  }.property('controllers.application.deactivateUpdateAll'),
  actions: {
    remove: function(obj) {
      this.episodes.removeObject(obj);
      obj.isRemoved();
    },
    seen: function(obj) {
      obj.hasSeen();
      this.episodes.removeObject(obj)
    },
    reload: function(obj) {
      obj.loading();
    },
    download: function(obj) {
      nRequire("shell").openExternal(obj.get("magnet"))
    },
    updateAll: function(){
      this.get("controllers.application").send("updateAll");
    },
    playInPopcornTime: function(obj) {
      var self = this;
      obj.set("loadingPopcorn", true);
      openPopcornTime(obj).then(function(message){
        self.get("controllers.application").set("successMessage", message)
        obj.set("loadingPopcorn", false);
      }, function(err) {
        self.get("controllers.application").set("errorMessage", err)
        obj.set("loadingPopcorn", false);
      })
    }
  }
});

var openPopcornTime = function(episode) {
  return new Promise(function(resolve, reject) {
    request.head("http://localhost:8008", function(error){
      if(error) { return reject("Please start PopcornTime."); }

      var http = new rpc.httpTransport({
        port: 8008, 
        hostname: "localhost"
      });

      var auth = Base64.encode("popcorn:popcorn")
      http.setHeader("Authorization", "Basic " + auth);
      var client = new rpc.Client(http);

      client.invoke('startstream', {
        "imdb_id": null, 
        "torrent_url": episode.get("magnet"),
        "backdrop": null,
        "subtitle": null,
        "selected_subtitle": null,
        "title": episode.get("completeTitle"),
        "quality": null,
        "type": "movie"
      }, function (err, raw) {
        if(err) { 
          reject("Could not play episode in PopcornTime.");
        } else {
          resolve(episode.get("shortTitle") + " has been started in PopcornTime.");
        }
      });
    });
  });
};