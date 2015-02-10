'use strict';

var debug = require('debug')('r2s:actions:reddit:AccessToken');
var redditConfig = require('../../../../config/reddit.json');
var request = require('koa-request');
var promisify = require('es6-promisify');
var fs = require('fs');
var readFile = promisify(fs.readFile);
var path = require('path');

var tokenPath = path.resolve(__dirname, '../../../../data/redditRefreshToken');

debug(tokenPath);

function postOptions (refreshToken) {

  var clientID = redditConfig.clientID;
  var clientSecret = redditConfig.clientSecret;
  return {
    'url': 'https://www.reddit.com/api/v1/access_token',
    'form': {
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken
    },
    'headers': {
      'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
    },
    'json': true
  };
}

module.exports = function *AccessToken () {

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
};