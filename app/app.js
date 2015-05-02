import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import getAndInitNewEpisodes from "./lib/getAndInitNewEpisodes"

var App;
var ipc = nRequire("ipc");
var truncate = nRequire('truncate');
Ember.MODEL_FACTORY_INJECTIONS = true;

var notifier = nRequire('node-notifier');
var episodesToString = function(episodes){
  var episode = episodes[0];
  if(episodes.length == 1) {
    return episode.get("show")  + " " + episode.get("what") +
      " was released";
  }

  return episode.get("show")  + " " + episode.get("what") + " and " +
    (episodes.length - 1) + " others";
}

Ember.Application.initializer({
  name: "fetchLoop",
  after: "store",
  initialize: function(container, application) {
    var checkForEp = function(){
      var store = container.lookup("store:main");
      var epController = container.lookup('controller:episodes');
      getAndInitNewEpisodes(epController.currentUser, store).then(function(episodes) {
        episodes.forEach(function(episode) {
          epController.get("episodes").unshiftObject(episode);
          episode.loading();
        });

        if(episodes.length > 0){
          notifier.notify({
            'title': 'New episodes',
            'message': truncate(episodesToString(episodes), 10)
          });

          ipc.sendSync("newBackgroundEpisodes", 1);
        }
      });
    }
    setInterval(checkForEp, 1 * 60 * 60 * 1000);
    checkForEp();
  }
});

import User from "./lib/user";

Ember.Application.initializer({
  name: "initUser",
  before: "store",
  initialize: function(container, app) {
    app.register('service:user', User, { instantiate: true, singleton: true });
    app.inject('controller', 'currentUser', "service:user");
    app.inject('route', 'currentUser', "service:user");
  }
});

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;