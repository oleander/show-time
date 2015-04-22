import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.Application.initializer({
  name: 'currentUser',

  initialize: function(container, application) {
    var store = container.lookup('store:main')
    store.find('user').then(function(users) {
      if(users.get("length") > 0){
        var user = function() {
          return users.get("firstObject");
        }.property("currentUser");
        application.register('user:current', user , { instantiate: false });
        application.inject('controller', 'currentUser', 'user:current');
      }
    });
  }
});

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});


loadInitializers(App, config.modulePrefix);

export default App;