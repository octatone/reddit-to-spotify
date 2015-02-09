'use strict';

var debug = require('debug')('r2s:controllers:reddit');
var topPosts = require('../actions/reddit/TopPosts');

module.exports = function *() {

  var posts = yield topPosts('listentothis', 'week');

  yield this.render("index", {
    title: "Test Page",
    name: "World"
  });
};