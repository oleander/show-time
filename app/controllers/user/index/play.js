var peerflix = nRequire("peerflix");

export default Ember.Controller.extend({
  engine: null,
  actions: {
    exit: function(){
      var engine = this.get("engine");
      if(engine) { console.info("kill engine"); engine.destroy(); }
      this.transitionToRoute("user.index");
    }
  }
})