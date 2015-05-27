var http = require('http');
var routes = require('routes');
var ecstatic = require('ecstatic')(__dirname + '/public');

var router = routes();

var server = http.createServer(function(req, res) {
  var match = router.match(req.url);
  if (match) { match.fn(req, res, match); }
  else { ecstatic(req, res); }
});
server.listen(3000);
