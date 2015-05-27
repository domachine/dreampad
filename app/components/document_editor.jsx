var marked = require('marked');

var StateStore = require('../stores/state_store');
var Actions = require('../actions');

function getState() {
  return {
    mode: StateStore.getState().mode
  };
}

var Tab = React.createClass({
  render: function() {
    var cl = this.props.active ? 'active' : '';
    return (
      <li role="presentation" className={cl}><a href="#" {... this.props}>
        {this.props.children}
      </a></li>
    );
  }
});

module.exports = React.createClass({
  getInitialState: function() {
    var state = getState();
    state.caretPosition = (this.state || {}).caretPosition;
    return state;
  },

  componentDidMount: function() {
    StateStore.addChangeListener(this._onChange);
    if (this.state.mode === 'edit') { this._focusTextArea(); }
  },

  componentWillUnmount: function() {
    StateStore.removeChangeListener(this._onChange);
  },

  _focusTextArea: function() {
    React.findDOMNode(this.refs.textarea).focus();
  },

  _onChange: function() {
    var self = this;
    var state = getState();
    if (this.state.mode === 'edit') {
      state.caretPosition = React.findDOMNode(this.refs.textarea).selectionStart;
    } else {
      state.caretPosition = this.state.caretPosition;
    }
    this.setState(state, function() {
      if (state.mode === 'edit') {
        self._focusTextArea();
        React.findDOMNode(self.refs.textarea).selectionStart = state.caretPosition;
      }
    });
  },

  _onTextChange: function(key, e) {
    this.props.onChange(key, e.target.value);
  },

  _onEditMode: function(e) {
    e.preventDefault();
    this.setState({ mode: 'edit' });
  },

  _onPreviewMode: function(e) {
    e.preventDefault();
    this.setState({ mode: 'preview' });
  },

  renderBody: function() {
    if (this.state.mode === 'edit') {
      return (
        <div>
          <input className='form-control' placeholder='Name'
            value={this.props.document.name}
            onChange={this._onTextChange.bind(this, 'name')} />
          <br />
          <textarea ref='textarea' className='form-control' rows='20'
            value={this.props.document.content}
            onChange={this._onTextChange.bind(this, 'content')} />
        </div>
      );
    } else {
      return (
        <div>
          <div dangerouslySetInnerHTML={{__html: marked(this.props.document.content || '')}}>
          </div>
        </div>
      );
    }
  },

  render: function() {
    return (
      <div>
        <ul className="nav nav-tabs">
          <Tab active={this.state.mode === 'edit'} onClick={this._onEditMode}>Edit</Tab>
          <Tab active={this.state.mode === 'preview'} onClick={this._onPreviewMode}>Preview</Tab>
        </ul>
        <br />
        {this.renderBody()}
      </div>
    );
  }
});
