export default Ember.Controller.extend({
  episodes: [],
  actions: {
    remove: function(obj) {
      this.episodes.removeObject(obj)
    },
    seen: function(obj) {
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