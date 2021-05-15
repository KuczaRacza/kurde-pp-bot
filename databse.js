const sqlite = require('sqlite3')
const assigmentsConfig = require('./website/limits.json')
const { randomInt } = require('node:crypto');
class Database {

	constructor() {
		this.database = new sqlite.Database("data.db");
		this.database.run("CREATE TABLE IF NOT EXISTS messages(author VARCHAR,content VARCHAR,atachments VARCHAR, snowflake VARCHAR, channel VARCHAR )", (err) => {
			if (err) { console.log(err) }
		})
		this.database.run("CREATE TABLE IF NOT EXISTS assigments(subclass VARCHAR,subject VARCHAR,title VARCHAR,description VARCHAR, due INT, userid INT, created INT,aid VARCHAR )", (err) => {
			if (err) { console.log(err) }
		})
	}
	savemessage(msg) {
		let stm = this.database.prepare("INSERT INTO messages (author,content,atachments,snowflake,channel) VALUES (?,?,?,?,?)");
		let att = ""
		msg.attachments.forEach((element) => {
			att += element.url + ";"
		})
		stm.run(msg.author.id, msg.content, att, msg.id, msg.channel.id);
		stm.finalize();

	}
	addAssigment(assigmentObj, userid) {
		let tilte = assigmentObj.title;
		let description = assigmentObj.description
		let due = Number(assigmentObj.due)
		let subject = assigmentObj.subject;
		let group = assigmentObj.group;

		if (tilte.length < assigmentsConfig['description-max'] && description.length < assigmentsConfig['description-max']
			&& tilte.length > assigmentsConfig['title-min'] && description.length > assigmentsConfig['description-min']
			&& due != undefined && due != NaN && due > 0 && assigmentsConfig.groups.includes(group)
			&& assigmentsConfig.subjects.includes(subject)) {
			let stm = this.database.prepare("INSERT INTO assigments (subclass,subject,title,description,due,userid,created,aid) VALUES (?,?,?,?,?,?,?,?)")
			let randomstring = ""
			let chars = "abcdefghijklmnoprstuvwxz01234567890ABCDEFGHIJKLMNOPRSTQUV"
			for (let i = 0; i < 32; i++) {
				randomstring += chars[randomInt(chars.length - 1)]
			}
			stm.run(group, subject, tilte, description, due, 1, new Date().getTime(), randomstring);
			stm.finalize()
			return true
		}
		else {
			return false
		}
	}
	getAssigments(params) {
		let stm
		if (params.subject == 'all' && params.group == 'all') {
			stm = this.database.prepare("SELECT * FROM assigments")
			stm.run()
		}
		else {

			if (params.group == 'all' || params.group == undefined) {
				stm = this.database.prepare("SELECT * FROM assigments WHERE subject  = ? ")
				stm.run(params.subject)

			}
			else if (params.subject == 'all' || params.subject == undefined) {
				stm = this.database.prepare("SELECT * FROM assigments WHERE subclass  = ? ")
				stm.run(params.group)
			}
			else{
				stm = this.database.prepare("SELECT * FROM assigments WHERE aubclass = ? AND subject  = ? ")
				stm.run(params.group,params.subject)
			}
			console.log(params)
		}

		let promis = new Promise((resolve, reject) => {
			let assigs = []
			stm.each((err, row) => {
				if (err) {
					console.log(err)
				}

				assigs.push(row)
			}, (err, num) => {
				resolve(assigs)
			})
			stm.finalize()

		})
		return promis


	}
}
module.exports.DatabaseApp = Database;