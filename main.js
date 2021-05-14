const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core')
const Config = require('./config.json')
const DicordToken = require("./token.json")
const { randomInt } = require('node:crypto');
const db_lib = require("./databse")
const WWWServer = require("./website")


const database = new db_lib.DatabaseApp()
const server = new WWWServer.HttpServer()

function play_sounds(connection, link) {
	const stream = ytdl(link, { filter: 'audioonly' });
	const dispatcher = connection.play(stream)
}
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	server.start(43400,database)


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
					let emoji = Config.emojify;
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
client.login(DicordToken.token);
