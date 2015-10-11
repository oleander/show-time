var peerflix = nRequire("peerflix");
var wjs = nRequire("wcjs-player");

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find("episode", params.id);
  },
  deactivate: function() {
    var controller = this.controllerFor("user.play");

    var engine = controller.get("engine");
    if(engine) { console.info("remove"); engine.destroy(); }
  
    var player = controller.get("player");
    if(player) { console.info("remove player"); player.stop(); }
  },
  afterModel: function(episode){
    var self = this;
    var controller = this.controllerFor("user.play");
    var engine = peerflix(episode.get("magnet"));
    controller.set("engine", engine);
    engine.server.on("listening", function() {
      controller.set("isLoading", false);
      var url = "http://localhost:" + engine.server.address().port + "/";
      var player = new wjs("#player").addPlayer({ autoplay: true });
      controller.set("player", player);
      player.addPlaylist(url);
      player.ui(true);
      player.video(true);
    });
  }
});