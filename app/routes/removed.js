export default Ember.Route.extend({
  setupController: function(controller) {
    var self = this;
    controller.store.find('episode', { removed: true }).
    then(function(episodes) {
      episodes = episodes.sortBy("firstAired").reverse();
      self.controllerFor("episodes").set("episodes", episodes);
      self.controllerFor("application").set("episodes", episodes);
    });
  }
});