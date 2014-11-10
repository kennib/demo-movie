var fs = require('fs');
var browserify = require('browserify');
var https = require('https');
var httpProxy = require('http-proxy');
var connect = require('connect');
var launcher = require('browser-launcher');

var creds = {
	key: fs.readFileSync(__dirname+'/ssl-key.pem', 'utf8'),
	cert: fs.readFileSync(__dirname+'/ssl-cert.pem', 'utf8'),
};

module.exports = function(url, actions) {
browserify(['./recorder.js'], {basedir: __dirname}).bundle(function(err, buffer) {
	// Create a proxy server for injecting recording JS
	var server = connect()
	.use(function(req, res, next) {
		var _write = res.write;

		if (req.headers['accept'].search('text/html') !== -1)
			res.write = function (data) {
				var html = data.toString();
				var recorder = buffer.toString();
				var recorderScript = '<script>'+recorder+'</script>\n';
				var actionsScript = '<script>\nvar actions = '+actions+'()\n</script>\n';
				var injected = html.replace(/(<\/body[^>]*>)/, '\n' + recorderScript + actionsScript + '$1')
				_write.call(res, injected);
			};

		next();
	})
	.use(function (req, res) {
		httpProxy.createProxyServer({
			target: url,
		}).web(req, res);
	});
	
	https.createServer(creds, server)
	.listen(8000);

	// Launch the web browser
	launcher(function (err, launch) {
		if (err) return err;

		if (launch.browsers.local.length == 0) return new Error('No browsers available');

		var opts = {
			headless: false,
			browser: 'chrome',//launch.browsers.local[0].name,
		};

		return launch('https://localhost:8000', opts, function (err, ps) {
			if (err) return err;
		});
	});
});
}; 
