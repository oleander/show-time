import openPopcornTime from "../../lib/openPopcornTime";

export default Ember.Controller.extend({
  actions: {
    removeEpisode: function(episode) {
      this.model.removeObject(episode)
      episode.isRemoved();
    },
    markEpisodeAsSeen: function(episode) {
      this.model.removeObject(episode)
      episode.hasSeen();
    },
    reloadEpisode: function(episode) {
      episode.loading();
    },
    downloadEpisode: function(episode) {
      nRequire("shell").openExternal(episode.get("magnet"));
    },
    updateAll: function(){
      this.model.forEach(function(episode) {
        episode.loading();
      });
    },
    playEpisodeInPopcornTime: function(episode) {
      var self = this;
      episode.set("loadingPopcorn", true);
      openPopcornTime(episode).then(function(message){
        // self.get("controllers.application").flash(message);
        episode.set("loadingPopcorn", false);
      }, function(err) {
        // self.get("controllers.application").flash(err, true);
        episode.set("loadingPopcorn", false);
      })
    }
  }
})