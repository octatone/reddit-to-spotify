var debug = require('debug')('r2s:actions:spotify:AccessToken');
var dir = process.cwd();
var spotifyConfig = require(dir + '/config/spotify.json');
var request = require('koa-request');
var thunkify = require('thunkify');
var fs = require('fs');
var readFile = thunkify(fs.readFile);

function postOptions (refreshToken) {

  var clientID = spotifyConfig.clientID;
  var clientSecret = spotifyConfig.clientSecret;
  return {
    'url': 'https://accounts.spotify.com/api/token',
    'form': {
      'grant_type': 'refresh_token',
      'redirect_uri': spotifyConfig.redirectURI,
      'refresh_token': refreshToken
    },
    'headers': {
      'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
    },
    'json': true
  };
}

module.exports = function *AccessToken () {

  var refreshToken = yield readFile(dir + '/data/refreshToken', {
    'encoding': 'utf8'
  });

  var response = yield request.post(postOptions(refreshToken));

  if (response.statusCode === 200) {
    var accessToken = response.body.access_token;
    debug('access token', accessToken);
    return accessToken;
  }
  else {
    debug(response.statusCode, response.body);
    throw new Error('no access token');
  }
};