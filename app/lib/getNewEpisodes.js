var request = nRequire("request");
var zpad    = nRequire("zpad");
var util    = nRequire("util")
var moment  = nRequire("moment");

import globals from "./globals";
import getJSON from "./getJSON";

export default function(accessToken) {
  var headers = {
    "Content-Type": "application/json",
    "trakt-api-key": globals.getClientID(),
    "trakt-api-version": "2",
    "Authorization": "Bearer " + accessToken
  }

  var days = 30;
  var date = new Date();
  date.setDate(date.getDate() - days);
  var printableDate = moment(date).format("YYYY-MM-DD");

  var options = {
    url: "https://api-v2launch.trakt.tv/calendars/my/shows/" + printableDate + "/" + (days + 1) + "?extended=images",
    headers: headers
  };

  var getImage = function(episode) {
    try {
      return episode.images.screenshot.thumb
    } catch(e) {
      throw e;
    }
  };
  
  return new Promise(function(resolve, reject){
    getJSON(options).then(function(json){
      var episodes = [];
      json.forEach(function(data) {
        var episode = data["episode"];
        var firstAired = data["first_aired"];
        var title = episode["title"];
        var season = zpad(episode["season"], 2);
        var number = zpad(episode["number"], 2);
        var show = data["show"]["title"];

        if(season === "00" || number === "00") { return; }

        episodes.push({
          "show": show,
          "what": util.format("s%se%s", season, number),
          "title": title,
          "firstAired": new Date(firstAired),
          "image": getImage(episode)
        });
      });
      resolve(episodes);
    }).catch(reject);
  });
}