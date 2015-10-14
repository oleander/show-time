import User from "../lib/user";

export default {
  name: "initUser",
  before: "store",
  initialize: function(container, app) {
    app.register("service:user", User, { instantiate: true, singleton: true });
    app.inject("controller", "currentUser", "service:user");
    app.inject("component", "currentUser", "service:user");
    app.inject("route", "currentUser", "service:user");
  }
};