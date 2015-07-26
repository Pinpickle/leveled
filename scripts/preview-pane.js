var React = require('react');
var Layer = require('./layer');

var PreviewPane = module.exports = React.createClass({
  render: function () {
    var layerNodes = this.props.layers.map(function (layer) {
      return (
        <Layer />
      );
    });

    return (
      <div className="preview-pane">
        <p>Preview Pane</p>
        {layerNodes}
      </div>
    );
  }
})
