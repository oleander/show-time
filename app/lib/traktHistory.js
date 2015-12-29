import globals from "./globals";
import postJSON from "./postJSON";
import User from "./user";

export default function(episode, url) {
  return (new User()).getAccessToken().then(function(token){
    var headers = {
       "trakt-api-version": 2,
       "trakt-api-key": globals.getClientID(),
       "Authorization": "Bearer " + token,
       "Content-Type": "application/json"
    }

    var options = {
      url: url,
      headers: headers,
      body: JSON.stringify({
        episodes: [{
          ids: {
            trakt: episode.get("traktID").toString()
          }
        }]
      })
    };

    return postJSON(options);
  });
};