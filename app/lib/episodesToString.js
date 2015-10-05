export default function(episodes){
  var episode = episodes[0];
  if(!episode) {
    throw "no episodes passed";
  }

  if(episodes.length == 1) {
    return episode.get("show")  + " " + episode.get("what") +
      " was released";
  }

  if(episodes.length == 2) {
    return episode.get("show")  + " " + episode.get("what") + 
      " and one other";
  }

  return episode.get("show")  + " " + episode.get("what") + " and " +
    (episodes.length - 1) + " others";
}