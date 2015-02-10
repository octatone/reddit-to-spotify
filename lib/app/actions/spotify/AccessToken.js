'use strict';

var debug = require('debug')('r2s:actions:spotify:AccessToken');
var spotifyConfig = require('../../../../config/spotify.json');
var request = require('koa-request');
var promisify = require('es6-promisify');
var fs = require('fs');
var readFile = promisify(fs.readFile);
var path = require('path');
var tokenPath = path.resolve(__dirname, '../../../../data/spotifyRefreshToken');
var oneMinute = 60000;

var lastAccessToken;
var lastFetchTime;

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

function *getNewToken () {

  var refreshToken = yield readFile(tokenPath, {
    'encoding': 'utf8'
  }).catch(function (err) {
    debug(err);
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
}

function shouldGetNew () {

  if (lastFetchTime === undefined) {
    return true;
  }
  else {
    return (Date.now() - lastFetchTime) > oneMinute;
  }
}

module.exports = function *AccessToken () {

  var token;

  if (shouldGetNew()) {
    debug('fetching new token');
    token = lastAccessToken = yield getNewToken();
    lastFetchTime = Date.now();
  }
  else {
    debug('using cached token', lastAccessToken);
    token = lastAccessToken;
  }

  return token;
};