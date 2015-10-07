import getTorrentFromEpisode from "../lib/getTorrentFromEpisode"

export default DS.Model.extend({
  show: DS.attr("string"),
  what: DS.attr("string"),
  image: DS.attr("string"),
  magnet: DS.attr("string"),
  createdAt: DS.attr("date"),
  firstAired: DS.attr("date"),
  title: DS.attr("string"),
  seen: DS.attr("boolean", { defaultValue: false }),
  removed: DS.attr("boolean", { defaultValue: false }),
  isLoading: false,
  loadingPopcorn: false,
  hasSeen: function() {
    this.set("seen", true);
    this.save();
  },
  defaultImage: function() {
    return this.get("image") || "/images/no-image.png"
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
  completeTitle: function(){
    return this.get("show") + " - " + this.get("what") + 
      " - " + this.get("title");
  }.property("show", "what", "title"),
  shortTitle: function(){
    return this.get("show") + " - " + this.get("what");
  }.property("show", "what"),
  formatCreatedAt: function() {
    var moment = nRequire("moment");
    return moment(this.get("createdAt")).format("YYYY-MM-DD HH:mm");
  }.property("createdAt"),
  formatFirstAired: function() {
    var moment = nRequire("moment");
    return moment(this.get("firstAired")).format("YYYY-MM-DD HH:mm");
  }.property("createdAt"),
  noMagnet: function() {
    return ! this.get("magnet");
  }.property("magnet"),
  loading: function(resolve, reject) {
    if(!resolve) { resolve = function() {}; }
    if(!reject) { reject = function() {}; }

    var self = this;

    if(self.get("isLoading")){ 
      return reject("Episode is already loading");
    }

    self.set("isLoading", true);

    getTorrentFromEpisode(self).then(function(magnet) {
      self.set("magnet", magnet);
      self.save();
      self.set("isLoading", false);
      resolve();
    }, function(error) {
      self.set("magnet", null);
      self.save();
      self.set("isLoading", false);
      reject(error);
    })
  }
});