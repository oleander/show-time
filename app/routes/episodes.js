export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('episodes', controller.store.find('episode'))
    // $.getJSON("/episodes.json", function(episodes) {
    //   $.each(episodes, function(_, episode) {
    //     controller.store.createRecord('episode', {
    //       show: episode.show,
    //       what: episode.what,
    //       magnet: episode.magnet
    //     }).save()
    //   })
    // })
  }
})