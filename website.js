const { AssertionError } = require('assert');

const http = require('http');
const fs = require('fs')
const dbApp = require('./databse')
const users = require('./users')
class Server {
	constructor() {
		console.log("crating server")
	}
	start = (port, database) => {
		console.log("listening on port " + port)
		http.createServer((request, response) => {
			let location = request.url
			this.database = database;
			this.usr = new users.Session(this.database);
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

			if (location == "/api/assigments") {
				this.writeSucessHeader(response, args, this.sendAssigments)
			}
			else if (location == "/api/assigmentadd" && request.method == "POST") {
				this.writeSucessHeader(response, args, (res, args) => { this.writeAssigment(request, res, args) })
			}
			else if (location == "/api/assigment") {
				this.writeSucessHeader(response, args, this.writeAssigmentPage)
			}
			else if (location == "/api/adduser" && request.method == "POST") {
				this.writeSucessHeader(response, args, (res, args) => { this.usr.addUser(request, res) })
			}
			else if (location == "/api/login" && request.method == "POST"){
				this.writeSucessHeader(response, args, (res, args) => { this.usr.logUser(request, res) })
			}
			else {
				response.write("<h1>NOT FOUND</h1><br>404<br>kurde-pp-bot")
				response.writeHead(404, { 'Content-Type': 'text/plain' })
				response.end();
			}
			let user_agent = ""
			request.rawHeaders.forEach((element, i) => {
				if (element == "User-Agent") {
					user_agent = request.rawHeaders[i + 1]
				}
			})
			let log = new Date().toDateString() + "  " + request.method + " " + location + " " + user_agent + "\n";
			fs.appendFile("./acess.log", log, () => { })

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
					this.onAssigmentAddCB(obj)


				}
				else {
					res.end(JSON.stringify(false))
				}

			} catch (err) {
				console.log(err)
			}
		})
	}
	writeAssigmentPage = (res, args) => {
		this.database.getAssigments(args).then((obj) => {
			res.write(JSON.stringify(obj))
			res.end();
		})
	}

}
module.exports.HttpServer = Server;