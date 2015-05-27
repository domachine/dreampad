var Link = require('react-router').Link;

var DocumentsStore = require('../stores/documents_store');
var StateStore = require('../stores/state_store');
var Actions = require('../actions');

function getState() {
  return {
    documents: DocumentsStore.getDocuments(),
    isLoading: StateStore.getState().isLoading
  };
}

module.exports = React.createClass({
  getInitialState: getState,

  componentDidMount: function() {
    DocumentsStore.addChangeListener(this._onChange);
    StateStore.addChangeListener(this._onChange);
    Actions.loadDocuments();
  },

  componentWillUnmount: function() {
    DocumentsStore.removeChangeListener(this._onChange);
    StateStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getState());
  },

  renderDocument: function(document) {
    return (
      <li className="media" key={document._id}>
        <div className="media-left">
          <Link to='edit_document' params={{ id: document._id }}>
            <span className='fa fa-file-o fa-2x' />
          </Link>
        </div>
        <div className="media-body">
          <h4 className="media-heading">{document._id}</h4>
          ...
        </div>
      </li>
    );
  },

  render: function() {
    if (this.state.isLoading) {
      return (
        <div style={{paddingTop: '50px', textAlign: 'center', width: '100%'}}>
          <span className='fa fa-spin fa-refresh fa-5x' />
        </div>
      );
    }
    return (
      <ul className="media-list">
        {this.state.documents.map(this.renderDocument)}
      </ul>
    );
  }
});
