var kickass = nRequire("kickass-torrent");

export default function(episode) {
  // Searches on kickass
  var search = function(query) {
    return new Promise(function(resolve, reject) {
      kickass({
        q: query,
        field:"seeders",
        order:"desc",
        url: "http://kat.cr",
      }, function(e, data){
        if(e) {
          reject(e);
        } else if (!data.list.length) {
          reject("No torrent matches when searching for " + query);
        } else {
          resolve(data.list[0].torrentLink);
        }
      });
    });
  };

  return new Promise(function(resolve, reject) {
    var query1 = episode.get("show") + " " + episode.get("what");
    var query2 = episode.get("show") + " " + episode.get("title");

    // First, search for show and episode number
    // Example: Mythbusters s16e06
    search(query1).then(function(magnet) {
      resolve(magnet);
    }, function() {
      // On no-match, search for show and episode title
      // Example: Mythbusters Unfinished Business
      search(query2).then(function(magnet) {
        resolve(magnet);
      }, function(err) {
        reject(err);
      })
    });
  });
}