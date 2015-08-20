var React = require('react');
var PreviewPane = require('./preview-pane');
var EditorPane = require('./editor-pane');
var _ = require('lodash');
var yaml = require('js-yaml');
var levelData = require('./level-data');

var App = React.createClass({
  getInitialState: function () {
    levelData.subscribe(this.onLevelDataChange);
    var state = levelData.getState();

    return {
      level: state.level,
      global: state.global
    };
  },

  onLevelDataChange: function (state) {
    this.setState({
      level: state.level,
      global: state.global
    });
  },

  onEditorChange: function (value, context) {
    try {
      var parsed = yaml.load(value);
    } catch (e) {
      console.log(e);
    }

    levelData.setContext(context, parsed);
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
