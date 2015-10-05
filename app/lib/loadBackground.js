var _ = nRequire("underscore");
import globals from "./globals";
import getJSON from "./getJSON";

var headers = {
  "Content-Type": "application/json",
  "trakt-api-key": globals.getClientID(),
  "trakt-api-version": "2"
}

var processShows = function(shows, resolve, reject) {
  var show = shows.pop();
  if(!show) { return reject("No shows found"); }

  var id = show.show.ids.slug;
  var options = {
    url: "https://api-v2launch.trakt.tv/shows/" + id + "?extended=images",
    headers: headers
  };

  getJSON(options).then(function(result){
    var fanart = result.images.fanart

    if(!fanart) { return processShows(shows, resolve, reject); }
    if(!fanart.full){ return processShows(shows, resolve, reject); }

    resolve(fanart.full);
  }).catch(reject);
};

export default {
  fetch: function(){
    return new Promise(function(resolve, reject) {
      getJSON({
        url: "https://api-v2launch.trakt.tv/shows/trending",
        headers: headers
      }).then(function(result){
        processShows(_.shuffle(result), resolve, reject);
      }).catch(reject);
    });
  }
}