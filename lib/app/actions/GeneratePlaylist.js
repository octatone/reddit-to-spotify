'use strict';

var debug = require('debug')('r2s:controllers:GeneratePlaylist');
var topPosts = require('./reddit/TopPosts');
var spotifySearch = require('./spotify/Search');
var createPlaylist = require('./spotify/CreatePlaylist');
var updatePlaylist = require('./spotify/UpdatePlaylist');
var createRedditPost = require('./reddit/CreatePost');
var moment = require('moment');

module.exports = function *(subreddit, duration, options) {

  options = options || {};

  var trackData = yield topPosts(subreddit, duration);
  var uris = [];
  var item, searchResult;

  for (var i=0, len=trackData.length; i<len; i++) {
    item = trackData[i];
    searchResult = yield spotifySearch(item.artist, item.title);
    searchResult && uris.push(searchResult.uri);
  }

  var playlistTitle = '/r/' + subreddit + ' playlist for the ' + duration + ' ending ' + moment().format('ll');

  debug('tracks found on spotify', uris);

  var playlist = yield createPlaylist(playlistTitle);

  debug('playlist ' + playlist.id + ' created');

  yield updatePlaylist(playlist.id, uris);

  debug('playlist ' + playlist.id + ' updated');

  if (options.postToSubreddit) {
    debug('posting to reddit ...');
    var redditTitle = '/r/' + subreddit + ' spotify playlist for the ' + duration + ' ending ' + moment().format('ll');
    yield createRedditPost({
      'subreddit': options.postToSubreddit,
      'title': redditTitle,
      'url': playlist.external_urls.spotify
    });
  }
};