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
			let args = {}
			let tmp_args = location.split('?')[1]
			location = location.split('?')[0]
			if (tmp_args != undefined) {
				tmp_args = tmp_args.split('&')

				tmp_args.forEach(element => {
					let splited = element.split('=')
					args[splited[0]] = splited[1]
				});
			}

			console.log(location)
			if (location == "/assigments") {
				console.log(args)
				this.writeSucessHeader(response, args, this.sendAssigments)
			}
			else if (location == "/assigmentadd" && request.method == "POST") {
				this.writeSucessHeader(response, args, (res, args) => { this.writeAssigment(request, res, args) })
			}
			else if (location == "/assigment"){
				this.writeSucessHeader(response,args,this.writeAssigmentPage)
			}
			else{
				response.write("<h1>NOT FOUND</h1><br>404<br>kurde-pp-bot")
				response.writeHead(404,{'Access-Control-Allow-Origin': '*','Content-Type': 'text/plain'})
				response.end();
			}

		}).listen(port);
	}
	sendAssigments = (response, args) => {
		let params = {}
		let promise = this.database.getAssigments(args)
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
				if (this.database.addAssigment(obj)) {
					res.end(JSON.stringify(true))

				}
				else {
					res.end(JSON.stringify(false))
				}

			} catch (err) {
				console.log(err)
			}
		})
	}
	writeAssigmentPage = (res,args)=>{
		this.database.getAssigments(args).then((obj)=>{
			res.write(JSON.stringify(obj))
			res.end();
		})
	}
}
module.exports.HttpServer = Server;