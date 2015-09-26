import loadBackground from "../lib/loadBackground";

export default Ember.Route.extend({
  afterModel: function(){
    if(this.currentUser.isLoggedIn){
      return this.transitionTo("user.index");
    }

    loadBackground.fetch().then(function(background) {
      $.vegas({ src: background });
      $.vegas("overlay", { opacity: 0.2 });
    });
  }
});