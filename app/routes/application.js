export default Ember.Route.extend({
  model: function(){
    var self = this;
    return new Promise(function(resolve, reject) {
      self.store.find("user").then(function(users){
        resolve(users.get("firstObject"))
      }, reject);
    })
  }
});

