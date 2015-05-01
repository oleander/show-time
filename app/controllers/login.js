export default Ember.Controller.extend({
  isLoading: false,
  error: false,
  needs: ["application"],
  actions: {
    login: function () {
      var self = this;

      self.set("isLoading", true)
      self.set("error", false);

      var doneLoading = function(){
        self.set("isLoading", false);
        self.set("token", "");
      }

      self.session.login(self.get("token")).then(function(){
        doneLoading();
        self.transitionToRoute("current");
        self.get("controllers.application").send("updateAll");
      }, function(){
        doneLoading();
        self.set("error", true);
      })
    }
  }
});