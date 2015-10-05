import openPopcornTime from "../../lib/openPopcornTime";
import getAndInitNewEpisodes from "../../lib/getAndInitNewEpisodes";
import forEach from "../../lib/forEach";

export default Ember.Controller.extend({
  userController: Ember.inject.controller("user"),
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
    playEpisodeInPopcornTime: function(episode) {
      var self = this;
      episode.set("loadingPopcorn", true);
      openPopcornTime(episode).then(function(message){
        self.get("userController").flash(message);
        episode.set("loadingPopcorn", false);
      }, function(err) {
        self.get("userController").flash(err, true);
        episode.set("loadingPopcorn", false);
      })
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
        if(typeof(error) == "object"){
          if(error["error"] === "invalid_grant") {
            if(self.currentUser) {
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