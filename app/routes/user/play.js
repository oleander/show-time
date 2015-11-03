export default Ember.Route.extend({
  model: function(params) {
    return Em.RSVP.hash({
      magnet: this.store.find("magnet", params.magnet_id),
      episode: this.store.find("episode", params.episode_id)
    });
  }
});