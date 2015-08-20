var React = require('react');
var PreviewPane = require('./preview-pane');
var EditorPane = require('./editor-pane');
var _ = require('lodash');
var yaml = require('js-yaml');

var App = React.createClass({
  getInitialState: function () {
    return {
      level: {
        layers: { }
      },
      global: {
        gridSize: 24,
        layers: { }
      }
    }
  },

  onEditorChange: function (value, context) {
    try {
      var parsed = yaml.load(value);
      this.setState({
        [context]: parsed
      });
    } catch (e) {
      console.log(e);
    }
  },

  render: function () {
    return (
      <div className="main-container">
        <PreviewPane layers={[1, 2, 3]} levelData={this.state.level} globalData={this.state.global} />
        <EditorPane onChange={_.debounce(this.onEditorChange, 500)} />
      </div>
    );
  }
});

React.render(<App />, document.body);
