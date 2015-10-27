import User from "./user";
var user = new User();

export default function(magnets){
  var includes = [];
  var excludes = [];
  var exclude = user.get("exclude");
  if(exclude && exclude.length) {
    excludes = exclude.split(",");
  }
  var include = user.get("include");
  if(include && include.length) {
    includes = include.split(",");
  }

  magnets.filter(function(magnet){
    var excludeOK = true;
    if(excludes.length) {
      excludeOK = ! excludes.any(function(exclude){
        return new RegExp(exclude.trim(), "i").test(magnet.get("title"));
      });
    }
    
    var includeOK = true;
    if(includes.length) {
      var includeOK = includes.every(function(include){
        return new RegExp(include.trim(), "i").test(magnet.get("title"));
      });
    }

    return includeOK && excludeOK;
  });

  return magnets;
}