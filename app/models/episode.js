export default EPDB.Model.extend({
  show: DS.attr('string'),
  episode: DS.attr('string'),
  serialize: function(){
    return this.getProperties(['episode','show']);
  }
});