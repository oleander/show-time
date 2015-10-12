var opensubtitles = nRequire("subtitler");
var zlib = nRequire("zlib");
var http = nRequire("http");
var fs = nRequire("fs");
var path = nRequire("path")
var url = nRequire("url");
var temp = nRequire("temp");
var wuzzy = nRequire("wuzzy");

var selectBestMatch = function(results, query){
  var cleanUp = function(value) {
    return value.replace(/[^a-z\d]/gi, "");
  }
  var searchQuery = cleanUp(query);
  var distance = function(value){
    return wuzzy.jarowinkler(cleanUp(value.MovieReleaseName), searchQuery);
  }
  return results.sort(function(a, b){
    return distance(b) - distance(a);
  })[0];
}
var searchAndDownload = function(token, lang, query) {
  return new Promise(function(accept, reject){
    temp.mkdir("subtitle", function(err, dir) {
      if (err) { return reject(err); }
      opensubtitles.api.searchForTitle(token, lang, query).then(function(results){
        var match = selectBestMatch(results, query);
        if(!match) { return reject("No subtitles found"); }
        var u = url.parse(match.SubDownloadLink);
        var request = http.get({ 
            host: u.host,
            path: u.path,
            port: 80
        });

        request.on("response", function(response) {
          var newFile = path.join(dir, match.SubFileName);
          response.on("end", function(){
            accept(newFile);
          });
          var output = fs.createWriteStream(newFile);
          response.pipe(zlib.createGunzip()).pipe(output);
        });

        request.on("error", reject);
      }).fail(reject);
    });
  });
}

export default function (title, lang) {
  return new Promise(function(accept, reject){
    opensubtitles.api.login().then(function(token){
      return searchAndDownload(token, lang, title);
    }).then(accept).catch(reject);
  });
}