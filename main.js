const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core')
const Config = require('./config.json')
const { create } = require('combined-stream');
const sqlite = require("sqlite3");
const ms = require('ms');
const { randomInt } = require('node:crypto');
class DatabaseApp {

	constructor() {
		this.database = new sqlite.Database("data.db");
		this.database.run("CREATE TABLE IF NOT EXISTS messages(author VARCHAR,content VARCHAR,atachments VARCHAR, snowflake VARCHAR, channel VARCHAR )", (err) => {
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
	let floyd_rg = /(floyd)|(floryd)|(floryst)/i;
	let jetsm_rg = /(je[st][st]em*)|(by[lł][ea]m)/i
	if (msg.author.id != client.user.id) {
		if (floyd_rg.test(msg.content)) {
			msg.channel.send('Oddychać muszę bo się udusze');
		}
		if (jetsm_rg.test(msg.content)) {

			let content_arry = msg.content.split(' ');
			for (let i = 0; i < content_arry.length - 1; i++) {
				if (jetsm_rg.test(content_arry[i])) {
					let emoji = [":smile:", ":sweat_drops:", ":peach: :eggplant:", ":upside_down:"]
					let rand = randomInt(emoji.length - 1)
					msg.channel.send("Cześć " + content_arry[i + 1] + " jestem bot " + emoji[rand])
				}
				break;

			}
		}
		if (msg.content.startsWith("-rickroll")) {
			rickroll();

		}
	}
	database.savemessage(msg)
});
client.login(Config.token);
