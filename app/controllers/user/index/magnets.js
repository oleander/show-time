export default Ember.Controller.extend({
  actions: {
    back: function(){
      this.transitionToRoute("user.index");
    }
  }
});