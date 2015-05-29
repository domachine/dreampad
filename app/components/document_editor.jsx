var marked = require('marked');

var Actions = require('../actions');
var LoadingIndicator = require('../components/loading_indicator');

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
    var state = {
      caretPosition: 0,
      mode: this.props.initialMode || 'edit',
    };
    return state;
  },

  componentDidMount: function() {
    window.addEventListener('keyup', this._onKeyUp);
  },

  componentWillUnmount: function() {
    window.removeEventListener('keyup', this._onKeyUp);
  },

  _focusTextArea: function() {
    React.findDOMNode(this.refs.textarea).focus();
  },

  _changeMode: function(mode) {
    var self = this;
    if (this.state.mode === 'edit') {
      this.state.caretPosition = React.findDOMNode(this.refs.textarea).selectionStart;
    }
    this.state.mode = mode;
    this.setState(this.state, function() {
      if (self.state.mode === 'edit') {
        self._focusTextArea();
        React.findDOMNode(self.refs.textarea).selectionStart = self.state.caretPosition;
      }
    });
  },

  _onKeyUp: function(e) {
    // Right - 39
    // Left - 37
    var mode = this.state.mode;

    if (!e.ctrlKey) { return; }
    if (e.keyCode === 32) {
      this._changeMode(mode === 'edit' ? 'preview' : 'edit');
    }
    if (e.keyCode === 13) {
      this.props.onSave();
    }
  },

  _onTextChange: function(key, e) {
    this.props.onChange(key, e.target.value);
  },

  _onEditMode: function(e) {
    e.preventDefault();
    this._changeMode('edit');
  },

  _onPreviewMode: function(e) {
    e.preventDefault();
    this._changeMode('preview');
  },

  renderBody: function() {
    if (this.state.mode === 'edit') {
      return (
        <div>
          <input className='form-control' placeholder='Name'
            value={this.props.document._id || ''}
            onChange={this._onTextChange.bind(this, '_id')}
            disabled={this.props.isLoading} />
          <br />
          <textarea ref='textarea' className='form-control' rows='20'
            value={this.props.document.content || ''}
            onChange={this._onTextChange.bind(this, 'content')}
            disabled={this.props.isLoading} />
        </div>
      );
    } else {
      if (this.props.isLoading) {
        return (
          <LoadingIndicator />
        );
      }
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
