export default Ember.Route.extend({
  afterModel: function(){
    if(this.currentUser.isLoggedIn){
      this.transitionTo("current");
    }
  }
});