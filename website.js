const http = require('http');
class Server {
	constructor() {

	}
	listen(port) {
		http.createServer((request, response) => {
			response.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			response.write('Hello, World!');
			response.end();
			console.log(request.location)

		}).listen(port);

	}
}
module.exports.HttpServer = Server;