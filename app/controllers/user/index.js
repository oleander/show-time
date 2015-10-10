import openPopcornTime from "../../lib/openPopcornTime";
import getAndInitNewEpisodes from "../../lib/getAndInitNewEpisodes";
import forEach from "../../lib/forEach";
var peerflix = nRequire("peerflix");

export default Ember.Controller.extend({
  userController: Ember.inject.controller("user"),
  actions: {
    removeEpisode: function(episode) {
      var should = confirm("Are you sure?");
      if(!should) { return; }
      this.model.removeObject(episode)
      episode.isRemoved();
    },
    markEpisodeAsSeen: function(episode) {
      var should = confirm("Are you sure?");
      if(!should) { return; }
      this.model.removeObject(episode)
      episode.hasSeen();
    },
    reloadEpisode: function(episode) {
      episode.loading();
    },
    downloadEpisode: function(episode) {
      if(episode.get("noMagnet")) { return; }
      nRequire("shell").openExternal(episode.get("magnet"));
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