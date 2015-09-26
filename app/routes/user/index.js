export default Ember.Route.extend({
  model: function() {
    return this.store.query("episode", { seen: false, removed: false });
  },
  renderTemplate: function(){
    this.render();
    this.render("user.menu", {
      outlet: "menu"
    });
  }
});