export default Ember.Controller.extend({
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
  }
})