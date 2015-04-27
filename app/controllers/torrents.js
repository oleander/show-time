export default Ember.Controller.extend({
  torrentFiles: [],
  torrents: function() {
    return this.get("torrentFiles").map(function(file){
      return file.name;
    });
  }.property("torrentFiles"),
  actions: {
    play: function(torrent) {
      var foundTorrent = this.get("torrentFiles").find(function(file){
        return file.name == torrent;
      });

      if(!foundTorrent) {
        console.info("No torrent found");
        return;
      }

      foundTorrent.select();

      var totalPath = this.get("torrentEngine").path + "/" + foundTorrent.path;
      var newPath = totalPath.replace("/Users/linus/Documents/Projekt/never_again/never_again/public", "")

      var fs = nRequire('fs');
      var self = this;
      fs.stat(totalPath, function (err, stats) {
        if(err){
          fs.watchFile(totalPath, function () {
            console.log("Watcher", totalPath)
            fs.stat(totalPath, function (err, stats) {
              console.log("NOW!")
              if(!err) {
                console.log(stats.size);
                self.set("video", newPath);
                fs.unwatchFile(totalPath);
              } else {
                console.log("No size");
              }
            });
          });
        } else {
          console.log("File exists")
          self.set("video", newPath);
        }
      })


      console.info("playing", newPath)
      console.info("file", foundTorrent.file);

      // this.set("video", newPath);
    }
  }
})