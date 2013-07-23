// configuration to move out 
var filesPort=1337;
var websocketPort=1338;

// set up and start a websocket server-side
var io = require('socket.io').listen(websocketPort);

io.sockets.on('connection', function (socket) {
	
	function sendUpdate(){
		socket.emit('operatorUpdate', { operator: Math.floor(Math.random()*10),
		    size: Math.random()*1 });
	}
	
	function simulateBackEndStream(){
		for (var i=0; i<100; i++)
		{
			var nextWait = Math.random()*1000*12;
			setTimeout(sendUpdate, nextWait);
			//console.log(nextWait);
		}
	}
		
	
	console.log('Client websocket connection opened'); //TODO: add ip and similar details of the client/connection, especially agent type etc.
	
	// websocket sanity test
	socket.emit('serverSanity', { hello: 'hello client' });
	socket.on('clientSanity', function (data) {
		console.log(data);
		setTimeout(simulateBackEndStream, 5000) // initial quiet period
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