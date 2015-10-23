import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route("user", function() {
    this.route("index", function(){
      this.route("info", { path: ":id/info" });
      this.route("magnets", { path: ":id/magnets" });
    });
    this.route("removed");
    this.route("seen");
  });

  this.route("play", { path: ":id/play" });

  this.route("login");
});