import getAndInitNewEpisodes from "../lib/getAndInitNewEpisodes"
var notifier = nRequire("node-notifier");
var ipc = nRequire("ipc");
import episodesToString from "../lib/episodesToString";

export default {
  name: "fetchLoop",
  after: "store",
  initialize: function(container, application) {
    var checkForEp = function(){
      var store = container.lookup("store:main");
      var epController = container.lookup("controller:episodes");
      var apController = container.lookup("controller:application");

      apController.set("isUpdating", true);

      getAndInitNewEpisodes(epController.currentUser, store).then(function(episodes) {
        epController.get("episodes").pushObjects(episodes);

        episodes.forEach(function(episode) {
          episode.loading();
        });

        apController.set("isUpdating", false);

        if(episodes.get("length")){
          notifier.notify({
            "title": "New episodes",
            "message": truncate(episodesToString(episodes), 50)
          });

          ipc.send("newBackgroundEpisodes", 1);
        }
      }, function(err) {
        apController.set("errorMessage", JSON.stringify(err));
        apController.set("isUpdating", false);
      });
    }

    setInterval(checkForEp, 1 * 60 * 60 * 1000);
    checkForEp();
  }
};