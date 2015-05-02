/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'never-again',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV.contentSecurityPolicy = {
    'default-src': "'none' ",
    'script-src': "'self' http://maxcdn.bootstrapcdn.com  'unsafe-inline' 'unsafe-eval' http://localhost:4200 https://code.jquery.com https://maxcdn.bootstrapcdn.com https://cdn.mxpnl.com", // Allow scripts from https://cdn.mxpnl.com
    'font-src': "'self'  https://maxcdn.bootstrapcdn.com http://fonts.gstatic.com", // Allow fonts to be loaded from http://fonts.gstatic.com
    'connect-src': "'self'  https://api.mixpanel.com http://custom-api.local", // Allow data (ajax/websocket) from api.mixpanel.com and custom-api.local
    'img-src': "'self' https://secure.gravatar.com https://i0.wp.com",
    'style-src': "'self'  http://localhost:4200 https://maxcdn.bootstrapcdn.com 'unsafe-inline' http://fonts.googleapis.com", // Allow inline styles and loaded CSS from http://fonts.googleapis.com 
    'media-src': "'self' "
  }

  return ENV;
};
