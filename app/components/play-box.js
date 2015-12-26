var exec = nRequire("child_process").exec;
var peerflix = nRequire("peerflix");
import downloadSubtitle from "../lib/downloadSubtitle";
import toHHMMSS from "../lib/toHHMMSS";
import languages from "./../lib/languages";

export default Ember.Component.extend({
  classNames: ["player-box"],
  loading: true,
  disabledVLCButton: true,
  magnet: function(){
    return this.get("model").magnet;
  }.property(),
  episode: function(){
    return this.get("model").episode;
  }.property(),
  lang: function () {
    return this.get("currentUser").defaultLanguageKey();
  },
  longLang: function () {
    return this.get("currentUser").defaultLanguage().toLowerCase();
  },
  didInsertElement: function() {
    var self = this;
    var title = self.get("magnet").get("title");
    var engine = peerflix(this.get("magnet").get("href"), {
      connections: 100,
      dht: true,
      tracker: true,
      trackers: [
         "udp://tracker.openbittorrent.com:80",
         "udp://tracker.coppersurfer.tk:6969",
         "udp://tracker.publicbt.com:80/announce",
         "udp://open.demonii.com:1337"
      ],
      buffer: (1.5 * 1024 * 1024).toString()
    });

    var promises = [new Promise(function(resolve){
      engine.server.on("listening", function() {
        resolve("http://localhost:" + engine.server.address().port);
      });
    })]

    // Load default subtitle language from settings
    if(this.lang()) {
      promises.push(downloadSubtitle(title, this.lang()).then(function(path){
        return { path: path, lang: this.lang() };
      }));
    }

    Em.RSVP.allSettled(promises).then(function(data){
      var foundPath = null;
      var host = null;
      data.forEach(function(response){
        if(response.state != "fulfilled") { return; }
        if(!response.value.path){
          host = response.value;
        } else {
          foundPath = response.value.path;
        }
      });

      var seen = "--start-time=" + self.get("episode").get("seenInSec");
      var title = "--input-title-format='" + self.get("episode").get("shortTitle") + "'";

      var startVLC = "/Applications/VLC.app/Contents/MacOS/VLC " + seen + " "  + title +  " --no-fullscreen  --no-video-title-show"  + " -f " + host;

      if(foundPath) {
        startVLC += " --sub-file='" + foundPath + "'";
        self.set("language", self.get("longLang"));

      }

      self.set("VLCUrl", startVLC);
      console.info("start vlc", startVLC);
      self.startVLC();
      self.set("loading", false);
      setTimeout(function () {
        self.set("disabledVLCButton", false);
      }, 5000);
    });
  },
  onKey: function(e){
    if(e.keyCode == 27) {
      return e.data._self.escPressed();
    }
  },
  escPressed: function(){
    this.sendAction("close");
  },
  willDestroyElement: function(){
    var engine = this.get("engine");
    if(engine) { engine.destroy(); }
  },
  startVLC: function () {
    exec(this.get("VLCUrl"));
  },
  actions: {
    back: function(){
      this.sendAction("close");
    },
    openVLC: function(){
      this.startVLC();
    }
  }
})