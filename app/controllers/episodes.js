export default Ember.Controller.extend({
  // the initial value of the `search` property
  isTrue: true,
  search: '',
  episodes: [Ember.Object.create({show: "A"}), Ember.Object.create({ show: "B"})],

  actions: {
    click: function() {
      this.episodes.pushObject(Ember.Object.create({show: "A"}))
    },
    remove: function(obj) {
      this.episodes.removeObject(obj)
    }
  }
});