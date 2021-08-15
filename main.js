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
let assigmentToEmbed = (assigment) => {
	let presece = new Discord.MessageEmbed()
	presece.title = assigment.title.substr(0, 40)
	presece.description = assigment.description.substr(0, 80)
	presece.addField("Termin:", new Date(assigment.due).toDateString(), true)
	presece.addField("Przedmiot:", assigment.subject, true)
	presece.addField("Grupa:", assigment.group, true)
	return presece
}
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
					if (Config.lesson_add_images.length > 0) {
						let img = Config.lesson_add_images[randomInt(Config.lesson_add_images.length)]
						presence.setImage(Config.lesson_images_url_prefix + img)
					}
					channel.send(presence)

				}


			})
		})
	})
}
let sendReminder = () => {
	let now = new Date();
	database.getAssigments({ due: now.getTime() }).then((assigs) => {
		client.channels.fetch(Config.assigments_channel).then((chann) => {
			assigs.forEach((element) => {
				element.group = element.subclass
				let dueDate = new Date(element.due)
				let timeTo = dueDate.getTime() - now.getTime();
				if (timeTo < 172800) {
					console.log(timeTo)
					let embed = assigmentToEmbed(element)
					embed.addField("WAŻNE TERMIN DO", new Date(element.due).toDateString())
					embed.setColor("#FF0000")
					chann.send(embed)

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
			if (/*now.getHours() == 17*/ true) {
				sendReminder()
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
	server.start(43400, database,client)
	surprise(sendPlanMessage)
	server.onAssigmentAddCB = sendNewAssigments;
	database.dscClient = client;

	


});
let sendNewAssigments = (assigment) => {
	client.channels.fetch(Config.assigments_channel).then((chann) => {
		chann.send(assigmentToEmbed(assigment))
	})
}

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
