export default Ember.Route.extend({
  setupController: function(controller) {
    var self = this;
    controller.store.find('episode', { seen: false, removed: false }).
    then(function(episodes) {
      episodes = episodes.sortBy("firstAired").reverse();
      self.controllerFor("episodes").set("episodes", episodes);
      self.controllerFor("application").set("episodes", episodes);
    }, function() {
      self.controllerFor("episodes").set("episodes", []);
      self.controllerFor("application").set("episodes", []);
    });
  }
});