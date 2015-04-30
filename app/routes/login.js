export default Ember.Route.extend({
  afterModel: function(){
    var application = this.controllerFor("application")
    console.info("OKOKOK", application.get("currentUser"));
    if(application.get("currentUser")){
      this.transitionTo("current");
    }
  }
});