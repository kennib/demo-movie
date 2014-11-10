var screenshare = require('rtc-screenshare');
var media = require('rtc-media');

// Capture the screen
screenshare(function(err, constraints) {
	console.log(arguments);
	if (err) return new Error('Could not capture window: ', err);
	
	media({ constraints: constraints })
	.on('error', function(err) {
		console.log(err);
    	return new Error('Could not capture: ', err);
	})
    .once('capture', function(stream) {
		console.log('Successfully captured stream: ', stream);
	});
});
