import getAndInitNewEpisodes from "./getAndInitNewEpisodes";
import forEach from "./forEach";
import episodesToString from "./episodesToString";

export default function(controller) {
  var store = controller.get("store");
  var checkForEp = function(){
    if(controller.get("isUpdating")) { return; }

    controller.set("isUpdating", true);
    getAndInitNewEpisodes(controller.currentUser, store).then(function(episodes) {
      controller.model.unshiftObjects(episodes);
      forEach(episodes.toArray(), function(episode, next) {
        episode.loading(next, next);
      }, function(){
        controller.set("isUpdating", false);

        if(episodes.get("length")){
          new Notification("New episodes", {
            body: episodesToString(episodes)
          });

          ipc.send("newBackgroundEpisodes", 1);
        }
      });
    }).catch(function(err){
      controller.currentUser.logout();
      controller.transitionToRoute("login");
    }).finally(function(){
      controller.set("isUpdating", false);
    });
  }

  var deleteOld = function() {
    var deleteOnTerm = function(term) {
      store.query("episode", term).then(function(episodes) {
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

  var checkForNewMagnets = function(){
    controller.set("isReloading", true);
    store.query("episode", {
      seen: false,
      removed: false,
      magnet: null
    }).then(function(episodes) {
      forEach(episodes.toArray(), function(episode, next){
        episode.loading(next, next);
      }, function() {
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

        controller.set("isReloading", false);
      }, function() {
        controller.set("isReloading", false);
      });

    }, function(err) {
      controller.set("isReloading", false);
    });
  }

  var updateMagnets = function(){
    controller.set("isReloading", true);

    store.query("episode", {
      seen: false,
      removed: false
    }).then(function(episodes) {
      forEach(episodes.toArray().reverse(), function(episode, next){
        episode.loading(next, next);
      }, function(){
        controller.set("isReloading", false);
      });
    });
  }

  var minute = 1000 * 60;

  var ids = []
  // Update releases every 60 min
  ids.push(setInterval(checkForEp, 60 * minute));
  // Find new magnets every 30 min
  ids.push(setInterval(checkForNewMagnets, 30 * minute));
  // Update magnets every 40 min
  ids.push(setInterval(updateMagnets, 40 * minute));
  // Delete old episodes once every hour
  ids.push(setInterval(deleteOld, 60 * minute));

  var check = function() {
    checkForEp();
    checkForNewMagnets();
    updateMagnets();
    deleteOld();
  };

  var online = function() {
    // Wait 5 sec to ensure connectivity
    setTimeout(check, 5000);
  }

  var down = function() {
    window.removeEventListener("online", online);
    ids.forEach(function(id) {
      clearInterval(id);
    });
  };

  // Check when online
  window.addEventListener("online",  online);

  // Check all on start up
  check();

  return down;
};