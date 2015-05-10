import getAndInitNewEpisodes from "../lib/getAndInitNewEpisodes"
import episodesToString from "../lib/episodesToString";
var ipc = nRequire("ipc");

export default {
  name: "fetchLoop",
  after: "store",
  initialize: function(container, application) {
    var store = container.lookup("store:main");
    var epController = container.lookup("controller:episodes");
    var apController = container.lookup("controller:application");
    
    var checkForEp = function(){
      if(apController.get("isUpdating")) { return; }

      apController.set("isUpdating", true);

      getAndInitNewEpisodes(epController.currentUser, store).then(function(episodes) {
        epController.get("episodes").unshiftObjects(episodes);

        episodes.forEach(function(episode) {
          episode.loading();
        });

        apController.set("isUpdating", false);

        if(episodes.get("length")){
          new Notification("New episodes", {
            body: episodesToString(episodes)
          });

          ipc.send("newBackgroundEpisodes", 1);
        }
      }, function(err) {
        apController.set("isUpdating", false);
      });
    }

    var checkForNewMagnets = function(){
      if(apController.get("isReloading")) { return; }

      apController.set("isReloading", true);
      store.find("episode", {
        seen: false, 
        removed: false,
        magnet: null
      }).then(function(episodes) {
        var promises = episodes.map(function(episode) {
          return new Promise(function(resolve, reject) {
            episode.loading(resolve, reject);
          });
        });

        Ember.RSVP.allSettled(promises).then(function(){
          // Remove all episodes which doesn't have a magnet link
          var filteredEps = episodes.reject(function(episode) {
            return ! episode.get("magnet");
          });

          if(filteredEps.length){
            new Notification("New magnet links", {
              body: episodesToString(filteredEps)
            });

            ipc.send("newBackgroundEpisodes", 1);
          }

          apController.set("isReloading", false);
        }, function() {
          apController.set("isReloading", false);
        });

      }, function(err) {
        apController.set("isReloading", false);
      });
    }

    // Update releases every 60 min
    setInterval(checkForEp, 1 * 60 * 60 * 1000);
    // Update magnets every 30 min
    setInterval(checkForNewMagnets, 1 * 30 * 60 * 1000);

    checkForEp();
    checkForNewMagnets();
  }
};