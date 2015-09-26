export default Ember.Route.extend({
  model: function() {
    return this.store.query("episode", { seen: false, removed: false });
  },
  setupController: function() {
    // this.controllerFor("user").set("model", this.model);
  },

  renderTemplate: function(){
    this.render();
    this.render('user.menu', {
      outlet: "menu"//,
      // controller: 'user'
    });
  }
});