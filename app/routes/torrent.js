export default Ember.Route.extend({
  setupController: function(controller) {
  },

  model: function(params) {
    console.info("params", params);
  }
});