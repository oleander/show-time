import openPopcornTime from "../../lib/openPopcornTime";
import getAndInitNewEpisodes from "../../lib/getAndInitNewEpisodes";

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
    },
    reloadAll: function() {
      var self = this;
      self.set("isReloading", true);
      var promises = this.model.map(function(episode) {
        return new Promise(function(resolve, reject) {
          episode.loading(resolve, reject);
        });
      });

      Ember.RSVP.allSettled(promises).then(function(){
        self.set("isReloading", false);
      }, function() {
        self.set("isReloading", false);
      });
    },
    updateAll: function() {
      this.set("isUpdating", true);
      var self = this;

      var done = function(){
        self.set("isUpdating", false);
      }

      getAndInitNewEpisodes(this.currentUser, this.store).then(function(episodes){
        self.model.unshiftObjects(episodes);
        done();
      }).catch(function(error) {
        done();
        if(typeof(error) == "object"){
          if(error["error"] === "invalid_grant") {
            if(self.currentUser) {
              self.currentUser.logout();
            }
            self.transitionToRoute("login");
          }
          self.set("errorMessage", JSON.stringify(error));
        } else {
          self.set("errorMessage", error);
        }
      });
    },
  }
})