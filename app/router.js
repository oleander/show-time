import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route("user", function() {
    this.route("removed");
    this.route("seen");
  });

  this.route("login");
});