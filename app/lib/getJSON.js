import retryWithBackoff from "ember-backoff/retry-with-backoff";
var request = nRequire("request");

export default function(options) {
  return retryWithBackoff(function(abort){
    return new Promise(function(resolve, reject) {
      request(options, function(error, response, body){
        if(error) { return reject(error); }
        if(response.statusCode >= 400 && response.statusCode < 500) { 
          return abort(response.statusCode);
        }
        if(response.statusCode > 299) { return reject(response); }

        try {
          resolve(JSON.parse(body));
        } catch(e) {
          reject(e);
        }
      });
    });
  }, 10, 100);
}