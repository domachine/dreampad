window.React = require('react');
var flux = require('flux');
var Router = require('react-router');

// Setup global dispatcher.
window.Dispatcher = new flux.Dispatcher();

var App = require('./components/app');
var NewDocument = require('./components/new_document');

var Route = Router.Route;

var routes = (
  <Route handler={App}>
    <Route name='new_document' path='/documents/new' handler={NewDocument} />
  </Route>
);

var router = module.exports = Router.create({ routes: routes });
router.run(function(Root) {
  React.render(<Root />, document.body);
});
