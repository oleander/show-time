/* @flow weak */

var wjs = nRequire("wcjs-player");
var peerflix = nRequire("peerflix");
import downloadSubtitle from "../lib/downloadSubtitle";
import toHHMMSS from "../lib/toHHMMSS";

export default Ember.Component.extend({
  classNames: ["player-box"],
  loaded: 0,
  hasStarted: false,
  defaultLanguageKey: function(){
    return this.currentUser.defaultLanguageKey();
  },
  defaultLanguage: function(){
    return this.currentUser.defaultLanguage();
  },
  didInsertElement: function() {
    $(document).on("keydown", { _self: this }, this.onKey);

    var self = this;
    var title = this.get("episode").get("magnetTitle");
    var engine = peerflix(this.get("episode").get("magnet"));

    engine.server.on("listening", function() {
      self.set("url", "http://localhost:" + 
        engine.server.address().port + 
        "/"
      );
      self.isLoaded();
    });

    // Load default subtitle language from settings
    var langKey = this.defaultLanguageKey();
    if(langKey){
      downloadSubtitle(title, langKey).then(function(path){
        self.set("subtitle", path);
        self.isLoaded();
      }).catch(function(err){
        self.isLoaded();
      });
    } else {
      self.isLoaded();
    }
  },
  isLoaded: function(){
    this.incrementProperty("loaded");
    if(this.get("loaded") == 2) {
      this.everytingIsLoaded();
    }
  },
  everytingIsLoaded: function(){
    var language  = this.currentUser.defaultLanguage();
    var self      = this;
    var url       = this.get("url");
    var subtitle  = this.get("subtitle");
    var subtitles = {};
    var seenInMs  = this.get("episode").get("seenInMs") || 0;
    var player    = new wjs("#player").addPlayer({ autoplay: true });

    if(subtitle) {
      subtitles[language] = subtitle;
    }

    player.addPlaylist({
      url: url,
      subtitles: subtitles,
      title: this.get("episode").get("shortTitle")
    });
    player.ui(true);
    player.video(true);
    player.playlist(false);
    player.time(seenInMs);
    player.subTrack(0);
    player.subTrack(1);

    if(seenInMs) {
      player.notify(`Starting at ${toHHMMSS(seenInMs / 1000)}`);
    }

    var currentTime = 0;
    player.onTime(function(time){
      currentTime = time;
    });

    var interval = setInterval(function(){
      if(currentTime) {
        self.sendAction("time", currentTime);
      }
    }, 1000);

    player.onState(function(state){
      if(state === "ended") {
        self.sendAction("videoTime", currentTime);
        self.sendAction("time", currentTime);
        self.sendAction("close");
      }

      if(state === "buffering") {
        self.onFirstFrame();
      }

      if(state === "playing") {
        self.onPlay();
      }
    });
  
    this.set("player", player);
    this.set("interval", interval);
  },
  onKey: function(e){
    e.preventDefault();
    if(e.keyCode == 27) {
      return e.data._self.sendAction("close");
    }

    if(!e.data._self.get("hasStarted")) { return; }
    switch(e.keyCode) {
      case 32: // space
        e.data._self.togglePlay(); break;
      case 39: // Right
        e.data._self.skipForward(); break;
      case 37: // Left
        e.data._self.skipBackward(); break;
    }
  },
  skipBackward: function(){
    var player = this.get("player");
    player.time(player.time() - 10000);
  },
  skipForward: function(){
    var player = this.get("player");
    player.time(player.time() + 10000);
  },
  togglePlay: function(){
    this.get("player").togglePause();
  },
  willDestroyElement: function(){
    var player = this.get("player");
    if(player) { 
      try {
        // Crashes for some reason if the application
        // is aborted before buffering is done
        player.stop();
      } catch(e){
        console.error("player error", e);
      }
    }

    var engine = this.get("engine");
    if(engine) { engine.destroy(); }

    var interval = this.get("interval");
    if(interval) { clearInterval(interval); }

    $(document).off("keydown", this.onKey);
  },
  onPlay: function(){
    this.set("hasStarted", true);
    // Calculate video length
    var $time = this.$().find(".wcp-time-total");
    var result = $time.text().match(/((\d+):)?(\d+):(\d+)/);
    // No player?
    if(!result) {
      return setTimeout(this.onPlay, 5000);
    }
    var sum = 0;
    var hour = result[2];
    var min = result[3];
    var sec = result[4];

    if(hour) {
      sum += hour * 60 * 60;
    }
    if(min) {
      sum += min * 60;
    }
    if(sec) {
      sum += sec;
    }
    this.sendAction("videoTime", sum * 1000);
  },
  onFirstFrame: function(){
    var $close = this.$().find("#close");
    var $toolbar = this.$().find(".wcp-toolbar");
    var self = this;

    $close.click(function(){
      self.sendAction("close");
    });

    new MutationObserver(function(){
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