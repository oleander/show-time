export default Ember.Route.extend({
  setupController: function(controller) {
    $.getJSON("/episodes.json", function(episodes) {
      var ep = $.map(episodes, function(episode) {
        episode.loading = false;
        episode.noMagnet = ! episode.magnet;
        return Ember.Object.create(episode);
      });

      controller.set('episodes', ep);
    })
  }
})