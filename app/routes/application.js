export default Ember.Route.extend({ 
  renderTemplate: function() {
    if(this.currentUser.isLoggedIn){
      this.render("application");
    } else {
      this.render("login");
    }
  }
});