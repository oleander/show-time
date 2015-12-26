var wjs = nRequire("wcjs-player");
var exec = nRequire("child_process").exec;
var peerflix = nRequire("peerflix");
import downloadSubtitle from "../lib/downloadSubtitle";
import toHHMMSS from "../lib/toHHMMSS";
import languages from "./../lib/languages";

export default Ember.Component.extend({
  classNames: ["player-box"],
  loading: true,
  magnet: function(){
    return this.get("model").magnet;
  }.property(),
  episode: function(){
    return this.get("model").episode;
  }.property(),
  didInsertElement: function() {
    var self = this;
    var title = self.get("magnet").get("title");
    var engine = peerflix(this.get("magnet").get("href"));
    var serverP = new Promise(function(resolve){
      engine.server.on("listening", function() {
        resolve("http://localhost:" + engine.server.address().port);
      });
    })

    // Load default subtitle language from settings
    var promises = ["swe", "eng"].map(function(langKey){
      return downloadSubtitle(title, langKey).then(function(path){
        return { path: path, lang: langKey };
      })
    });

    promises.push(serverP);

    Em.RSVP.allSettled(promises).then(function(data){
      var foundedPaths = [];
      var host = null;
      data.forEach(function(response){
        if(response.state != "fulfilled") { return; }
        if(!response.value.path){
          host = response.value;
        } else {
          foundedPaths.push(response.value.path);
        }
      });

      if(foundedPaths[0]) {
        var subtitle = "--sub-file='" + foundedPaths[0] + "'";
      }
      var seen = "--start-time=" + self.get("episode").get("seenInSec");
      var title = "--input-title-format='" + self.get("episode").get("shortTitle") + "'";
      exec("/Applications/VLC.app/Contents/MacOS/VLC " + seen + " "  + title +  " --no-fullscreen  --no-video-title-show " + subtitle + " -f " + host, function(error, stdout, stderr) {
      });

      self.set("loading", false);
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
  actions: {
    back: function(){
      this.sendAction("close");
    }
  }
})