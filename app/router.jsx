window.React = require('react');
var flux = require('flux');
var Router = require('react-router');

// Setup global dispatcher.
window.Dispatcher = new flux.Dispatcher();

var db = require('./database');
var App = require('./components/app');
var NewDocument = require('./components/new_document');
var Documents = require('./components/documents');
var EditDocument = require('./components/edit_document');

var Route = Router.Route;

var routes = (
  <Route handler={App}>
    <Route name='documents' path='/documents' handler={Documents} />
    <Route name='new_document' path='/documents/new' handler={NewDocument} />
    <Route name='edit_document' path='/documents/:id' handler={EditDocument} />
  </Route>
);

var router = module.exports = Router.create({ routes: routes });
db.install();
router.run(function(Root) {
  React.render(<Root />, document.body);
});
