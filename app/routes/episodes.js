export default Ember.Route.extend({
  setupController: function(controller) {
    // // Set the IndexController's `title`
    // controller.set('episodes', [
    // ]);

    $.getJSON("/episodes.json", function(episodes) {
      var ep = $.map(episodes, function(episode) {
        return Ember.Object.create(episode);
      });

      controller.set('episodes', ep);
    })
  },
})