var request = nRequire("request");
var _ = nRequire("underscore");
import globals from "./globals";

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

  request.get(options, function(error, response, raw){
    if(error) { return reject(error) }
    if(response.statusCode != 200) { 
      return reject("Invalid status code"); 
    }

    var result = JSON.parse(raw)
    var fanart = result.images.fanart

    if(!fanart) { return processShows(shows, resolve, reject); }
    if(!fanart.full){ return processShows(shows, resolve, reject); }

    resolve(fanart.full);
  });
};

export default {
  fetch: function(){
    return new Promise(function(resolve, reject) {
      request.get({
        url: "https://api-v2launch.trakt.tv/shows/trending",
        headers: headers
      }, function(error, response, raw) {
        if(error) { return reject(error); }
        if(response.statusCode != 200) { 
          return reject("Invalid status code"); 
        }
        processShows(_.shuffle(JSON.parse(raw)), resolve, reject);
      });
    });
  }
}