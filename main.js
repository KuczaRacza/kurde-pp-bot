const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core')
const Config = require('./config.json')
const DicordToken = require("./token.json")
const { randomInt } = require('node:crypto');
const db_lib = require("./databse")
const WWWServer = require("./website")
const lessonTime = require('./lessons_start.json')

const database = new db_lib.DatabaseApp()
const server = new WWWServer.HttpServer()
function sendPlanMessage(time, nexttime) {
	client.channels.fetch(Config.lesson_plan_channel).then((channel) => {
		let presence = new Discord.MessageEmbed();
		let date = new Date()
		database.getLessons(date.getDay(), time).then((res) => {
			database.getLessons(date.getDay(), nexttime).then((nextres) => {
				if (res.hour != undefined) {
					presence.setTitle(res.hour + "  " + res.subject + "  sala " + res.room);
					presence.setColor("#FF0000")
					if (nextres.hour != undefined) {
						presence.addField(nextres.hour + "  " + nextres.subject + "  " + nextres.room, "PP-kurde-bot")
					}
					if(Config.lesson_add_images.length>0){
						let img = Config.lesson_add_images[randomInt(Config.lesson_add_images.length)]
						presence.setImage(Config.lesson_images_url_prefix + img)
					}
					channel.send(presence)

				}


			})
		})
	})
}
function surprise(cb) {
	(function loop() {
		var now = new Date();
		lessonTime.lessons.forEach((element, i) => {
			let time = element.split(':')
			let minute = time[1]
			let hour = time[0]

			let minutes_now = now.getHours() * 60 + now.getMinutes();
			let minutes = Number(hour) * 60 + Number(minute) - 5
			if (minutes_now == minutes) {
				sendPlanMessage(element, lessonTime.lessons[i + 1])
			}

		})
		now = new Date();
		var delay = 60000 - (now % 60000);
		setTimeout(loop, delay);
	})();
}
function play_sounds(connection, link) {
	const stream = ytdl(link, { filter: 'audioonly' });
	const dispatcher = connection.play(stream)
}
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	server.start(43400, database)
	surprise(sendPlanMessage)


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
