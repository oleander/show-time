import getAndInitNewEpisodes from "../lib/getAndInitNewEpisodes"

export default Ember.Controller.extend({
  removedView: false,
  seenView: false,
  isReloading: false,
  isUpdating: false,
  showAll: true,
  needs: ["episodes", "current"],
  errorMessage: null,
  successMessage: null,
  updatedAt: null,
  isReloadingProfile: false,
  deactivateUpdateAll: function() {
    return ! this.currentUser.get("isLoggedIn") || this.get("isUpdating")
  }.property("currentUser.isLoggedIn", "isUpdating"),
  deactivateReloadAll: function() {
    return ! this.currentUser.get("isLoggedIn") || this.get("isReloading")
  }.property("currentUser.isLoggedIn", "isReloading"),
  getEpisodes: function() {
    return this.get("controllers.episodes").get("episodes")
  },
  setEpisodes: function(data) {
    return this.get("controllers.episodes").set("episodes", data)
  },
  actions: {
    logout: function() {
      this.currentUser.logout();
      this.transitionToRoute("current");
    },
    reloadProfile: function(){
      this.set("isReloadingProfile", true);
      var self = this;
      this.currentUser.loadProfile().then(function(){
        self.set("isReloadingProfile", false);
      }, function() {
        self.set("isReloadingProfile", false);
      })
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

      getAndInitNewEpisodes(this.currentUser, this.store).then(function(episodes){
        episodes.forEach(function(episode) {
          self.getEpisodes().unshiftObject(episode);
          episode.loading();
        });

        done();
      }, function(error){
        done();
        self.set("errorMessage", error);
      });
    },
    clearDB: function(){
      this.setEpisodes([]);
      this.currentUser.logout();
      window.localStorage.clear();
      this.set("successMessage", "The database has been cleared.");
      this.transitionToRoute("login");
    },
    closeSuccessMessage: function() {
      this.set("successMessage", null);
    },
    closeErrorMessage: function() {
      this.set("errorMessage", null);
    }
  }
});