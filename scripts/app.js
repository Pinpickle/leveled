var React = require('react');
var Layer = require('./layer');

var App = React.createClass({
  render: function () {
    
    var layerNodes = this.props.layers.map(function (layer) {
      return (
        <Layer />
      );
    });

    return (
      <div>
        <h1>Hello World!</h1>
        {layerNodes}
      </div>
    );
  }
});

React.render(<App layers={[1, 2, 3]} />, document.body);
