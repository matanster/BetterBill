// configuration to move out 
var filesPort=1337;
var websocketPort=1338;

// set up and start a websocket server-side
var io = require('socket.io').listen(websocketPort);

io.sockets.on('connection', function (socket) {
	console.log('Client websocket connection opened'); //TODO: add ip and similar details of the client/connection, especially agent type etc.
	
	// websocket sanity test
	socket.emit('serverSanity', { hello: 'hello client' });
	socket.on('clientSanity', function (data) {
		console.log(data);
  });
});


// set up and start a static file server, for serving the static page
var app = require('http').createServer(handler);
var static = require('node-static'); 
staticContentServer = new static.Server('./page', { cache: false });

app.listen(filesPort);

function handler(request, response) {
	console.log('Received request - method: ' + request.method + ' url: ' + request.url);
	if (request.method == 'GET') 
		switch(request.url)
		{
			//
			// Consider adding: nice error page for not-found files.
			// 					currently returns status 404 and a blank page for not-found files
			//
			case '/': 
				// serves the main html page to the browser
				request.url += 'index.html';
				staticContentServer.serve(request, response);
				break;
			default:
				// this is for when the html page causes the browser to locally load css and js libraries
				staticContentServer.serve(request, response);
		}
}

/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Server is up.\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
*/