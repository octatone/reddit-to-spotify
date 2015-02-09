var debug = require('debug')('r2s:controllers:auth:SpotifyCallback');
var dir = process.cwd();
var spotifyConfig = require(dir + '/config/spotify.json');
var request = require('koa-request');
var thunkify = require('thunkify');
var fs = require('fs');
var writeFile = thunkify(fs.writeFile);
var getMe = require(dir + '/lib/app/actions/spotify/Me');

var spotifyAPI = 'https://api.spotify.com/v1';

function postOptions () {

  var code = this.query.code;
  var clientID = spotifyConfig.clientID;
  var clientSecret = spotifyConfig.clientSecret;
  return {
    'url': 'https://accounts.spotify.com/api/token',
    'form': {
      'grant_type': 'authorization_code',
      'redirect_uri': spotifyConfig.redirectURI,
      'code': code
    },
    'headers': {
      'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
    },
    'json': true
  };
}

module.exports = function *SpotifyCallback () {

  var response = yield request.post(postOptions.call(this));
  if (response.statusCode === 200) {
    debug('exchange success');
    var me = yield getMe();
    if (me.id === spotifyConfig.userID) {
      debug('correct user id', me.id);
      var token = response.body.refresh_token;
      yield writeFile(dir + '/data/refreshToken', token, {
        'encoding': 'utf8'
      });
    }
    else {
      throw new Error('you are not me');
    }
  }
  else {
    debug('exchange failed');
    debug(response.statusCode, response.body);
  }
};