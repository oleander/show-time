export default Ember.Mixin.create({
  afterModel: function(){
    if(!this.currentUser.isLoggedIn){
      this.transitionTo("login");
    }
  }
});