var CronJob = require('cron').CronJob;
var co = require('co');
var generatePlaylist = require('../actions/GeneratePlaylist');

var configs = [{
    'sourceReddit': 'listentothis',
    'destReddit': 'octatone'
  },{
    'sourceReddit': 'music',
    'destReddit': 'octatone'
  }
];

function weeklyJob () {

  co(function *() {

    var config;
    for (var i=0, len=configs.length; i < len; i++) {
      config = configs[i];
      yield generatePlaylist(config.sourceReddit, 'week', {
        'postToSubreddit': config.destReddit
      });
    }

    debug('weekly cron job done');
  });
}

function monthlyJob () {

  co(function *() {

    var config;
    for (var i=0, len = configs.length; i < len; i++) {
      config = configs[i];
      yield generatePlaylist(config.sourceReddit, 'month', {
        'postToSubreddit': config.destReddit
      });
    }

    debug('monthly cron job done');
  });
}

function weeklyCron () {
  // Runs every Friday at noon
  var job = new CronJob(
    '00 00 12 * * 5',
    weeklyJob,
    true,
    'America/Los_Angeles'
  );
}

function monthlyCron () {
  // Runs midnight first of every month
  var job = new CronJob(
    '00 00 00 1 * *',
    monthlyJob,
    true,
    'America/Los_Angeles'
  );
}

module.exports = {
  'init': function () {

    weeklyCron();
    monthlyCron();
  }
}