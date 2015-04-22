export default Ember.Route.extend({
  setupController: function(controller) {
    controller.store.find('episode', { removed: true }).
    then(function(episodes) {
      controller.set('episodes', episodes.sortBy("createdAt"));
    });
  }
});