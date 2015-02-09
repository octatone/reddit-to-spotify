var debug = require('debug')('r2s:actions:spotify:CreatePlaylist');
var spotifyConfig = require(process.cwd() + '/config/spotify.json');
var request = require('koa-request');
var accessToken = require('./AccessToken');

// POST https://api.spotify.com/v1/users/{user_id}/playlists

module.exports = function *CreatePlaylist (name) {

  var token = yield accessToken();
  var url = 'https://api.spotify.com/v1/users/' + spotifyConfig.userID + '/playlists';
  var response = yield request.post(url, {
    'json': {
      'name': name,
      'public': false
    },
    'headers': {
      'Authorization': 'Bearer ' + token
    }
  });

  if (response.statusCode === 201) {
    return response.body;
  }
  else {
    debug(response.statusCode, response.body);
    throw new Error('could not fetch search results from spotify');
  }
};