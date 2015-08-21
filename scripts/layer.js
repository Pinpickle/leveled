var React = require('react');

var Layer = module.exports = React.createClass({
  render: function () {
    var objectNodes = this.props.data.contents.map(function (object, key) {
      var styles = {
        left: object.x + 'px',
        top: object.y + 'px',
        width: object.width + 'px',
        height: object.height + 'px',
        backgroundColor: object.color
      };

      return (<div className="layer-object" style={styles} key={key}></div>)
    });
    return (<div className="preview-layer">{objectNodes}</div>);
  }
});
