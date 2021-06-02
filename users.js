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
						return {};
					}
					return {};
				}
				let user ={};

				user.uid = this.randomString(32);
				user.created = new Date().getTime();
				user.nick = userdata.nick;
				let shasum = crypto.createHash('sha1')
				user.salt = this.randomString(8);
				user.password = shasum.update("adsfsdf").digest('base64');
				user.token = this.randomString(32);
				user.discord = userdata.discord;
				this.database.addUser(user)
				res.end(JSON.stringify(true))

			} catch (err) {
				console.log(err)
			}
		})



	}
	logUser(login) {
		let pr = new Promise((resolve, reject) => {
			if (login.discord == undefined || login.password == undefined) {
				resolve(false)
			}
			this.database.getUser(login).then((res) => {
				let shasum = crypto.createHash('sha1')
				let hash = shasum.update(login.password + res.salt)
				if (hash = res.password) {
					resolve(res.token)
				}
			})
		})
		return pr
	}

}
module.exports.Session = Session;
