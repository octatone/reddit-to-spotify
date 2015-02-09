var debug = require('debug')('r2s:actions:spotify:Search');
var spotifyConfig = require(process.cwd() + '/config/spotify.json');
var request = require('koa-request');
var url = require('url');
var accessToken = require('./AccessToken');

// https://api.spotify.com/v1/search


function searchURL (artist, title) {

  var options = {
    'protocol': 'https:',
    'hostname': 'api.spotify.com',
    'pathname': '/v1/search',
    'query': {
      'q': 'title:' + title + ' ' + 'artist:' + artist,
      'type': 'track',
      'limit': 1
    }
  };

  return url.format(options);
}

module.exports = function *Search (artist, title) {

  var token = yield accessToken();
  var response = yield request.get(searchURL(artist, title), {
    'headers': {
      'Authorization': 'Bearer ' + token
    },
    'json': true
  });

  if (response.statusCode === 200) {
    return response.body.tracks.items[0];
  }
  else {
    debug(response.statusCode, response.body);
    throw new Error('could not fetch search results from spotify');
  }
};