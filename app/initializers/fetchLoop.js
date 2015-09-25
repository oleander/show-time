import getAndInitNewEpisodes from "../lib/getAndInitNewEpisodes"
import episodesToString from "../lib/episodesToString";
var ipc = nRequire("ipc");

export default {
  name: "fetchLoop",
  after: "store",
  initialize: function(container, application) {
    // TODO: Fix this
    // var store = container.lookup("store:main");
    return;
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

    var deleteOld = function() {
      var deleteOnTerm = function(term) {
        store.find("episode", term).then(function(episodes) {
          episodes.forEach(function(episode) {
            if(episode.isOlderThenDays(30)){
              episode.destroyRecord();
            }
          });
        });
      }

      deleteOnTerm({ removed: true });
      deleteOnTerm({ seen: true });
    };

    window.deleteOld = deleteOld;

    var checkForNewMagnets = function(){
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

    var updateMagnets = function(){
      apController.set("isReloading", true);

      store.find("episode", {
        seen: false, 
        removed: false
      }).then(function(episodes) {
        var promises = episodes.map(function(episode) {
          return new Promise(function(resolve, reject) {
            episode.loading(resolve, reject);
          });
        });

        Ember.RSVP.allSettled(promises).then(function(){
          apController.set("isReloading", false);
        }, function() {
          apController.set("isReloading", false);
        });
      });
    }

    var minute = 1000 * 60;

    // Update releases every 60 min
    setInterval(checkForEp, 60 * minute);
    // Find new magnets every 30 min
    setInterval(checkForNewMagnets, 30 * minute);
    // Update magnets every 40 min
    setInterval(updateMagnets, 40 * minute);
    // Delete old episodes once every hour
    setInterval(deleteOld, 60 * minute);

    var check = function() {
      checkForEp();
      checkForNewMagnets();
      updateMagnets();
      deleteOld();
    };

    // Check when online
    window.addEventListener("online",  function() {
      // Wait 5 sec to ensure connectivity
      setTimeout(check, 5000);
    });

    // Check all on start up
    check();
  }
};