export default Ember.Route.extend({
  model: function(params) {
    return Em.RSVP.hash({
      magnets: this.store.findAll("magnet", { episode: params.id }).then(function(magnets){
        return magnets.sortBy("seeders").reverse().slice(0, 10);
      }),
      episode: this.store.find("episode", params.id)
    });
  },
  setupController: function(controller, model) {
    controller.setProperties(model);
  }
});