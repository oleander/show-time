var peerflix = nRequire("peerflix");

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
      var url = "http://localhost:" + engine.server.address().port + "/";
      controller.set("url", url);
    });
  }
});