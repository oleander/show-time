import getJSON from "./getJSON";
import User from "./user";

var search = function(query) {
  return new Promise(function(resolve, reject) {
    var params = {
      qs: {
        q: query,
        field: "seeders",
        order: "desc",
        verified: "1"
      },
      url: "https://kat.cr/json.php"
    };

    getJSON(params).then(function(data){
      if (!data.list.length) {
        reject("No torrent matches when searching for '" + query + "'");
      } else {
        var torrents = data.list;
        if(torrents.length) {
          resolve(torrents.filterBy("verified").sortBy("seeds").reverse().slice(0, 10));
        } else {
          reject("No torrents found");
        }
      }
    }).catch(reject);
  });
};

export default function(episode) {
  return new Promise(function(resolve, reject) {
    var query1 = episode.get("show") + " " + episode.get("what");
    var query2 = episode.get("show") + " " + episode.get("title");

    var resultToMagnet = function(torrents) {
      return torrents.map(function(torrent){
        return {
          // TODO: Make this shorter
          href: "magnet:?xt=urn:btih:" + torrent.hash + "&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&dn=" + encodeURIComponent(torrent.title),
          title: torrent.title,
          seeders: torrent.seeds
        };
      });
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