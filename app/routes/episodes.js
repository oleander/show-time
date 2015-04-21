export default Ember.Route.extend({
  setupController: function(controller) {
    controller.store.find('episode', { seen: false }).then(function(episodes) {
      controller.set('episodes', episodes);
    })
    // $.getJSON("/episodes.json", function(episodes) {
    //   $.each(episodes, function(_, episode) {
    //     controller.store.createRecord('episode', {
    //       show: episode.show,
    //       what: episode.what,
    //       magnet: episode.magnet,
    //       seen: false
    //     }).save()
    //   })
    // })
  }
})