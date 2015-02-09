'use strict';

var debug = require('debug')('r2s:controllers:auth:Spotify');
var url = require('url');
var spotifyConfig = require(process.cwd() + '/config/spotify.json');

module.exports = function *AuthorizeWithSpotify () {

  var urlOptions = {
    'protocol': 'https:',
    'hostname': 'accounts.spotify.com',
    'pathname': 'authorize',
    'query': {
      'client_id': spotifyConfig.clientID,
      'response_type': 'code',
      'redirect_uri': spotifyConfig.redirectURI,
      'scope': 'playlist-modify-public playlist-modify-private'
    }
  };

  var redirectUrl = url.format(urlOptions);
  debug('redirecting to', redirectUrl);
  this.redirect(redirectUrl);
};