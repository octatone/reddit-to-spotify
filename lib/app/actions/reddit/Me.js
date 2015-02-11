var debug = require('debug')('r2s:actions:reddit:Me');
var request = require('koa-request');
var accessToken = require('./AccessToken');

var url = 'https://oauth.reddit.com/api/v1/me'

module.exports = function *Me (localToken) {

  var token
  if (localToken){
    token = localToken;
  }
  else {
    token = yield accessToken();
  }

  debug('token', localToken);

  var response = yield request.get(url, {
    'headers': {
      'Authorization': 'bearer '  + token,
      'User-Agent': 'reddit_to_spotify'
    },
    'json': true
  });

  if (response.statusCode === 200) {
    debug(response.body);
    return response.body;
  }
  else {
    debug(response.statusCode, response.body);
    throw new Error('could not fetch /me from reddit');
  }
};