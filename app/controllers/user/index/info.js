var shell = nRequire("shell");

export default Ember.Controller.extend({
  indexController: Ember.inject.controller("user.index"),
  close: function(){
    this.transitionToRoute("user.index");
  },
  actions: {
    remove: function() {
      var should = confirm("Are you sure?");
      if(!should) { return; }
      this.get("indexController").model.removeObject(this.model);
      this.model.isRemoved();
      this.close();
    },
    seen: function() {
      var should = confirm("Are you sure?");
      if(!should) { return; }
      this.get("indexController").model.removeObject(this.model)
      this.model.hasSeen();
      this.close();
    },
    reload: function() {
      this.model.loading();
    },
    download: function() {
      if(this.model.get("noMagnet")) { return; }
      shell.openExternal(this.model.get("magnet"));
    },
    closeInfoBar: function(){
      this.close();
    },
    magnets: function(){
      this.transitionToRoute("user.index.magnets", this.model.get("id"));
    }
  }
});