/** @jsx React.DOM */

var React = require('react/addons');
var HelloWord = React.createClass({

  'type': 'div',

  'render': function () {
    return (
      <h2>{this.props.text}</h2>
    );
  }
});

module.exports = HelloWord;