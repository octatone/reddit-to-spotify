'uses strict';

var debug = require('debug')('r2s:actions:reddit:TopPosts');
var url = require('url');
var request = require('koa-request');

var titlePattern = /^[^\[]+(-|--)[^\[]+(?=\[)/;

function redditURL (subreddit, duration) {

  var options = {
    'protocol': 'http:',
    'hostname': 'www.reddit.com',
    'pathname': 'r/' + subreddit + '/top/.json',
    'query': {
      'sort': 'top',
      't': duration,
      'limit': 100
    }
  };

  return url.format(options);
}

module.exports = function *TopPosts (subreddit, duration) {

  var requestURL = redditURL(subreddit, duration);

  var response = yield request.get(requestURL, {
    'json': true
  });

  var posts = response.body.data.children
  debug('with self posts', posts.length);
  posts = posts.filter(function (post) {
    return !post.data.is_self
  });
  debug('without self posts', posts.length);

  var titles = posts.map(function (post) {
    return post.data.title;
  });

  debug('titles before filtering', titles.length);
  titles = titles.filter(function (title) {
    return titlePattern.test(title);
  });
  debug('titles after filtering', titles.length);

  // normalize dashes, and remove cruft
  titles = titles.map(function (title) {

    title = title.replace('--', '-');
    title = title.replace(/\[(.+)/, '');
    title = title.trim();
    return title;
  });

  titles.forEach(function (title) {
    debug(title);
  });

  var data = titles.map(function (title) {
    var parts = title.split('-');
    return {
      'artist': parts[0].trim(),
      'title': parts[1].trim()
    };
  });

  debug(data);

  return data;
};