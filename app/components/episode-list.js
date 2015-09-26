export default Ember.Component.extend({
  actions: {
    seen: function(episode) {
      this.sendAction("seen", episode);
    },
    play: function(episode) {
      this.sendAction("play", episode);
    },
    remove: function(episode) {
      this.sendAction("remove", episode);
    },
    reload: function(episode) {
      this.sendAction("reload", episode);
    },
    download: function(episode) {
      this.sendAction("download", episode);
    }
  }
})