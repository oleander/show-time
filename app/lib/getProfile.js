var request = nRequire('request');

export default function(accessToken) {
  var apiKey = "123eaefe74369e41a98369af821d59a52c9283b20d79fead29e284ada23a1874"
  var headers = {
    "Content-Type": "application/json",
    "trakt-api-key": apiKey,
    "trakt-api-version": "2",
    "Authorization": "Bearer " + accessToken
  }

  var options = {
    url: "https://api-v2launch.trakt.tv/users/settings",
    headers: headers
  };

  return new Promise(function(resolve, reject) {
    request.get(options, function(error, response, raw){
      if(error) { return reject(error); }
      resolve(JSON.parse(raw));
    });
  });
}