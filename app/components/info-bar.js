export default Ember.Component.extend({
  tagName: "nav",
  classNames: ["navbar", "navbar-fixed-bottom", "navbar-light", "bg-faded", "bottom-bar"],
  didInsertElement: function() {
    $(document).on("keydown", { _self: this }, this.close);
  },
  close: function(e){
    if(e.which === 27){
      e.data._self.sendAction();
    }
  },
  willDestroyElement: function() {
    $(document).off("keydown", this.close);
  }
});