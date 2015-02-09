var debug = require('debug')('r2s:actions:spotify:Me');
var spotifyConfig = require(process.cwd() + '/config/spotify.json');
var request = require('koa-request');
var accessToken = require('./AccessToken');

var url = 'https://api.spotify.com/v1/me'

module.exports = function *Me () {

  var token = yield accessToken();
  var response = yield request.get(url, {
    'headers': {
      'Authorization': 'Bearer ' + token
    },
    'json': true
  });

  if (response.statusCode === 200) {
    return response.body;
  }
  else {
    debug(response.statusCode, response.body);
    throw new Error('could not fetch /me from spotify');
  }
};