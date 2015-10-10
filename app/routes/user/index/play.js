var peerflix = nRequire("peerflix");

export default Ember.Route.extend({
  model: function(params, controller) {
    var controller = this.controllerFor("user.index.play");
    var self = this;
    return new Promise(function(accept, reject){
      self.store.find("episode", params.id).then(function(episode){
        var engine = peerflix(episode.get("magnet"));
        controller.set("engine", engine);
        engine.server.on('listening', function() {
          window.url = "http://localhost:" + engine.server.address().port + "/";
          accept( window.url);
        });
      }).catch(reject);
    });
  },
  deactivate: function() {
    var controller = this.controllerFor("user.index.play");
    var engine = controller.get("engine");
    if(engine) { engine.destroy(); }
  },
  resetController: function (controller, isExiting, transition) {
    console.info("isExiting", isExiting);
  },
  afterModel: function(){
    var wjs = nRequire("wcjs-player");
    setTimeout(function(){
      var player = new wjs("#player").addPlayer({ autoplay: true });
      player.addPlaylist(window.url);
    }, 2000)

  }
});