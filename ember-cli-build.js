var EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    minifyCSS: {
      enabled: false
    },
    minifyJS: {
      enabled: false
    },
    fingerprint: {
      enabled: false
    }
  });

  app.import("bower_components/ember-localstorage-adapter/localstorage_adapter.js");
  app.import("bower_components/bootstrap/dist/js/bootstrap.js");
  app.import("vendor/app.js");
  app.import("vendor/vegas.js");
  
  app.import("vendor/vegas.css");
  app.import("bower_components/bootstrap/dist/css/bootstrap.css");
  app.import("bower_components/font-awesome/css/font-awesome.css");

  
  return app.toTree();
};