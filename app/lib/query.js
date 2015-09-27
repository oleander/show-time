export default function(store, params){
  return new Promise(function(accept, reject){
    store.query("episode", params).then(function(episodes) {
      accept(episodes.sortBy("firstAired").reverse());
    }).catch(function() {
      accept([]);
    });
  });
}