var debug = require('debug')('r2s:actions:spotify:UpdatePlaylist');
var spotifyConfig = require('../../../../config/spotify.json');
var request = require('koa-request');
var accessToken = require('./AccessToken');

// https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks

module.exports = function *CreatePlaylist (id, uris) {

  var token = yield accessToken();
  var url = 'https://api.spotify.com/v1/users/' + spotifyConfig.userID + '/playlists';
  url = url + '/' + id + '/tracks';
  var response = yield request.post(url, {
    'json': {
      'uris': uris
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