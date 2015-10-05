var request = nRequire("request");
import retryWithBackoff from "ember-backoff/retry-with-backoff";

// TODO: Refactor
export default function(options) {
  return retryWithBackoff(function(abort){
    return new Promise(function(resolve, reject) {
      request.post(options, function(error, response, body){
        if(error) { return reject(error); }
        if(response.statusCode >= 400 && response.statusCode < 500) { 
          return abort(response.statusCode);
        }
        if(response.statusCode > 320) { return reject(response); }

        try {
          resolve(JSON.parse(body));
        } catch(e) {
          reject(e);
        }
      });
    });
  }, 10, 100);
}