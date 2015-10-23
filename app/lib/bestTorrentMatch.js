import User from "./user";
import bestArrayTorrentMatch from "./bestArrayTorrentMatch";

export default function(torrent){
  return bestArrayTorrentMatch([torrent])[0];
}