export default Ember.Route.extend({
  setupController: function(controller) {
    var torrentStream = nRequire('torrent-stream');
    var magnet = 'magnet:?xt=urn:btih:252a3bb2fe0733b8d9340649272eebb52760e457&dn=Better+Call+Saul+S01E04+HDTV+x264-LOL+%5Beztv%5D&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
    var engine = torrentStream(magnet, {
      "tmp": "/Users/linus/Documents/Projekt/never_again/never_again/public" // __dirname + "../../public"
    });

    engine.on("ready", function() {
      controller.set("torrentEngine", engine);
      controller.set("torrentFiles", engine.files);
    });
  }
});