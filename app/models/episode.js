export default DS.Model.extend({
  show: DS.attr('string'),
  what: DS.attr('string'),
  magnet: DS.attr('string'),
  createdAt: DS.attr('date'),
  seen: DS.attr('boolean', { defaultValue: false }),
  isLoading: false,
  hasSeen: function() {
    this.set("seen", true).save();
  },
  formatCreatedAt: function() {
    var moment = nRequire("moment");
    return moment(this.get("createdAt")).format("YYYY-MM-DD HH:mm");
  }.property("createdAt"),
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