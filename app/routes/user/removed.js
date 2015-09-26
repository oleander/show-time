export default Ember.Route.extend({
  model: function() {
    return this.store.query("episode", { removed: true });
  }
});