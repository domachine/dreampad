var DocumentStore = require('../stores/document_store');
var DocumentEditor = require('./document_editor');
var Actions = require('../actions')

function getState() {
  return {
    document: DocumentStore.getDocument(),
    replica: Object.create(DocumentStore.getDocument())
  };
}

module.exports = React.createClass({
  getInitialState: getState,

  componentDidMount: function() {
    DocumentStore.addChangeListener(this._onChange);
    Actions.loadDocument(this.props.params.id);
  },

  componentWillUnmount: function() {
    DocumentStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(next) {
    if (this.props.id !== next.id) {
      Actions.loadDocument(this.props.params.id);
    }
  },

  _onChange: function() {
    this.setState(getState());
  },

  _onFormChange: function(key, value) {
    this.state.replica[key] = value;
    this.setState({ replica: this.state.replica });
  },

  _onSave: function() {
    Actions.updateDocument(this.state.replica);
  },

  render: function() {
    return (
      <div>
        <DocumentEditor document={this.state.replica}
          initialMode='preview'
          onSave={this._onSave}
          onChange={this._onFormChange} />
      </div>
    );
  }
});
