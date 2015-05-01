import getAndInitNewEpisodes from "../lib/getAndInitNewEpisodes"

export default Ember.Controller.extend({
  removedView: false,
  seenView: false,
  isReloading: false,
  isUpdating: false,
  showAll: true,
  currentUser: function(){
    return this.get("model")
  }.property("model"),
  needs: ["episodes", "current"],
  errorMessage: null,
  successMessage: null,
  updatedAt: null,
  deactivateUpdateAll: function() {
    return ! this.get("currentUser") || this.get("isUpdating")
  }.property("currentUser", "isUpdating"),
  deactivateReloadAll: function() {
    return ! this.get("currentUser") || this.get("isReloading")
  }.property("currentUser", "isReloading"),
  getEpisodes: function() {
    return this.get("controllers.episodes").get("episodes")
  },
  setEpisodes: function(data) {
    return this.get("controllers.episodes").set("episodes", data)
  },
  actions: {
    logout: function() {
      var user = this.get("currentUser");
      user.destroyRecord();
      this.set("currentUser", null);
    },
    reloadAll: function() {
      var self = this;
      self.set("isReloading", true);
      var promises = this.getEpisodes().map(function(episode) {
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

      var done = function(){
        self.set("isUpdating", false);
        self.set("updatedAt", new Date());
      }

      getAndInitNewEpisodes(this.session.currentUser(), this.store).then(function(episodes){
        done();
        episodes.forEach(function(episode) {
          self.getEpisodes().unshiftObject(episode);
          episode.loading();
        });
      }, function(error){
        done();
        self.set("errorMessage", error);
      });
    },
    clearDB: function(){
      this.setEpisodes([]);
      this.set("currentUser", null);
      window.localStorage.clear();
      this.set("successMessage", "The database has been cleared.");
    },
    closeSuccessMessage: function() {
      this.set("successMessage", null);
    },
    closeErrorMessage: function() {
      this.set("errorMessage", null);
    }
  }
});