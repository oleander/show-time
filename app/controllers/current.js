export default Ember.Controller.extend({
  showAll: true,
  needs: ["application"],
  updatedAt: function() {
    return this.get('controllers.application.updatedAt');
  }.property('controllers.application.updatedAt'),
  isUpdating: function() {
    return this.get('controllers.application.isUpdating');
  }.property('controllers.application.isUpdating'),
  actions: {
    updateAll: function(){
      this.get("controllers.application").send("updateAll");
    }
  }
})