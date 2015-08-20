var React = require('react');
var Layer = require('./layer');
var _ = require('lodash');

var GridOverlay = React.createClass({
  getDefaultProps: function () {
    return {
      gridSize: 24
    }
  },

  render: function () {
    var col = 'rgba(0, 0, 0, 0.1)';
    var gridline = col + ' 0px,' + col + ' 1px, transparent 1px, transparent ' + this.props.gridSize + 'px';
    // @gridline-col 0px, @gridline-col 1px, transparent 1px, transparent 25px)

    var style = {
      backgroundSize: this.props.gridSize + 'px ' + this.props.gridSize + 'px',
      backgroundImage: 'linear-gradient(0deg, ' + gridline + '), ' +
        'linear-gradient(90deg, ' + gridline + ')'
    }
    return (
      <div className="grid-overlay" ref="gridOverlayElement" style={style}></div>
    );
  }
});

var PreviewPane = module.exports = React.createClass({
  render: function () {
    var layerNodes = [];

    _.forOwn(this.props.globalData.layers, function (layer, name) {
      layerNodes.push((
        <Layer key={name} />
      ));
    });

    return (
      <div className="preview-pane">
        <p>Preview Pane</p>
        <GridOverlay gridSize={this.props.globalData.gridSize}/>
        {layerNodes}
      </div>
    );
  }
});
