export default Ember.Controller.extend({
  actions: {
    back: function(){
      this.transitionToRoute("user.index");
    },
    play: function(magnet) {
      this.transitionToRoute("play",
        this.get("episode").get("id"),
        magnet.get("id")
      );
    }
  }
});