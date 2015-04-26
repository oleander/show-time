var rpc = nRequire('jrpc2');
var request = nRequire("request");
var Base64 = nRequire('js-base64').Base64;

export default function(episode) {
  return new Promise(function(resolve, reject) {
    request.head("http://localhost:8008", function(error){
      if(error) { return reject("Please start PopcornTime."); }

      var http = new rpc.httpTransport({
        port: 8008, 
        hostname: "localhost"
      });

      var auth = Base64.encode("popcorn:popcorn")
      http.setHeader("Authorization", "Basic " + auth);
      var client = new rpc.Client(http);

      client.invoke('startstream', {
        "imdb_id": null, 
        "torrent_url": episode.get("magnet"),
        "backdrop": null,
        "subtitle": null,
        "selected_subtitle": null,
        "title": episode.get("completeTitle"),
        "quality": null,
        "type": "movie"
      }, function (err, raw) {
        if(err) { 
          reject("Could not play episode in PopcornTime.");
        } else {
          resolve(episode.get("shortTitle") + " has been started in PopcornTime.");
        }
      });
    });
  });
};