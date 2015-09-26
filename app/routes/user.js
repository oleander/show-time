import backgroundLoader from "../lib/backgroundLoader";

export default Ember.Route.extend({
  beforeModel: function(){
    if(!this.currentUser.isLoggedIn){
      return this.transitionTo("login");
    }
  },
  deactivate: function() {
    this.get("down").call();
  },
  activate: function() {
    this.set("down", backgroundLoader(this.controllerFor("user.index")));
  }
});