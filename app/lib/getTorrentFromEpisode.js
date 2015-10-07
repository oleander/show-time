import getJSON from "./getJSON";
import User from "./user";

var bestMatch = function(torrents){
  var user = new User();
  var includes = [];
  var excludes = [];
  var exclude = user.get("exclude");

  if(exclude && exclude.length) {
    excludes = exclude.split(",");
  }
  var include = user.get("include");
  if(include && include.length) {
    includes = include.split(",");
  }

  return torrents.find(function(torrent){
    var excludeOK = true;
    if(excludes.length) {
      excludeOK = ! excludes.any(function(exclude){
        return new RegExp(exclude.trim(), "i").test(torrent.title);
      });
    }
    var includeOK = true;
    if(includes.length) {
      var includeOK = includes.every(function(include){
        return new RegExp(include.trim(), "i").test(torrent.title);
      });
    }
    return includeOK && excludeOK;
  });
}

var search = function(query) {
  return new Promise(function(resolve, reject) {
    var params = {
      qs: {
        q: query,
        field: "seeders",
        order: "desc"
      },
      url: "https://kat.cr/json.php"
    };

    getJSON(params).then(function(data){
      if (!data.list.length) {
        reject("No torrent matches when searching for '" + query + "'");
      } else {
        var match = bestMatch(data.list);
        if(match) {
          resolve(match);
        } else {
          reject(match);
        }
      }
    }).catch(reject);
  });
};

export default function(episode) {
  return new Promise(function(resolve, reject) {
    var query1 = episode.get("show") + " " + episode.get("what");
    var query2 = episode.get("show") + " " + episode.get("title");

    var resultToMagnet = function(torrent) {
      // TODO: Make this shorter
      return "magnet:?xt=urn:btih:" + torrent.hash + "&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&dn=" + encodeURIComponent(torrent.title);
    };

    // First, search for show and episode number
    // Example: Mythbusters s16e06
    search(query1).then(function(result) {
      resolve(resultToMagnet(result));
    }, function(err) {
      // On no-match, search for show and episode title
      // Example: Mythbusters Unfinished Business
      search(query2).then(function(result) {
        resolve(resultToMagnet(result));
      }, function(err) {
        reject(err);
      });
    });
  });
}