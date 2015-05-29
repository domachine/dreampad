var DocumentStore = require('../stores/document_store');
var StateStore = require('../stores/state_store');
var DocumentEditor = require('./document_editor');
var Actions = require('../actions')

function getState() {
  return {
    document: DocumentStore.getDocument(),
    isLoading: StateStore.getState().isLoading
  };
}

module.exports = React.createClass({
  getInitialState: function() {
    var state = getState();
    state.replica = Object.create(DocumentStore.getDocument());
    return state;
  },

  componentWillMount: function() {
    Actions.loading();
  },

  componentDidMount: function() {
    DocumentStore.addChangeListener(this._onDocumentChange);
    StateStore.addChangeListener(this._onChange);
    Actions.loadDocument(this.props.params.id);
  },

  componentWillUnmount: function() {
    DocumentStore.removeChangeListener(this._onDocumentChange);
    StateStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(next) {
    if (this.props.params.id !== next.params.id) {
      Actions.loadDocument(next.params.id);
    }
  },

  _onChange: function() {
    this.setState(getState());
  },

  /**
   * Seperate change handler for the document to avoid content flickering.
   */
  _onDocumentChange: function() {
    this.setState({ replica: Object.create(DocumentStore.getDocument()) });
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
          initialMode='edit'
          onSave={this._onSave}
          isLoading={this.state.isLoading}
          onChange={this._onFormChange} />
      </div>
    );
  }
});
