import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import getAndInitNewEpisodes from "./lib/getAndInitNewEpisodes"

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

// Ember.Application.initializer({
//   name: 'currentUser',

//   initialize: function(container, application) {
//     var store = container.lookup('store:main')
//     store.find('user').then(function(users) {
//       if(users.get("length") > 0){
//         var user = function() {
//           return users.get("firstObject");
//         }.property("currentUser");
//         application.register('user:current', user , { instantiate: false });
//         application.inject('controller', 'currentUser', 'user:current');
//       }
//     });
//   }
// });

var notifier = nRequire('node-notifier');
var episodesToString = function(episodes){
  var episode = episodes[0];

  if(episodes.length == 1) {
    var episode = episodes[0];
    return episode.get("show")  + " " + episode.get("what") + " was released";
  }


  return episode.get("show")  + " " + episode.get("what") + " and " + 
    (episodes.length - 1) + " others";
}

Ember.Application.initializer({
  name: "fetchLoop",
  initialize: function(container, application) {
    setTimeout(function(){
      var store = container.lookup("store:main");
      var epController = container.lookup('controller:episodes');
      getAndInitNewEpisodes(store, function(episodes) {
        episodes.forEach(function(episode) {
          epController.get("episodes").unshiftObject(episode);
          episode.loading();
        });

        if(episodes.length > 0){
          notifier.notify({
            'title': 'New episodes',
            'message': episodesToString(episodes)
          });
        }
      });
    }, 10000);
  }
});

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});


loadInitializers(App, config.modulePrefix);

export default App;