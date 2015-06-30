import getNewEpisodes from "../lib/getNewEpisodes"

export default function(user, store) {
  return new Promise(function(resolve, reject){
    if(!user) {
      return reject("No user found in the database, are you logged in?");
    }

    user.getAccessToken().then(function(token){
      getNewEpisodes(token, function(episodes) {
        var prom = episodes.map(function(episode) {
          return new Promise(function(resolve, reject) {
            store.find("episode", {
              show: episode.show,
              what: episode.what
            }).then(function(episodes) {
              if(episodes.get("length")) {
                return reject("Already exists in the database");
              }
              resolve(episode);
            }, function() {
              resolve(episode);
            });
          });
        });

        Ember.RSVP.allSettled(prom).then(function(rawEpisodes){
          var episodes = [];
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

          resolve(episodes.sortBy("firstAired").reverse());
        }, function(){
          reject("Could not load data from trakt.tv");
        });
      }, reject);
    }, reject);
  });
};