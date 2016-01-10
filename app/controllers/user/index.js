import addToTraktHistory from "../../lib/addToTraktHistory";
import getAndInitNewEpisodes from "../../lib/getAndInitNewEpisodes";
import forEach from "../../lib/forEach";
var peerflix = nRequire("peerflix");
var shell = nRequire("shell");

export default Ember.Controller.extend({
  userController: Ember.inject.controller("user"),
  actions: {
    displayMagnetsView: function(episode){
      this.transitionToRoute("user.index.magnets", episode.get("id"));
    },
    removeMagnet: function(episode) {
      this.model.removeObject(episode);
      episode.isRemoved();
    },
    markAsSeen: function(episode) {
      this.model.removeObject(episode)
      episode.hasSeen();
      addToTraktHistory(episode);
    },
    reloadMagnet: function(episode) {
      episode.loading();
    },
    downloadMagnet: function(episode) {
      if(episode.get("noMagnet")) { return; }
      shell.openExternal(episode.get("magnet"));
    },
    playEpisode: function(episode){
      if(episode.get("hasValidMagnet")){
        this.transitionToRoute("user.play",
          episode.get("id"),
          episode.get("validMagnet").get("id")
      );
      } else {
        this.transitionToRoute("user.index.magnets", episode.get("id"));
      }
    },
    reloadAll: function() {
      var self = this;
      self.set("isReloading", true);
      forEach(this.model.toArray(), function(episode, next){
        episode.loading(next, next);
      }, function(){
        self.set("isReloading", false);
      });
    },
    updateAll: function() {
      this.set("isUpdating", true);
      var self = this;

      getAndInitNewEpisodes(this.currentUser, this.store).then(function(episodes){
        self.model.unshiftObjects(episodes);
      }).catch(function(error) {
        if(error && typeof(error) == "object"){
          if(error["error"] === "invalid_grant") {
            if(self.currentUser) {
              console.info("err2", error);
              self.currentUser.logout();
            }
            self.transitionToRoute("login");
          }
          self.get("userController").flash(JSON.stringify(error), true);
        } else {
          self.get("userController").flash(error, true);
        }
      }).finally(function(){
        self.set("isUpdating", false);
      });
    },
  }
})