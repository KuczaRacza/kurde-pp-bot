const { StreamDispatcher, SnowflakeUtil } = require('discord.js');
const { randomInt } = require('node:crypto');
const crypto = require('node:crypto')
const DatabaseApp = require('./databse')
const conf = require('./config.json')
class Session {
	constructor(db, dscClient) {
		this.database = db
		this.dscClient = dscClient
	}
	randomString(l) {
		let chars = "abcdefghijklmnoperstvuqwxyz0123456789"
		let rd = ""

		for (let i = 0; i < l; i++) {
			rd += chars[randomInt(chars.length - 1)];
		}
		return rd
	}
	addUser(request, res) {

		let post = ""
		request.on('data', (chunk) => {
			post += chunk;
		})
		request.on('end', () => {
			try {
				let userdata = JSON.parse(post)
				if (userdata.nick == undefined && userdata.discord == undefined && userdata.password == undefined) {
					if (userdata.nick.length < 10 && userdata.password.length < 8) {
						res.end(JSON.stringify(false))
					}
					res.end(JSON.stringify(false))
				}
				let params = {}
				params.discord = userdata.discord
				this.database.getUser(params).then((ret) => {
					console.log(ret)
					if (ret.discord != undefined) {
						res.end(JSON.stringify({ token: null, added: false }))
					}
					else {
					
						let user = {};

						user.uid = this.randomString(32);
						user.created = new Date().getTime();
						user.nick = userdata.nick;
						let shasum = crypto.createHash('sha1')
						user.salt = this.randomString(8);
						user.password = shasum.update(userdata.password + user.salt).digest('base64');
						user.token = this.randomString(32);
						user.discord = userdata.discord;
						this.database.addUser(user)
						res.end(JSON.stringify({ token: user.token, added: true }))
						this.verifcation(user)
					}
				})


			} catch (err) {
				console.log(err)
			}
		})



	}
	logUser(request, res) {
		let post = ""
		request.on('data', (chunk) => {
			post += chunk;
		})
		request.on('end', () => {
			let login = JSON.parse(post)
			if (login.discord == undefined || login.password == undefined) {
				res.end(JSON.stringify({ loged: false, token: null }))
			}
			this.database.getUser({ discord: login.discord }).then((user) => {
				console.log(user)
				let shasum = crypto.createHash('sha1')
				let hash = shasum.update(login.password + user.salt).digest('base64');
				if (hash == user.password) {
					res.end(JSON.stringify({ loged: true, token: user.token }))
				}
				else {
					res.end(JSON.stringify({ loged: false, token: null }))

				}
			})
		})

	}
	verifcation = (user) => {
		let text = this.randomString(6)
			
			this.dscClient.users.fetch(user.discord).then((usr) => {
				this.dscClient.guilds.fetch(conf.server).then((guild) => {
					console.log(guild.clients)
					usr.send("Zweryfikuj swoje konto\n wpisz ten kod w zakładce użytkowanika\n http://localhost/account.html\n KOD: " + text)

				})
			})
		
	}
	permission = (auth) => {
		return new Promise((resolve, reject) => {
			this.database.getUser({ token: auth }).then((res) => {
				if (res != {}) {
					resolve(false)
				}
				else {
					resolve(true)
				}
			})
		})
	}
	sendMyAccounInfo = (response, auth) => {
		this.database.getUser({ token: auth }).then((res) => {
			if (res == {}) {
				response.end(JSON.stringify({}))
			}
			else {
				response.end(JSON.stringify({ nick: res.nick, discord: res.discord, status: res.status, created: res.created }))
			}
		})
	}
}
module.exports.Session = Session;
