var peerflix = nRequire("peerflix");

export default Ember.Controller.extend({
  engine: null,
  player: null,
  isLoading: true,
  actions: {
    didCloseVideo: function(){
      this.transitionToRoute("user.index");
    }
  }
});