export default Ember.Mixin.create({
  afterModel: function(){
    var application = this.controllerFor("application")
    if(!this.currentUser.get("isLoggedIn")){
      application.set("errorMessage", "You need to login first");
      this.transitionTo("login");
    }
  }
});