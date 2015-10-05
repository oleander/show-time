import globals from "./globals";
import getJSON from "./getJSON";

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

  return getJSON(options);
}