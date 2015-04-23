import getAndInitNewEpisodes from "../lib/getAndInitNewEpisodes"

export default Ember.Controller.extend({
  removedView: false,
  seenView: false,
  isReloading: false,
  isUpdating: false,
  showAll: true,
  currentUser: null,
  needs: ["episodes"],
  actions: {
    logout: function() {
      var user = this.get("currentUser");
      user.destroyRecord();
      this.set("currentUser", null);
    },
    reloadAll: function() {
      var self = this;
      self.set("isReloading", true);
      var promises = this.episodes.map(function(episode) {
        return new Promise(function(resolve) {
          episode.loading(resolve);
        });
      });

      Promise.all(promises).then(function(){
        self.set("isReloading", false);
      });
    },
    updateAll: function() {
      this.set("isUpdating", true);
      var self = this;

      getAndInitNewEpisodes(this.store, function(episodes) {
        episodes.forEach(function(episode) {
          self.episodes.unshiftObject(episode);
          episode.loading();
        });
        self.set("isUpdating", false);
      });
    },
    clearDB: function(){
      this.get("controllers.episodes").set("episodes", [])
      window.localStorage.clear();
    }
  }
});