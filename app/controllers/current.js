export default Ember.Controller.extend({
  showAll: true,
  needs: ["application", "episodes"],
  updatedAt: function() {
    return this.get('controllers.application.updatedAt');
  }.property('controllers.application.updatedAt'),
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