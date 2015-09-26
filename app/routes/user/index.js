import UserFilter from "../../mixins/user";

export default Ember.Route.extend({
  model: function() {
    return this.store.query("episode", { seen: false, removed: false });
  }
});