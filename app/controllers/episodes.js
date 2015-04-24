export default Ember.Controller.extend({
  episodes: [],
  needs: ["application"],
  currentUser: function() {
    return this.get('controllers.application.currentUser');
  }.property('controllers.application.currentUser'),
  deactivateUpdateAll: function() {
    return this.get('controllers.application.deactivateUpdateAll');
  }.property('controllers.application.deactivateUpdateAll'),
  actions: {
    remove: function(obj) {
      this.episodes.removeObject(obj);
      obj.isRemoved();
    },
    seen: function(obj) {
      obj.hasSeen();
      this.episodes.removeObject(obj)
    },
    reload: function(obj) {
      obj.loading();
    },
    download: function(obj) {
      nRequire("shell").openExternal(obj.get("magnet"))
    },
    updateAll: function(){
      this.get("controllers.application").send("updateAll");
    }
  }
})