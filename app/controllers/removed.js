export default Ember.Controller.extend({
  showAll: false,
  needs: "episodes",
  episodes: function() {
    return this.get('controllers.episodes.episodes');
  }.property('controllers.episodes.episodes')
});