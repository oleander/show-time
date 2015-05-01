export default Ember.Controller.extend({
  isLoading: false,
  error: false,
  needs: ["application"],
  actions: {
    login: function () {
      var self = this;

      self.set("isLoading", true)

      var doneLoading = function(){
        self.set("isLoading", false);
        self.set("token", "");
      }

      self.currentUser.login(self.get("token")).then(function(){
        doneLoading();
        self.transitionToRoute("current");
        self.get("controllers.application").send("updateAll");
        self.get("controllers.application").set("errorMessage", null);
      }, function(errorMessage){
        doneLoading();
        self.get("controllers.application").
          set("errorMessage", errorMessage)
      })
    }
  }
});