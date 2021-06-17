const { StreamDispatcher } = require('discord.js');
const { randomInt } = require('node:crypto');
const crypto = require('node:crypto')
const DatabaseApp = require('./databse')
class Session {
	constructor(db) {
		this.database = db
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
				else{
					res.end(JSON.stringify({ loged: false, token: null }))

				}
			})
		})

	}

}
module.exports.Session = Session;
