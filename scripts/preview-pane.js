var React = require('react');
var Layer = require('./layer');
var _ = require('lodash');
var levelData = require('./level-data');
var cx = require('classnames');
var jQuery = require('jquery');

var GridOverlay = React.createClass({
  getInitialState: function () {
    return {
      popup: {
        active: false,
        x: 0,
        y: 0
      }
    };
  },

  componentDidMount: function () {
    this.DOMNode = React.findDOMNode(this.refs.gridOverlayElement);
  },

  setPopupPosition: function (e) {
    var offset = jQuery(this.DOMNode).offset();
    var top = offset.top;
    var left = offset.left;

    // console.log(top, left);

    this.setState({
      popup: {
        active: true,
        x: e.pageX - left,
        y: e.pageY - top
      }
    });
  },

  onMouseLeave: function (e) {
    this.setState({
      popup: {
        active: false,
        x: this.state.popup.x,
        y: this.state.popup.y
      }
    });
  },

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

    var popup = this.state.popup;
    var gridX = Math.floor(popup.x / this.props.gridSize);
    var gridY = Math.floor(popup.y / this.props.gridSize);

    var popupClasses = cx({
      'grid-overlay-popup': true,
      'grid-overlay-popup-active': popup.active
    });

    var popupStyle = {
      top: (gridY + 1) * this.props.gridSize,
      left: gridX * this.props.gridSize
    }

    var popupHighlightStyle = {
      width: this.props.gridSize,
      height: this.props.gridSize,
      top: -this.props.gridSize
    }

    return (
      <div
        className="grid-overlay"
        ref="gridOverlayElement"
        onMouseEnter={this.setPopupPosition}
        onMouseMove={this.setPopupPosition}
        onMouseLeave={this.onMouseLeave}
        style={style}>
          <div className={popupClasses} style={popupStyle} >
            <div className="grid-overlay-popup-highlight" style={popupHighlightStyle} ></div>
            <div className="grid-overlay-popup-content">
              Cell {gridX}:{gridY} - {gridX * this.props.gridSize},{gridY * this.props.gridSize}<br />
              Mouse - {popup.x},{popup.y}<br />
              Center - {(gridX + .5) * this.props.gridSize},{(gridY + .5) * this.props.gridSize}
            </div>
          </div>
      </div>
    );
  }
});

var PreviewPane = module.exports = React.createClass({
  render: function () {
    var layerNodes = _.map(this.props.levelData.layers, function (layer) {
      return (
        <Layer key={layer.name} data={layer} />
      );
    });

    var levelStyles = {
      width: this.props.levelData.width,
      height: this.props.levelData.height
    };

    return (
      <div className="preview-pane">
        <div className="level-bounds" style={levelStyles}>
          {layerNodes}
          <GridOverlay gridSize={this.props.globalData.gridSize}/>
        </div>
      </div>
    );
  }
});
