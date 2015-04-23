import getNewEpisodes from "../lib/getNewEpisodes"

export default function(store, callback) {
  getNewEpisodes(function(episodes) {
    var prom = episodes.map(function(episode) {
      return new Promise(function(resolve, reject) {
        var result = store.find("episode", {
          show: episode.show,
          what: episode.what
        });

        setTimeout(function() {
          if(result.get("length") > 0) {
            reject(null);
          } else {
            resolve(episode);
          }
        }, 1000);
      });
    });

    Ember.RSVP.allSettled(prom).then(function(rawEpisodes){
      var episodes = []
      rawEpisodes.forEach(function(event) {
        if(event.state != "fulfilled") { return; }
        var rawEpisode = event.value;
        if(rawEpisode.firstAired > new Date()) { return; }

        var episode = store.createRecord("episode", {
          show: rawEpisode.show,
          what: rawEpisode.what,
          magnet: null,
          title: rawEpisode.title,
          createdAt: new Date(),
          firstAired: rawEpisode.firstAired
        });

        episode.save();
        episodes.push(episode);
      });

      callback(episodes);
    });
  });
};