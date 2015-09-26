import backgroundLoader from "../../lib/backgroundLoader";

export default Ember.Route.extend({
  model: function() {
    return this.store.query("episode", { seen: false, removed: false });
  },
  renderTemplate: function(){
    this.render();
    this.render("user.menu", {
      outlet: "menu"
    });
  },
  deactivate: function() {
    this.get("down").call();
  },
  activate: function() {
    // backgroundLoader()
    // this.controllerFor("index");
  },
  setupController: function(controller, model) {
    this.set("down", backgroundLoader(controller));
    this._super(controller, model);
  }
});