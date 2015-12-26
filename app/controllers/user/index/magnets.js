var shell = nRequire("shell");

export default Ember.Controller.extend({
  actions: {
    back: function(){
      this.transitionToRoute("user.index");
    },
    play: function(magnet) {
      this.transitionToRoute("user.play",
        this.get("episode").get("id"),
        magnet.get("id")
      );
    },
    download: function(magnet) {
      shell.openExternal(magnet.get("href"));
    },
  }
});