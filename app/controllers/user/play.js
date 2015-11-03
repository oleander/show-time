export default Ember.Controller.extend({
  actions: {
    didCloseVideo: function(){
      this.transitionToRoute("user.index");
    },
    didChangedTime: function(time) {
      this.model.episode.markAsSeenBasedOnTime(time);
    },
    setVideoTime: function(time){
      this.model.episode.set("lengthInMs", time);
      this.model.episode.save();
    }
  }
});