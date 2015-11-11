import getJSON from "./getJSON";
import User from "./user";
var tpb = nRequire("thepiratebay");

var cleanUp = function(torrents) {
  return torrents.map(function(torrent){
    return {
      href: "magnet:?xt=urn:btih:" + torrent.hash + "&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&dn=" + encodeURIComponent(torrent.title),
      title: torrent.title,
      seeders: torrent.seeds
    };
  })
}

var search1 = function(query) {
  var params = {
    qs: {
      q: query,
      field: "seeders",
      order: "desc",
      verified: "1"
    },
    url: "https://kat.cr/json.php"
  };

  return getJSON(params).then(function(data){
    return cleanUp(data.list.filterBy("verified").sortBy("seeds").reverse());
  });
};

var search2 = function(query){
  return tpb.search(query, { category: "200", orderBy: "7" }).then(function(results){
    return results.map(function(result){
      return {
        href: result.magnetLink,
        title: result.name,
        seeders: parseInt(result.seeders, 10)
      };
    });
  })
}

var search = function(query) {
  return search1(query).then(function(results){
    if(results.length) {
      return results.slice(0, 10);
    } else {
      return search2(query).then(function(results){
        return results.slice(0, 10);
      }).catch(function(err){
        return [];
      });
    }
  }).catch(function(err){
    return search2(query);
  }).then(function(results){
    return results.slice(0, 10);
  }).catch(function(err){
    return [];
  })
}

export default function(episode) {
  var show = episode.get("show");
  var query1 = show + " " + episode.get("what");
  var query2 = show + " " + episode.get("title");
  return search(query1).then(function(results){
    if(results.length){
      return results;
    } else {
      search(query2).then(function(results){
        return results
      }).catch(function(err){
        return [];
      });
    }
  }).catch(function(err) {
    return search(query2)
  }).catch(function(err){
    return [];
  });
}