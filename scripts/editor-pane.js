var React = require('react');
var AceEditor = require('react-ace');
var brace = require('brace');

require('brace/mode/yaml');
require('brace/theme/github');

var EditorPane = module.exports = React.createClass({
  render: function () {
    return (
      <div className="editor-pane">
        <div className="editor-tabs">
          <div className="editor-tab editor-tab-active">Level</div>
          <div className="editor-tab">Global</div>
        </div>
        <div className="editor-content">
          <AceEditor mode="yaml" theme="github" width="auto" height="auto" />
        </div>
      </div>
    )
  }
});
