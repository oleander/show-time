var shell = nRequire("shell");

export default Ember.Controller.extend({
  indexController: Ember.inject.controller("user.index"),
  actions: {
    remove: function() {
      var should = confirm("Are you sure?");
      if(!should) { return; }
      this.get("indexController").model.removeObject(this.model);
      this.model.isRemoved();
    },
    seen: function() {
      var should = confirm("Are you sure?");
      if(!should) { return; }
      this.get("indexController").model.removeObject(this.model)
      this.model.hasSeen();
    },
    reload: function() {
      this.model.loading();
    },
    download: function() {
      if(this.model.get("noMagnet")) { return; }
      shell.openExternal(this.model.get("magnet"));
    },
    closeInfoBar: function(){
      this.transitionToRoute("user.index");
    },
    magnets: function(){
      this.transitionToRoute("user.index.magnets", this.model.get("id"));
    }
  }
});