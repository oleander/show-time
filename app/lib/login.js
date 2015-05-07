import globals from "./globals";
var request = nRequire('request');

export default function(token) {
  var data = {
     "code": token,
     "client_id": globals.getClientID(),
     "client_secret": globals.getClientSecret(),
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