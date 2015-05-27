var Router = require('react-router')

var Actions = require('../actions');
var StateStore = require('../stores/state_store');

var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

function getState() {
  return {
    isLoading: StateStore.getState().isLoading || false,
    isSaving: StateStore.getState().isSaving || false,
  };
}

module.exports = React.createClass({
  getInitialState: function() {
    var state = getState();
    return state;
  },

  componentDidMount: function() {
    StateStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    StateStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getState());
  },

  render: function() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Brand</a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li>
                  <Link to='documents'>
                    Documents
                  </Link>
                </li>
                <li>
                  <Link to='new_document'>
                    <span className='fa fa-plus' />
                    &nbsp;
                    New document
                  </Link>
                </li>
                <li>
                  <a href='#'>
                    {this.state.isLoading || this.state.isSaving
                      ? <span className='fa fa-spinner fa-spin' />
                      : null}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='container'>
          <RouteHandler />
        </div>
      </div>
    );
  }
});
