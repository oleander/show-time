export default DS.Model.extend({
  show: DS.attr('string'),
  what: DS.attr('string'),
  magnet: DS.attr('string'),
  isLoading: false,
  noMagnet: function() {
    return ! this.get("magnet");
  }.property('magnet'),
  loading: function() {
    var self = this;
    self.set("isLoading", ! self.get("isLoading"))
    setTimeout(function() {
      self.set("isLoading", ! self.get("isLoading"))
    }, Math.random() * 10000);
  },
});