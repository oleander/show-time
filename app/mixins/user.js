export default Ember.Mixin.create({
  afterModel: function(){
    console.info("===>", this.currentUser)
    if(!this.currentUser.isLoggedIn){
      this.transitionTo("login");
    }
  }
});