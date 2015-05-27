var DocumentEditor = require('./document_editor');

function getState() {
  return { document: {} };
}

module.exports = React.createClass({
  getInitialState: getState,

  _onFormChange: function(key, value) {
    this.state.document[key] = value;
    this.setState({ document: this.state.document });
  },

  render: function() {
    return (
      <div>
        <DocumentEditor document={this.state.document}
          onChange={this._onFormChange} />
      </div>
    );
  }
});
