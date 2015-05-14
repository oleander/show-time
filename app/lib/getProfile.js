var request = nRequire('request');
import globals from "./globals";

export default function(accessToken) {
  var headers = {
    "Content-Type": "application/json",
    "trakt-api-key": globals.getClientID(),
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