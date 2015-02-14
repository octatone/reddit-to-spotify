var React = require('react/addons');
var HelloWorld = React.createFactory(require('./components/HelloWorld'));
var mountNode = document.getElementById('react-main-mount');

React.renderComponent(new HelloWorld({
  'text': 'Hello World!'
}), mountNode);