import globals from "../lib/globals";

export default Ember.Controller.extend({
  isLoading: false,
  error: false,
  userController: Ember.inject.controller("user"),
  pinUrl: globals.getUrl(),
  actions: {
    login: function () {
      var self = this;

      self.set("isLoading", true)

      var doneLoading = function(){
        self.set("isLoading", false);
        self.set("error", null);
      }

      self.currentUser.login(self.get("token")).then(function(){
        doneLoading();
        self.get("userController").send("closeAllMessages");
        $(".vegas-background").hide();
        $(".vegas-overlay").hide();
        self.set("token", null);
        self.transitionToRoute("user.index");
      }, function(errorMessage){
        doneLoading();
        if(typeof(errorMessage) == "object"){
          self.set("error", errorMessage.error_description);
        } else {
          self.set("error", errorMessage);
        }
      })
    }
  }
});