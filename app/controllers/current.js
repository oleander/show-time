export default Ember.Controller.extend({
  showAll: true,
  needs: ["application", "episodes"],
  isUpdating: function() {
    return this.get('controllers.application.isUpdating');
  }.property('controllers.application.isUpdating'),
  episodes: function() {
    return this.get('controllers.episodes.episodes');
  }.property('controllers.episodes.episodes'),
  actions: {
    updateAll: function(){
      this.get("controllers.application").send("updateAll");
    }
  }
})