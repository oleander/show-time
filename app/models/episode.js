export default DS.Model.extend({
  show: DS.attr('string'),
  what: DS.attr('string'),
  magnet: DS.attr('string'),
  seen: DS.attr('boolean', { defaultValue: false }),
  isLoading: false,
  hasSeen: function() {
    this.set("seen", true).save();
  },
  noMagnet: function() {
    return ! this.get("magnet");
  }.property('magnet'),
  loading: function() {
    var self = this;
    if(self.get("isLoading")){ return; }
    self.set("isLoading", true)
    setTimeout(function() {
      self.set("isLoading", false);
    }, Math.random() * 10000);
  },
});