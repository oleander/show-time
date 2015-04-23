export default Ember.Route.extend({
  setupController: function(controller) {
    controller.store.find('user').then(function(users) {
      if(users.get("length") > 0){
        var user = users.get("firstObject");
        controller.set("currentUser", user);
      }
    })
  }
});