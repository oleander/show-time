var wjs = nRequire("wcjs-player");
var peerflix = nRequire("peerflix");

var toHHMMSS = function (sec) {
  var hours   = Math.floor(sec / 3600);
  var minutes = Math.floor((sec - (hours * 3600)) / 60);
  var seconds = Math.floor(sec - (hours * 3600) - (minutes * 60));

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  var time    = hours+':'+minutes+':'+seconds;
  return time;
}

export default Ember.Component.extend({
  classNames: ["player-box"],
  didInsertElement: function() {
    var self = this;
    var engine = peerflix(this.get("episode").get("magnet"));
    engine.server.on("listening", function() {
      self.hasLoadedUrl(
        "http://localhost:" + 
        engine.server.address().port + 
        "/"
      );
    });
  },
  hasLoadedUrl: function(url){
    var self = this;
    var seenInMs = this.get("episode").get("seenInMs") || 0;
    var player = new wjs("#player").addPlayer({ autoplay: true });
    player.addPlaylist(url);
    player.ui(true);
    player.video(true);
    player.volume(0);
    player.playlist(false);
    player.time(seenInMs);

    if(seenInMs) {
      player.notify(`Starting at ${toHHMMSS(seenInMs / 1000)}`);
    }

    this.sendAction("videoTime", player.time());

    var currentTime = 0;
    player.onTime(function(time){
      currentTime = time;
    });

    var interval = setInterval(function(){
      self.sendAction("time", currentTime);
    }, 10000);

    player.onState(function(state){
      if(state === "ended") {
        self.sendAction("time", currentTime);
        self.sendAction("close");
      }
    });

    player.onFrameSetup(function(){
      self.onFirstFrame();
    });

    this.set("player", player);
    this.set("interval", interval);
  },
  willDestroyElement: function(){
    var player = this.get("player");
    if(player) { player.stop(); }

    var engine = this.get("engine");
    if(engine) { engine.destroy(); }

    var interval = this.get("interval");
    if(interval) { clearInterval(interval); }
  },
  onFirstFrame: function(){
    var $close = this.$().find("#close");
    var $toolbar = this.$().find(".wcp-toolbar");
    var self = this;

    $close.click(function(){
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