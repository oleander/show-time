export default Ember.Route.extend({
  setupController: function(controller) {
    var self = this;
    var episodes = controller.store.find('episode', { removed: true })
    episodes.then(function(episodes) {
      episodes = episodes.sortBy("firstAired").reverse();
      self.controllerFor("episodes").set("episodes", episodes);
      self.controllerFor("application").set("episodes", episodes);
    }, function(err){
      self.controllerFor("episodes").set("episodes", []);
      self.controllerFor("application").set("episodes", []);
    });
  }
});