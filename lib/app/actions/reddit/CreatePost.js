var debug = require('debug')('r2s:actions:reddit:CreatePost');
var redditConfig = require('../../../../config/reddit.json');
var request = require('koa-request');
var accessToken = require('./AccessToken');
var url = require('url');

var submitURL = 'https://oauth.reddit.com/api/submit';
module.exports = function *CreatePost (options) {

  options = options || {};

  var token = yield accessToken();
  var data = {
    'api_type': 'json',
    'extension': 'json',
    'kind': 'link',
    'sr': options.subreddit,
    'r': options.subreddit,
    'title': options.title
  };

  options.text && (data.text = options.text);
  options.url && (data.url = options.url);

  var response = yield request.post(submitURL, {
    'form': data,
    'headers': {
      'Authorization': 'bearer ' + token,
      'User-Agent': 'reddit_to_spotify'
    },
    'json': true
  });

  if (response.statusCode === 201) {
    debug('post created', response);
    return response.body;
  }
  else {
    debug(response.statusCode, response.body);
    throw new Error('could not create reddit post');
  }
};