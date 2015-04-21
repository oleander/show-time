export default Ember.Controller.extend({
  episodes: [],
  actions: {
    remove: function(obj) {
      obj.deleteRecord();
      obj.save();
    },
    seen: function(obj) {
      obj.hasSeen();
      this.episodes.removeObject(obj)
    },
    reload: function(obj) {
      obj.loading()
    },
    reloadAll: function() {
      this.episodes.forEach(function(episode) {
        episode.loading()
      })
    }
  }
});