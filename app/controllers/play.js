export default Ember.Controller.extend({
  actions: {
    didCloseVideo: function(){
      this.transitionToRoute("user.index");
    },
    didChangedTime: function(time) {
      this.model.markAsSeenBasedOnTime(time);
    },
    setVideoTime: function(time){
      this.model.set("lengthInMs", time);
      this.model.save();
    }
  }
});