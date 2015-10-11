var wjs = nRequire("wcjs-player");

export default Ember.Component.extend({
  classNames: ["player-box"],
  didInsertElement: function() {
    var self = this;
    var id = this.$().attr("id");
    var player = new wjs("#player").addPlayer({ autoplay: true });
    player.addPlaylist(this.get("url"));
    player.ui(true);
    player.video(true);
    player.volume(0);

    var $close = this.$().find("#close");
    var $el = this.$().find(".wcp-toolbar");

    $close.click(function(){
      console.info("close...")
      self.sendAction("close");
    });

    // define a new observer
    var obs = new MutationObserver(function(mutations,b){
      if($el.is(":visible")) {
        $close.removeClass("hide");
      } else {
        $close.addClass("hide");
      }
    });

    obs.observe($el.get(0), {
      attributes: true,
      subtree: false
    });


    this.set("player", player);
  },
  willDestroyElement: function(){
    console.info("stop!")
    this.get("player").stop();
  }
})