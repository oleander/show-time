import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

// App.ApplicationSerializer = DS.IndexedDBSerializer.extend();
// App.ApplicationAdapter = DS.IndexedDBAdapter.extend({
//   databaseName: 'never_again',
//   version: 1,
//   migrations: function() {
//     this.addModel('episode');
//   }
// });

export default App;
