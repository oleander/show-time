export default Ember.Mixin.create({
  afterModel: function(){
    var application = this.controllerFor("application")
    if(!application.session.get("currentUser")){
      application.set("errorMessage", "You need to login first");
      this.transitionTo("login");
    }
  }
});