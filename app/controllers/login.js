import globals from "../lib/globals";

export default Ember.Controller.extend({
  isLoading: false,
  error: false,
  pinUrl: globals.getUrl(),
  needs: ["application"],
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
        $(".vegas-background").hide();
        $(".vegas-overlay").hide();
        self.set("token", null);
        self.transitionToRoute("current");
        self.get("controllers.application").send("updateAll");
        self.get("controllers.application").set("error", null);
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