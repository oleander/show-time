import openPopcornTime from "../lib/openPopcornTime"

export default Ember.Controller.extend({
  episodes: [],
  needs: ["application"],
  currentUser: function() {
    return this.get('controllers.application.currentUser');
  }.property('controllers.application.currentUser'),
  deactivateUpdateAll: function() {
    return this.get('controllers.application.deactivateUpdateAll');
  }.property('controllers.application.deactivateUpdateAll'),
  actions: {
    remove: function(obj) {
      this.episodes.removeObject(obj);
      obj.isRemoved();
    },
    seen: function(obj) {
      obj.hasSeen();
      this.episodes.removeObject(obj)
    },
    reload: function(obj) {
      obj.loading();
    },
    download: function(obj) {
      nRequire("shell").openExternal(obj.get("magnet"))
    },
    updateAll: function(){
      this.get("controllers.application").send("updateAll");
    },
    playInPopcornTime: function(obj) {
      var self = this;
      obj.set("loadingPopcorn", true);
      openPopcornTime(obj).then(function(message){
        self.get("controllers.application").set("successMessage", message)
        obj.set("loadingPopcorn", false);
      }, function(err) {
        self.get("controllers.application").set("errorMessage", err)
        obj.set("loadingPopcorn", false);
      })
    }
  }
});