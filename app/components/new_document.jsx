var DocumentEditor = require('./document_editor');
var Actions = require('../actions');

function getState() {
  return { document: {
    _id: `doc_${new Date().getTime()}`
  } };
}

module.exports = React.createClass({
  getInitialState: getState,

  _onFormChange: function(key, value) {
    this.state.document[key] = value;
    this.setState({ document: this.state.document });
  },

  _onSave: function() {
    Actions.createDocument(this.state.document);
  },

  render: function() {
    return (
      <div>
        <DocumentEditor document={this.state.document}
          onSave={this._onSave}
          onChange={this._onFormChange} />
      </div>
    );
  }
});
