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

  var json = response.body && response.body.json;

  if (response.statusCode === 200 && json && json.errors.length === 0) {
    debug('post created', response.body);
    return response.body;
  }
  else {
    debug('post not created', response.statusCode, response.body);
    return response.body;
  }
};