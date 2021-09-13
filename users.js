const { StreamDispatcher, SnowflakeUtil } = require('discord.js');
const { randomInt } = require('node:crypto');
const crypto = require('node:crypto')
const DatabaseApp = require('./databse')
const conf = require('./config.json')
/*
USER STATUS 
1 - active 
2 - mod 
4 - banned

 */
let token_cache = {}

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
	//adds user
	addUser(request, res) {

		let post = ""
		request.on('data', (chunk) => {
			post += chunk;
		})
		request.on('end', () => {
			try {
				//parse post data and vlidate input
				let userdata = JSON.parse(post)
				if (userdata.nick == undefined && userdata.discord == undefined && userdata.password == undefined) {
					if (userdata.nick.length < 10 && userdata.password.length < 8) {
						res.end(JSON.stringify(false))
					}
					res.end(JSON.stringify(false))
				}
				let params = {}
				params.discord = userdata.discord
				//check if user exists
				this.database.getUser(params).then((ret) => {
					console.log(ret)
					if (ret.discord != undefined) {
						res.end(JSON.stringify({ token: null, added: false }))
					}
					else {
						//createsuser objct
						let user = {};
						//uniqe id of each user
						user.uid = this.randomString(32);
						user.created = new Date().getTime();
						user.nick = userdata.nick;
						//salts and hashes
						let shasum = crypto.createHash('sha1')
						user.salt = this.randomString(8);
						user.password = shasum.update(userdata.password + user.salt).digest('base64');
						user.token = this.randomString(32);
						user.discord = userdata.discord
						//saves in db
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
			//input validation
			if (login.discord == undefined || login.password == undefined) {
				res.end(JSON.stringify({ loged: false, token: null }))
			}
			//searches user with same token and discord in db
			this.database.getUser({ discord: login.discord }).then((user) => {
				//if exits, salts and hashes passowrd and checks if match
				let shasum = crypto.createHash('sha1')
				let hash = shasum.update(login.password + user.salt).digest('base64');
				if (hash == user.password) {
					//sucess , sends token 
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

		//searches for user in discord server 
		//if finds one , sends them verification code 
		this.dscClient.guilds.fetch(conf.server).then((guild) => {
			guild.members.fetch(user.discord).then((mem) => {
				mem.send("Zweryfikuj swoje konto\n wpisz ten kod w zakładce użytkowanika\n https://kurde-pp.kuczaracza.com/account.html\n KOD: " + text)
				this.database.insert_verification_code(text, user.uid)
				console.log("wysłano")
			})
				.catch((res) => {
					//walkaround
					//user not found /  id is not valid
					if (res.code == 10007) {

					}
				})

		})


	}
	//checks if token is valid
	permission = (auth) => {

		return new Promise((resolve, reject) => {
			//looks in cache to avoid db querry
			if (token_cache[auth] === true) {
				resolve(true)
			}
			else if (token_cache[auth] === false) {
				resolve(false)
			} else {
				//loks in db to find user
				this.database.getUser({ token: auth, status: 1 }).then((res) => {
					if (res.discord == undefined) {
						token_cache[auth] = false;
						resolve(false)
					}
					else {
						token_cache[auth] = true;
						resolve(true)
					}
				})
			}
		})
	}
	sendMyAccounInfo = (response, auth) => {
		//sends user object 
		this.database.getUser({ token: auth }).then((res) => {
			if (res == {}) {
				response.end(JSON.stringify({}))
			}
			else {
				response.end(JSON.stringify({ nick: res.nick, discord: res.discord, status: res.status, created: res.created }))
			}
		})
	}
	//check if verification code is valid
	check_code = (response, args) => {
		//input validation
		if (args.code != undefined && args.token != undefined) {

			this.database.test_code(args.code, args.token).then((res) => {
				console.log(res)

				if (res.uid != undefined) {
					response.end(JSON.stringify(true))
				} else {
					response.end(JSON.stringify(false));
				}
			})
		}
		else {
			response.end(JSON.stringify(false));
		}
	}
}
module.exports.Session = Session;
