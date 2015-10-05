var forEach = function(array, callback, done = null) {
  var item = array.pop();
  if(!item) { return done && done(); }

  callback(item, function() {
    forEach(array, callback, done);
  });
};

export default forEach;