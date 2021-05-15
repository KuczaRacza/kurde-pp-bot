const sqlite = require('sqlite3')
const assigmentsConfig = require('./website/limits.json')
class Database {

	constructor() {
		this.database = new sqlite.Database("data.db");
		this.database.run("CREATE TABLE IF NOT EXISTS messages(author VARCHAR,content VARCHAR,atachments VARCHAR, snowflake VARCHAR, channel VARCHAR )", (err) => {
			if (err) { console.log(err) }
		})
		this.database.run("CREATE TABLE IF NOT EXISTS assigments(subclass VARCHAR,subject VARCHAR,title VARCHAR,description VARCHAR, due INT )", (err) => {
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
	addAssigment(assigmentObj) {
		console.log(assigmentObj)
		let tilte = assigmentObj.title;
		let description = assigmentObj.description
		let due = Number(assigmentObj.due)
		let subject = assigmentObj.subject;
		let group = assigmentObj.group;

		if (tilte.length < assigmentsConfig.title && description.length < assigmentsConfig.description && due != undefined && due != NaN && due > 0 && assigmentsConfig.groups.includes(group) && assigmentsConfig.subjects.includes(subject)) {
			let stm = this.database.prepare("INSERT INTO assigments (subclass,subject,title,description,due) VALUES (?,?,?,?,?)")
			stm.run(group, subject, tilte, description, due);
			stm.finalize()
		}
	}
	getAllAssigments() {
		let stm = this.database.prepare("SELECT * FROM assigments")
		stm.run()
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