var EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
      minifyCSS: {
        enabled: false
      },
      minifyJS: {
        enabled: false
      }
    });

    app.import("bower_components/ember-localstorage-adapter/localstorage_adapter.js");
    app.import("bower_components/bootstrap/dist/css/bootstrap-theme.css");
    app.import("bower_components/font-awesome/css/font-awesome.css");
    app.import("bower_components/bootstrap/dist/js/bootstrap.js");
    app.import("vendor/app.js");
    app.import("vendor/AdminLTE.css");
    app.import("vendor/_all-skins.css");
    app.import("vendor/vegas.css");

    app.import("vendor/vegas.js");

    return app.toTree();
};