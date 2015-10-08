import getNewEpisodes from "./getNewEpisodes"
import forEach from "./forEach";

export default function(user, store) {
  return new Ember.RSVP.Promise(function(resolve, reject){
    if(!user) {
      return reject("No user found in the database, are you logged in?");
    }

    var useEpisodes = [];

    var onEach = function(episode, next){
      store.query("episode", {
        show: episode.show,
        what: episode.what
      }).then(function(episodes) {
        if(episodes.get("length")) { 
          var found = episodes.get("firstObject");
          found.set("image", episode.image);
          return;
        }
        useEpisodes.push(episode);
      }, function() {
        useEpisodes.push(episode);
      }).finally(next);
    }

    var done = function(){
      var episodes = [];
      useEpisodes.forEach(function(rawEpisode) {
        if(rawEpisode.firstAired > new Date()) { return; }

        var episode = store.createRecord("episode", {
          show: rawEpisode.show,
          what: rawEpisode.what,
          magnet: null,
          title: rawEpisode.title,
          createdAt: new Date(),
          firstAired: rawEpisode.firstAired,
          image: rawEpisode.image
        });

        episode.save();
        episode.loading();
        episodes.push(episode);
      });

      resolve(episodes);
    }

    user.getAccessToken().then(function(token){
      return getNewEpisodes(token);
    }).then(function(episodes){
      forEach(episodes, onEach, done);
    }).catch(reject);
  });
};