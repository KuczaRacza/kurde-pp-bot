const { AssertionError } = require('assert');
const http = require('http');
const dbApp = require('./databse')
class Server {
	constructor() {
		console.log("crating server")
	}
	start = (port, database) => {
		console.log("listening on port " + port)
		http.createServer((request, response) => {
			let location = request.url
			this.database = database;
			let args = location.split('?')[1]
			location = location.split('?')[0]
			if (args != undefined) {
				args = args.split('&')
			}
			console.log(location)
			if (location == "/assigments") {
				console.log(args)
				this.writeSucessHeader(response, args, this.sendAssigments)
			}
			else if (location == "/assigmentadd" && request.method == "POST") {
				this.writeSucessHeader(response, args, (res, args) => { this.writeAssigment(request, res, args) })
			}

		}).listen(port);
	}
	sendAssigments = (response, args) => {
		let promise = this.database.getAllAssigments()
		promise.then((assig_objs) => {
			response.write(JSON.stringify(assig_objs))
			response.end()

		})


	}
	writeSucessHeader = (response, args, callback) => {
		response.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*'
		});
		callback(response, args)
	}

	writeAssigment = (req, res, args) => {
		let post = "";
		req.on('data', (chunk) => {
			post += chunk;
		})
		req.on('end', () => {
			try {
				let obj = JSON.parse(post)
				this.database.addAssigment(obj)
				res.end("sucess")

			} catch (err) {
				console.log(err)
			}
		})
	}
}
module.exports.HttpServer = Server;