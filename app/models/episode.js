import getTorrentFromEpisode from "../lib/getTorrentFromEpisode"
var moment = nRequire("moment");
import forEach from "../lib/forEach";
import bestArrayTorrentMatch from "../lib/bestArrayTorrentMatch";

export default DS.Model.extend({
  show: DS.attr("string"),
  what: DS.attr("string"),
  lengthInMs: DS.attr("number"),
  seenInMs: DS.attr("number"),
  seenInSec: function () {
    if(!this.get("seenInMs")) {
      return 0;
    }
    return this.get("seenInMs") / 1000;
  }.property("seenInMs"),
  image: DS.attr("string"),
  magnets: DS.hasMany("magnet", { async: true }),
  createdAt: DS.attr("date"),
  firstAired: DS.attr("date"),
  title: DS.attr("string"),
  seen: DS.attr("boolean", { defaultValue: false }),
  removed: DS.attr("boolean", { defaultValue: false }),
  isLoading: false,
  loadingPopcorn: false,
  validMagnet: function(){
    return bestArrayTorrentMatch(this.get("magnets")).
      sortBy("seeders").reverse()[0];
  }.property("magnets.[]"),
  hasValidMagnet: function(){
    return !! this.get("validMagnet");
  }.property("magnets.[]"),
  magnet: function(){
    if(this.get("hasValidMagnet")) return this.get("validMagnet").get("href");
  }.property("magnets.[]"),
  magnetTitle: function(){
    if(this.get("hasValidMagnet")) return this.get("validMagnet").get("title");
  }.property("magnets.[]"),
  hasSeen: function() {
    this.set("seen", true);
    this.save();
  },
  restore: function(){
    this.set("seen", false);
    this.set("removed", false);
    this.save();
  },
  isStarted: function(){
    return this.get("seenInPercent") !== 0;
  }.property("seenInMs"),
  seenInPercent: function(){
    if(!this.get("seenInMs") || !this.get("lengthInMs")) { return 0; }
    return Math.round((this.get("seenInMs") / this.get("lengthInMs")) * 100);
  }.property("lengthInMs", "seenInMs"),
  markAsSeenBasedOnTime: function(time){
    this.set("seenInMs", time);
    if(this.get("lengthInMs")) {
      if ((this.get("seenInMs") + 10000) >= this.get("lengthInMs")) {
        this.set("seen", true);
      }
    }
    this.save();
  },
  defaultImage: function() {
    return this.get("image") || "images/no-image.png"
  }.property("image"),
  isOlderThenDays: function(days) {
    var now = new Date().getTime();
    var expires = this.get("createdAt").getTime() +
      (days * 24 * 60 * 60 * 1000);
    return expires <= now;
  },
  isRemoved: function() {
    this.set("removed", true);
    this.save();
  },
  isNotVisible: function() {
    return this.get("removed") || this.get("seen");
  }.property("seen", "removed"),
  isNotPlayable: function(){
    return (! this.get("magnet") || this.get("isNotVisible"));
  }.property("magnet"),
  completeTitle: function(){
    return this.get("show") + " - " + this.get("what") +
      " - " + this.get("title");
  }.property("show", "what", "title"),
  shortTitle: function(){
    return this.get("show") + " - " + this.get("what");
  }.property("show", "what"),
  formatCreatedAt: function() {
    return moment(this.get("createdAt")).format("YYYY-MM-DD HH:mm");
  }.property("createdAt"),
  formatFirstAired: function() {
    return moment(this.get("firstAired")).format("YYYY-MM-DD HH:mm");
  }.property("createdAt"),
  noMagnet: function() {
    return ! this.get("magnet");
  }.property("magnet"),
  noMagnets: function(){
    return ! this.get("magnets").length;
  }.property("magnets"),
  doesHaveMagnet: function(href){
    var self = this;
    return new Em.RSVP.Promise(function(accept, reject){
      var found = self.get("magnets").find(function(magnet){
        return magnet.get("href") == href;
      });

      found ? accept(found) : reject("Nothing found");
    });
  },
  loading: function(resolve, reject) {
    if(!resolve) { resolve = function() {}; }
    if(!reject) { reject = function() {}; }

    var self = this;

    if(self.get("isLoading")){
      return reject("Episode is already loading");
    }

    self.set("isLoading", true);

    var createMagnet = function(torrent, done){
      self.get("magnets").createRecord({
        href: torrent.href,
        seeders: torrent.seeders,
        title: torrent.title
      }).save().finally(done);
    }

    getTorrentFromEpisode(self).then(function(torrents) {
      forEach(torrents || [], function(torrent, next){
        self.doesHaveMagnet(torrent.href).then(function(found){
          found.setProperties({
            title: torrent.title,
            seeders: torrent.seeders
          })

          found.save(function(){
            self.save().then(next);
          });
        }).catch(function(err){
          console.info("err", err)
          createMagnet(torrent, next);
        }).finally(next);
      }, function(){
        self.save().then(function(){
          self.set("isLoading", false);
          resolve();
        })
      });
    }, function(error) {
      self.set("isLoading", false);
      reject(error);
    });
  }
});