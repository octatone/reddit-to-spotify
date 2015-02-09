'use strict';

var debug = require('debug')('r2s:controllers:GeneratePlaylist');
var topPosts = require('./reddit/TopPosts');
var spotifySearch = require('./spotify/Search');
var createPlaylist = require('./spotify/CreatePlaylist');
var updatePlaylist = require('./spotify/UpdatePlaylist');
var moment = require('moment');

module.exports = function *(subreddit, duration) {

  var trackData = yield topPosts(subreddit, duration);
  var uris = [];
  var item, searchResult;

  for (var i=0, len=trackData.length; i<len; i++) {
    item = trackData[i];
    searchResult = yield spotifySearch(item.artist, item.title);
    searchResult && uris.push(searchResult.uri);
  }

  debug('tracks found on spotify', uris);

  var playlist = yield createPlaylist('/r/' + subreddit + ' top ' + duration + ' ' + moment().format('ll'));

  debug('playlist ' + playlist.id + ' created');

  yield updatePlaylist(playlist.id, uris);

  debug('playlist ' + playlist.id + ' updated');
};