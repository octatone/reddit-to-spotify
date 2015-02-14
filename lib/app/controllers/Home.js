var React = require('react/addons');
var HelloWorld = React.createFactory(require('../components/HelloWorld'));

module.exports = function *() {

  var reactHtml = React.renderToString(HelloWorld({
    'text': 'Hello World!'
  }));

  yield this.render('index', {
    'reactOutput': reactHtml
  });
};