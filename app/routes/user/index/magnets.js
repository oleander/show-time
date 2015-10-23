export default Ember.Route.extend({
  model: function(params) {
    return this.store.findAll("magnet", { episode: params.id }).then(function(magnets){
      return magnets.sortBy("seeders").reverse().slice(0, 10);
    });
  }
});