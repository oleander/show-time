var truncate = nRequire("truncate");

export default function(episodes){
  var episode = episodes[0];
  if(episodes.length == 1) {
    return episode.get("show")  + " " + episode.get("what") +
      " was released";
  }

  return episode.get("show")  + " " + episode.get("what") + " and " +
    (episodes.length - 1) + " others";
}