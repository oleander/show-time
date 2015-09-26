import getAndInitNewEpisodes from "../lib/getAndInitNewEpisodes"

export default Ember.Controller.extend({
  isReloading: false,
  isUpdating: false,
  messageTimeout: 7000,
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