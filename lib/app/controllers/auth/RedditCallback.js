var debug = require('debug')('r2s:controllers:auth:RedditCallback');
var redditConfig = require('../../../../config/reddit.json');
var request = require('koa-request');
var promisify = require('es6-promisify');
var fs = require('fs');
var writeFile = promisify(fs.writeFile);
var getMe = require('../../actions/reddit/Me');
var path = require('path');
var tokenPath = path.resolve(__dirname, '../../../../data/redditRefreshToken');

debug(tokenPath);

function postOptions () {

  var code = this.query.code;
  var clientID = redditConfig.clientID;
  var clientSecret = redditConfig.clientSecret;
  return {
    'url': 'https://www.reddit.com/api/v1/access_token',
    'form': {
      'grant_type': 'authorization_code',
      'redirect_uri': redditConfig.redirectURI,
      'code': code
    },
    'headers': {
      'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
    },
    'json': true
  };
}

module.exports = function *RedditCallback () {

  var response = yield request.post(postOptions.call(this));
  var body = response.body;
  if (response.statusCode === 200) {
    debug('exchange success', body);
    var me = yield getMe(body.access_token);
    debug(me);
    if (me.name === redditConfig.userID) {
      debug('correct user id', me.name);
      var token = body.refresh_token;
      debug('refresh token', token);
      yield writeFile(tokenPath, token, {
        'encoding': 'utf8'
      }).catch(function (err) {
        debug(err);
      });
      debug('done');
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