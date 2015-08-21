var React = require('react');
var PreviewPane = require('./preview-pane');
var EditorPane = require('./editor-pane');
var _ = require('lodash');
var yaml = require('js-yaml');
var levelData = require('./level-data');

var App = React.createClass({
  getInitialState: function () {
    levelData.subscribe(this.onLevelDataChange);

    var generateDebounced = function (context) {
      this.onEditorChange[context] = _.debounce(function (value) {
        this.onEditorChange(value, context);
      }.bind(this), 500);
    }.bind(this);

    generateDebounced('level');
    generateDebounced('global');

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

  onEditorChangeProxy: function (value, context) {
    this.onEditorChange[context](value);
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
        <EditorPane onChange={this.onEditorChangeProxy} />
      </div>
    );
  }
});

React.render(<App />, document.body);
