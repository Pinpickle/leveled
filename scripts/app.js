var React = require('react');

var App = React.createClass({
  render: function () {
    return (<h1>Hello World!</h1>);
  }
});

React.render(<App />, document.body);
