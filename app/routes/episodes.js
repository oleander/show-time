export default Ember.Route.extend({
  setupController: function(controller) {
    controller.store.find('episode', { seen: false, removed: false }).
    then(function(episodes) {
      controller.set('episodes', episodes.sortBy("createdAt"));
    })
  }
});