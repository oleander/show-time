var exec = nRequire("child_process").exec;
var peerflix = nRequire("peerflix");
var pretty = nRequire("prettysize");
import openPopcornTime from "../lib/openPopcornTime";
import downloadSubtitle from "../lib/downloadSubtitle";
import toHHMMSS from "../lib/toHHMMSS";
import languages from "../lib/languages";

export default Ember.Component.extend({
  classNames: ["player-box"],
  loading: true,
  disabledVLCBuoutton: true,
  disabledPTButton: false,
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

    this.set("engine", engine);

    var promises = [new Promise(function(resolve){
      engine.server.on("listening", function() {
        resolve("http://localhost:" + engine.server.address().port);
      });
    })]

    engine.on("ready", function () {
      this.set("engineReady", true);
      this.set("downloaded", pretty(0));

      // Calculate total file size
      var size = 0;
      engine.files.forEach(function (file) { // pct torrent
        size += file.length || 0;
      });
      this.set("totalSize", pretty(size));

      var swarm = engine.swarm;
      var checkStatus = setInterval(function () {
        var downloaded = swarm.downloaded || 0;
        if (swarm.cachedDownload) {
          downloaded += swarm.cachedDownload;
        }
        if(!downloaded) {
          this.set("downloaded", pretty(downloaded));
        }
      }.bind(this), 1000);
      this.set("checkStatus", checkStatus);
      this.initVLC();
    }.bind(this));

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
      self.initVLC();
    });
  },
  onKey: function(e){
    if(e.keyCode == 27) {
      return e.data._self.escPressed();
    }
  },
  initVLC: function () {
    if(this.get("engineReady") && this.get("VLCUrl")) {
      this.set("loading", false);
      this.startVLC();
      setTimeout(function () {
        this.set("disabledVLCButton", false);
      }.bind(this), 5000);
    }
  },
  escPressed: function(){
    this.sendAction("close");
  },
  willDestroyElement: function(){
    var engine = this.get("engine");
    if(engine) { engine.destroy(); }

    var checkStatus = this.get("checkStatus");
    if(checkStatus) { clearInterval(checkStatus); }
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
    },
    openPT: function () {
      var self = this;
      this.set("disabledPTButton", true);
      openPopcornTime(this.get("episode"), this.get("magnet")).then(function() {
        self.set("disabledPTButton", false);
        console.info("Start in PopcornTime");
      }).catch(function(error) {
        console.error("error", error);
        self.set("disabledPTButton", false);
      })
    }
  }
})