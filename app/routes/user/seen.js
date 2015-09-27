import query from "../../lib/query";

export default Ember.Route.extend({
  model: function() {
    return query(this.store, { seen: true });
  }
});