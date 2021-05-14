const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core')
const Config = require('./config.json')
const { create } = require('combined-stream');
const sqlite = require("sqlite3");
const ms = require('ms');
class DatabaseApp {

	constructor() {
		this.database = new sqlite.Database("data.db");
		this.database.run("CREATE TABLE IF NOT EXISTS messages(author VARCHAR,content VARCHAR,atachments VARCHAR, snowflake VARCHAR )", (err) => {
			if (err) { console.log(err) }
		})
	}
	savemessage(msg) {
		let stm = this.database.prepare("INSERT INTO messages (author,content,atachments,snowflake) VALUES (?,?,?,?)");
		let att = ""
		 msg.attachments.forEach((element)=>{
			att += element.url+";"
		})
		stm.run(msg.author.id,msg.content,att,msg.id);
		stm.finalize();

	}
}
const database = new DatabaseApp()

function play_sounds(connection, link) {
	const stream = ytdl(link, { filter: 'audioonly' });
	const dispatcher = connection.play(stream)
}
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);



});
function rickroll() {
	const channel = client.channels.fetch("842510549668986924")
	channel.then((chann) => {
		const connection = chann.join()
		connection.then((conn) => {
			play_sounds(conn, "https://www.youtube.com/watch?v=dQw4w9WgXcQ")

		})

	})
	
}
client.on('message', msg => {
	let regex = /floyd/;

	if (regex.test(msg.content)) {
		msg.channel.send('Oddychać muszę bo się udusze');
	}
	if (msg.content.startsWith("-rickroll")) {
		rickroll();
	}
	let att = ""
		 msg.attachments.forEach((element)=>{
			att += element.url+";"
		})
		console.log(att)
		database.savemessage(msg)

});
client.login(Config.token);
