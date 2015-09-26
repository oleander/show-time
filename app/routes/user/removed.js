export default Ember.Route.extend({
  model: function() {
    return this.store.query("episode", { removed: true });
  },
  setupController: function() {
    this.controllerFor("user").set("model", this.model);
  }
});