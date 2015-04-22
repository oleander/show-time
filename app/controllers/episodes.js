export default Ember.Controller.extend({
  episodes: [],
  isReloading: false,
  isUpdating: false,
  actions: {
    remove: function(obj) {
      this.episodes.removeObject(obj);
      obj.deleteRecord();
      obj.save();
    },
    seen: function(obj) {
      obj.hasSeen();
      this.episodes.removeObject(obj)
    },
    reload: function(obj) {
      obj.loading();
    },
    reloadAll: function() {
      var self = this;
      self.set("isReloading", true);
      var promises = this.episodes.map(function(episode) {
        return new Promise(function(resolve) {
          episode.loading(resolve);
        });
      });

      Promise.all(promises).then(function(){
        self.set("isReloading", false);
      });
    },
    download: function(obj) {
      nRequire('shell').openExternal(obj.get("magnet"))
    },
    updateAll: function() {
      this.set("isUpdating", true);
      var store = this.store;
      var self = this;
      getNewEpisodes(function(episodes) {
        self.set("isUpdating", false);
        episodes.forEach(function(episode) {
          var res = store.find("episode", {
            show: episode.show,
            what: episode.what
          })

          setTimeout(function(){
            if(res.get("length") > 0) { return; }
            if(episode.firstAired > new Date()) { return; }

            var record = store.createRecord('episode', {
              show: episode.show,
              what: episode.what,
              magnet: null,
              title: episode.title,
              createdAt: new Date(),
              seen: false,
              firstAired: episode.firstAired
            });

            record.save();
            self.episodes.unshiftObject(record);
            record.loading();
          }, 1000);
        })
      })
    }
  }
});


var getNewEpisodes = function(callback) {
  var request = nRequire('request');
  var _ = nRequire('underscore');
  var zpad = nRequire('zpad');
  var util = nRequire('util')
  var moment = nRequire("moment");

  var access_token = "c89ad7e48248156a18bad053b5b0eb15debddc3560005c9888ccd4e9e62add54"
  var refresh_token = "26a5d6d6d7a8a0e825626d9ce51435140d6c6b2d3334f08f975f43add03aab82"

  var headers = {
    "Content-Type": "application/json",
    "trakt-api-key": "123eaefe74369e41a98369af821d59a52c9283b20d79fead29e284ada23a1874",
    "trakt-api-version": "2",
    "Authorization": "Bearer c89ad7e48248156a18bad053b5b0eb15debddc3560005c9888ccd4e9e62add54"
  }

  var days = 7;
  var date = new Date();
  date.setDate(date.getDate() - days);
  var printableDate = moment(date).format("YYYY-MM-DD");

  var options = {
    url: "https://api-v2launch.trakt.tv/calendars/my/shows/" + printableDate + "/" + days,
    headers: headers
  };

  request(options, function(error, response, body){
    var raw = JSON.parse(body);
    var episodes = _.map(raw, function(data) {
      var episode = data["episode"];
      var firstAired = data["first_aired"];
      var title = episode["title"];
      var season = zpad(episode["season"], 2);
      var number = zpad(episode["number"], 2);
      var show = data["show"]["title"];
      return {
        "show": show,
        "what": util.format('s%se%s', season, number),
        "title": title,
        "firstAired": new Date(firstAired)
      }
    });

    callback(episodes)
  });
}
