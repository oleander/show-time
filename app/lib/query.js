export default function(store, params){
  return new Promise(function(accept, reject){
    store.query("episode", params).then(function(data) {
      accept(data);
    }).catch(function() {
      accept([]);
    });
  });
}