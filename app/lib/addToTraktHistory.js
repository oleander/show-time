import history from "./traktHistory";

export default function(episode) {
  return history(episode, "https://api-v2launch.trakt.tv/sync/history");
};