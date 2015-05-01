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

      console.info("User => ", this.session.get("currentUser"))
      getAndInitNewEpisodes(this.session.get("currentUser"), this.store).then(function(episodes){
        console.info("episodes", episodes)
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
      this.session.logout();
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