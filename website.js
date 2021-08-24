const { AssertionError, strict } = require('assert');
const { randomInt } = require('node:crypto');
const http = require('http');
const fs = require('fs')
const dbApp = require('./databse')
const users = require('./users');
const limits = require('./website/limits.json')
const lessons = require('./lessons_start.json')
let users_spam_limit = {}
class Server {
	constructor() {
		console.log("crating server")
	}
	start = (port, database, dscClient) => {

		console.log("listening on port " + port)
		this.database = database;
		this.usr = new users.Session(this.database, dscClient);
		this.dscClient = dscClient;
		http.createServer((request, response) => {
			let location = request.url
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


			if (location == "/api/useradd" && request.method == "POST") {
				this.writeSucessHeader(response, args, (res, args) => { this.usr.addUser(request, res) })
			}
			else if (location == "/api/login" && request.method == "POST") {
				this.writeSucessHeader(response, args, (res, args) => { this.usr.logUser(request, res) })
			}

			else if (location == "/api/verifyaccount") {
				this.writeSucessHeader(response, { code: args.c, token: request.headers.auth }, this.usr.check_code)
			}
			else if (location == "/api/myaccount") {
				this.writeSucessHeader(response, request.headers.auth, this.usr.sendMyAccounInfo)

			}
			else if (location == "/api/assigments" || location == "/api/assigmentadd" || location == "/api/myaccount" || location == "/api/assigment" || location == "/api/lessons" && request.headers.auth != undefined) {
				this.usr.permission(request.headers.auth).then((res) => {
					if (res == true) {
						if (location == "/api/assigments") {
							this.writeSucessHeader(response, args, this.sendAssigments)
						}
						else if (location == "/api/assigmentadd" && request.method == "POST") {
							args["token"] = request.headers.auth
							this.writeSucessHeader(response, args, (res, args) => { this.writeAssigment(request, res, args) })
						}
						else if (location == "/api/assigment") {
							this.writeSucessHeader(response, args, this.writeAssigmentPage)
						}
						else if (location == "/api/lessons") {
							this.writeSucessHeader(response, args, this.getNextLessons)
						}

						else {
							response.write("<h1>NOT FOUND</h1><br>404<br>kurde-pp-bot")
							response.writeHead(404, { 'Content-Type': 'text/plain' })
							response.end();
						}
					}
					else {
						response.write("<h1>FOREBIDDEN</h1><br>403<br>kurde-pp-bot")
						response.writeHead(403, { 'Content-Type': 'text/plain' })
						response.end();
					}
				})
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
			let log = new Date().toDateString() + "  " + request.socket.address().address + "  " + request.httpVersion + " " + request.method + " " + location + " " + user_agent + "\n";
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
		if (users_spam_limit[req.headers.auth] == undefined) {
			users_spam_limit[req.headers.auth] = 0
		}
		if (new Date().getTime() - users_spam_limit[req.headers.auth] > limits.spamlimit) {
			users_spam_limit[req.headers.auth] = new Date().getTime()
			let post = "";
			req.on('data', (chunk) => {
				post += chunk;
			})
			req.on('end', () => {
				try {
					let obj = JSON.parse(post)
					let randomstring = ""
					let chars = "abcdefghijklmnoprstuvwxz01234567890ABCDEFGHIJKLMNOPRSTQUV"
					for (let i = 0; i < 32; i++) {
						randomstring += chars[randomInt(chars.length - 1)]
					}
					obj.aid =  randomstring;
					if (this.database.addAssigment(obj, args.token)) {
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
		} else {
			res.end(JSON.stringify(false))
		}
	}
	writeAssigmentPage = (res, args) => {
		this.database.getAssigments(args).then((obj) => {
			res.write(JSON.stringify(obj))
			res.end();
		})
	}
	getNextLessons = async (response, args) => {
		if (typeof (args.d) == Number || typeof (args.s) == Number || typeof (args.n) == Number) {
			response.end("BAD REQEST")
		}
		else {

			let start = 0;
			let lessons_to_send = []
			lessons.lessons.forEach((element, i) => {
				let hour = element.split(':')[1]
				if (hour == args.s) {
					start = i - 1;
					if (start < 0) {
						start == 0;

					}
				}
			})
			let end = Math.min(args.n, lessons.lessons.length - start)
			for (let i = start; i < end; i++) {
				let res = await this.database.getLessons(args.d, lessons.lessons[i])
				if (res.hour != undefined) {
					lessons_to_send.push(res)
				}

			}
			response.write(JSON.stringify(lessons_to_send))
			response.end()
		}
	}

}
module.exports.HttpServer = Server;