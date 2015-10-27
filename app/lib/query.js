export default function(store, params){
  return store.query("episode", params).then(function(episodes) {
    return episodes.sortBy("firstAired").reverse();
  });
}