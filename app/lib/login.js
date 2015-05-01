var request = nRequire('request');

export default function(token) {
  var data = {
     "code": token,
     "client_id": "123eaefe74369e41a98369af821d59a52c9283b20d79fead29e284ada23a1874",
     "client_secret": "d56b08ccf707fff156b8993d520c0e851c0e7ff18386a394aa6d10ed285b2a20",
     "redirect_uri": "urn:ietf:wg:oauth:2.0:oob",
     "grant_type": "authorization_code"
  }

  var headers = {
    "Content-Type": "application/json",
  }

  var options = {
    url: "https://api-v2launch.trakt.tv/oauth/token",
    headers: headers,
    form: data
  };

  return new Promise(function(resolve, reject) {
    request.post(options, function(error, response, raw){
      if(error) { reject(error) }
      var body = JSON.parse(raw);
      if(body["access_token"]) {
        resolve(body);
      } else {
        reject(body);
      }
    });
  });
}