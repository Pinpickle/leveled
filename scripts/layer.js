var React = require('react');
var cx = require('classnames');

var Layer = module.exports = React.createClass({
  render: function () {
    var objectNodes = this.props.data.contents.map(function (object, key) {
      var classes = cx(['layer-object', 'layer-object-shape-' + object.shape]);

      var styles = {
        left: object.x + 'px',
        top: object.y + 'px',
        width: object.width + 'px',
        height: object.height + 'px',
        backgroundColor: object.color,
        transform: 'translate(-' + object.origin[0] + 'px, -' + object.origin[1] + 'px)'
      };

      return (<div className={classes} style={styles} key={key}></div>)
    });
    return (<div className="preview-layer">{objectNodes}</div>);
  }
});
