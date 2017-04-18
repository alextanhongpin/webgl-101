var express = require('express');
var app = express();

var path = require('path');

app.use(express.static(path.join(__dirname, '/revision')));

app.get('/*', function (req, res) {
	res.sendFile(__dirname + '/revision/08-texture.html');
	//15-collada-parser.html');
});


app.listen(3000, function () {
	console.log('listening to port *:3000, press ctrl + c to cancel.');
});

