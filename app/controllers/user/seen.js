import removeFromTraktHistory from "../../lib/removeFromTraktHistory";

export default Ember.Controller.extend({
  actions: {
    restoreEpisode: function(episode) {
      this.transitionToRoute("user.index");
      episode.restore();
      removeFromTraktHistory(episode);
    }
  }
});