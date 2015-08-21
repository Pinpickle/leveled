var React = require('react');
var AceEditor = require('react-ace');
var brace = require('brace');
var cx = require('classnames');

require('brace/mode/yaml');
require('brace/theme/github');

var defaultGlobal =
`layers:
- name: objects
- name: walls
  defaultObject: wall

objects:
  player:
    width: 20
    height: 20
    shape: ellipse
  wall:
    color: brown
    origin: [0, 0]
`;

var defaultLevel =
`layers:
  objects:
  - type: player
    x: 100
    y: 80
  walls:
  - x: 72
    y: 120
    placement:
      width: 10
      height: 3
`

var EditorTabButton = React.createClass({
  getDefaultProps: function () {
    return {
      active: false,
      name: 'Tab',
      onClick: function () { }
    };
  },

  render: function () {
    var classes = cx({
      'editor-tab-active': this.props.active,
      'editor-tab': true
    });

    return (
      <div className={classes} onClick={this.props.onClick}>{this.props.name}</div>
    );
  }
});

var EditorPane = module.exports = React.createClass({
  getInitialState: function () {
    return {
      currentTab: 'level'
    };
  },

  setTab: function (tab) {
    this.setState({
      currentTab: tab
    });

    var session = this.aceEditor.sessions[tab];
    this.aceEditor.editor.setSession(session);
  },

  componentDidMount: function () {
    this.aceEditor.editor = brace.edit('editor-text-editor');

    var session = this.aceEditor.sessions[this.state.currentTab];
    this.aceEditor.editor.setSession(session);

    this.aceEditor.editor.on('change', this.onEditorChange);

    if (this.props.onChange) {
      this.props.onChange(this.aceEditor.sessions.global.getValue(), 'global');
      this.props.onChange(this.aceEditor.sessions.level.getValue(), 'level');
    }
  },

  componentWillMount: function () {
    this.aceEditor = { };

    this.aceEditor.sessions = {
      level: brace.createEditSession(defaultLevel, 'ace/mode/yaml'),
      global: brace.createEditSession(defaultGlobal, 'ace/mode/yaml')
    };
  },

  componentWillUnmount: function () {
    this.aceEditor.off('change', this.onEditorChange);
  },

  onEditorChange: function () {
    var value = this.aceEditor.editor.getValue();
    if (this.props.onChange) {
      this.props.onChange(value, this.state.currentTab);
    }
  },

  render: function () {
    return (
      <div className="editor-pane">
        <div className="editor-tabs">
          <EditorTabButton
            active={this.state.currentTab == 'level'}
            name='Level'
            onClick={this.setTab.bind(this, 'level')}/>
          <EditorTabButton
            active={this.state.currentTab == 'global'}
            name='Global'
            onClick={this.setTab.bind(this, 'global')} />
        </div>
        <div className="editor-content">
          <div id="editor-text-editor"></div>
        </div>
      </div>
    )
  }
});
