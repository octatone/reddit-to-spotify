'use strict';

var debug = require('debug')('r2s:app');
var koa = require('koa');
var route = require('koa-route');
var handlebars = require('koa-handlebars');
var co = require('co');
var CronJob = require('cron').CronJob;

var requireDir = require('require-directory');
var controllers = requireDir(module, './controllers');
var middlewares = requireDir(module, './middlewares');
var generatePlaylist = require('./actions/GeneratePlaylist');

var app = module.exports = koa();
app.poweredBy = false;
app.proxy = true;

app.use(handlebars({
  root: './lib/app',
  defaultLayout: 'main'
}));

app.use(route.get('/', controllers.Home))
app.use(route.get('/auth', controllers.auth.Spotify));
app.use(route.get('/callback/spotify', controllers.auth.SpotifyCallback));
app.use(route.get('/reddit', controllers.reddit));

var port = parseInt(process.env.PORT, 10) || 8888;
!module.parent && app.listen(port, function () {
  debug('server started on http://0.0.0.0:' + port);
});

var job = new CronJob('00 00 12 * * 5', function () {
    // Runs every Friday at noon
    co(function *() {
      yield generatePlaylist('listentothis', 'week');
      yield generatePlaylist('music', 'week');
      debug('weekly cron job done');
    });
  }, function () {
    debug('cron job done');
  },
  true,
  'America/Los_Angeles'
);