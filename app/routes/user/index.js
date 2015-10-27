import backgroundLoader from "../../lib/backgroundLoader";
import query from "../../lib/query";

export default Ember.Route.extend({
  model() {
    return query(this.store, { seen: false, removed: false });
  },
  renderTemplate() {
    this.render();
    this.render("user.menu", {
      outlet: "menu"
    });
  }
});