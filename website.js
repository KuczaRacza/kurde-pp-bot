const { AssertionError } = require('assert');
const http = require('http');
class Server {
	constructor() {

	}
	listen(port) {
		http.createServer((request, response) => {
			let location = request.url
			let args = location.split('?')[1]
			location = location.split('?')[0]
			args = args.split('&')
			console.log(location)
			if (location == "/assigments") {
				console.log(args)
				this.writeSucessHeader(response, args, this.sendAssigments)
			}
			
		}).listen(port);
	}
	sendAssigments(response, args) {
		let testAssigment = {}
		testAssigment.title = "KOLEJNE ZADANIE Z WF"
		testAssigment.description = "ZADANIE Z WF"
		let testObj = [testAssigment, testAssigment]
		response.write(JSON.stringify(testObj))
		response.end()
	}
	writeSucessHeader(response, args, callback) {
		response.writeHead(200, {
			'Content-Type': 'text/plain',
			'Access-Control-Allow-Origin': '*'
		});
		callback(response, args)
	}
}
module.exports.HttpServer = Server;