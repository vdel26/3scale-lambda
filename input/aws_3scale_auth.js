var threescale = require('3scale');
var Client = threescale.Client;
var client = new Client("PROVIDER_KEY");

var authenticate = function (user_key, callback) {
  client.authrep_with_user_key({"user_key": user_key, "usage": { "hits": 1 } }, function (resp) {
    if (resp.is_success()) {
      callback(null, resp.is_success());
    } else {
      callback("403, unauthorized");
    }
  });
};

exports.handler = function(event, context) {
  if (event.user_key) {
    authenticate(event.user_key, function (err,res) {
      if (err) {
        context.fail(err);
      } else {
        context.succeed(true);
      }
    });
  } else {
    context.fail("user_key missing")
  }
};

