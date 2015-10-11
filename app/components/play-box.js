var wjs = nRequire("wcjs-player");
var peerflix = nRequire("peerflix");

export default Ember.Component.extend({
  classNames: ["player-box"],
  didInsertElement: function() {
    console.info("didInsertElement");
    var self = this;
    var engine = peerflix(this.get("magnet"));
    engine.server.on("listening", function() {
      console.info("loaded url")
      self.hasLoadedUrl(
        "http://localhost:" + 
        engine.server.address().port + 
        "/"
      );
    });
  },
  hasLoadedUrl: function(url){
    console.info("start player")
    var self = this;
    var player = new wjs("#player").addPlayer({ autoplay: true });
    player.addPlaylist(url);
    player.ui(true);
    player.video(true);
    player.volume(0);

    this.set("player", player);

    player.onFrameSetup(function(){
      self.onFirstFrame();
    });
  },
  willDestroyElement: function(){
    console.info("stop!")
    var player = this.get("player");
    if(player) { player.stop(); }

    var engine = this.get("engine");
    if(engine) { engine.destroy(); }
  },
  onFirstFrame: function(){
    var $close = this.$().find("#close");
    var $toolbar = this.$().find(".wcp-toolbar");
    var self = this;

    console.info("onFrameSetup", $close);

    $close.click(function(){
      console.info("close...")
      self.sendAction("close");
    });

    new MutationObserver(function(mutations,b){
      if($toolbar.is(":visible")) {
        $close.removeClass("hide");
      } else {
        $close.addClass("hide");
      }
    }).observe($toolbar.get(0), {
      attributes: true,
      subtree: false
    });
  }
})