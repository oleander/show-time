var kickass = nRequire("kickass-torrent");

export default DS.Model.extend({
  show: DS.attr("string"),
  what: DS.attr("string"),
  magnet: DS.attr("string"),
  createdAt: DS.attr("date"),
  firstAired: DS.attr("date"),
  title: DS.attr("string"),
  seen: DS.attr("boolean", { defaultValue: false }),
  removed: DS.attr("boolean", { defaultValue: false }),
  isLoading: false,
  loadingPopcorn: false,
  hasSeen: function() {
    this.set("seen", true).save();
  },
  isRemoved: function() {
    this.set("removed", true).save();
  },
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

    var searchTorrent = function(query, cb) {
      kickass({
        q: query,
        field:"seeders",
        order:"desc",
        url: "http://kat.cr",
      }, function(e, data){
        if(e || !data.list.length) {
          cb(null);
        } else {
          cb(data.list[0].torrentLink);
        }
      });
    };

    searchTorrent(self.get("show") + " " + self.get("what"), function(magnet){
      if(magnet){
        self.set("magnet", magnet);
        self.save()
      }
      self.set("isLoading", false);
      resolve();
    });
  },
});