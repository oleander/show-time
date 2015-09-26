import getAndInitNewEpisodes from "../lib/getAndInitNewEpisodes"

export default Ember.Controller.extend({
  afterModel: function(){
    if(!this.currentUser.isLoggedIn){
      this.transitionTo("login");
    }
  },
  removedView: false,
  seenView: false,
  isReloading: false,
  isUpdating: false,
  episodes: [],
  showAll: true,
  messageTimeout: 7000,
  needs: ["episodes", "current"],
  errorMessage: null,
  successMessage: null,
  messageID: null,
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
  // Displays flash messages
  flash: function(message, error) {
    var messageID = Math.random();
    var self      = this;
    
    if(error) {
      this.set("errorMessage", message);
      this.set("successMessage", null);
    } else {
      this.set("errorMessage", null);
      this.set("successMessage", message);
    }

    this.set("messageID", messageID);

    // Clear message after {messageTimeout} seconds
    setTimeout(function() {
      var currentMessageID = self.get("messageID");
      // Another message has been used in-between
      if(currentMessageID != messageID) { return; }

      if(error) {
        self.set("errorMessage", null);
      } else {
        self.set("successMessage", null);
      }
    }, this.get("messageTimeout"));
  },
  actions: {
    logout: function() {
      this.currentUser.logout();
      this.transitionToRoute("guest.login");
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

      getAndInitNewEpisodes(this.currentUser, this.store).then(done).catch(function() {
        console.info("fail....")
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
    closeSuccessMessage: function() {
      this.set("successMessage", null);
    },
    closeErrorMessage: function() {
      this.set("errorMessage", null);
    },
    closeAllMessages: function() {
      this.set("successMessage", null);
      this.set("errorMessage", null);
    }
  }
});