'use strict';

var debug = require('debug')('r2s:controllers:auth:Reddit');
var url = require('url');
var redditConfig = require('../../../../config/reddit.json');

module.exports = function *AuthorizeWithReddit () {

  var urlOptions = {
    'protocol': 'https:',
    'hostname': 'www.reddit.com',
    'pathname': 'api/v1/authorize',
    'query': {
      'client_id': redditConfig.clientID,
      'response_type': 'code',
      'redirect_uri': redditConfig.redirectURI,
      'duration': 'permanent',
      'scope': 'submit,identity',
      'state': 'foo'
    }
  };

  var redirectUrl = url.format(urlOptions);
  debug('redirecting to', redirectUrl);
  this.redirect(redirectUrl);
};