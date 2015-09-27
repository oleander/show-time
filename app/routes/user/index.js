import backgroundLoader from "../../lib/backgroundLoader";
import query from "../../lib/query";

export default Ember.Route.extend({
  model: function() {
    return query(this.store, { seen: false, removed: false });
  },
  renderTemplate: function(){
    this.render();
    this.render("user.menu", {
      outlet: "menu"
    });
  }
});