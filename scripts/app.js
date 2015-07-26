var React = require('react');
var PreviewPane = require('./preview-pane');
var EditorPane = require('./editor-pane');

var App = React.createClass({
  render: function () {
    return (
      <div className="main-container">
        <PreviewPane layers={[1, 2, 3]} />
        <EditorPane />
      </div>
    );
  }
});

React.render(<App />, document.body);
