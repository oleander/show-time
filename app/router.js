import Ember from "ember";
import config from "./config/environment";

// TODO: Fix this
// Ember.Handlebars.helper("truncate", function(text, options){
//   var limit = options.hash.limit || 46;
//   if (text.length > limit){
//     text = text.substr(0, limit - 3) + "...";
//   }
//   return text;
// });

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route("user", { resetNamespace: true, path: "user" }, function() {
    this.route("current", { path: "/" });
    this.route("torrents", { path: "/torrents" });
    // this.route("torrent", { path: "/torrent/:torrent" });
    this.route("removed", { path: "/removed" });
    this.route("seen", { path: "/seen" });
  });

  this.route("guest", { resetNamespace: true, path: "user" }, function() {
    this.route("login", { path: "/login" });
  });

  this.route("logout", { path: "/logout" });
});