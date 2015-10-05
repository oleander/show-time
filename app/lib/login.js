import globals from "./globals";
import postJSON from "./postJSON";

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
    postJSON(options).then(function(result){
      if(result["access_token"]) {
        resolve(result);
      } else {
        reject(result);
      }
    }).catch(reject);
  });
}