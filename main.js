const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILDS] });
const ytdl = require('ytdl-core')
const Config = require('./config.json')
const DicordToken = require("./token.json")
const { randomInt } = require('node:crypto');
const db_lib = require("./databse")
const WWWServer = require("./website")
const lessonTime = require('./lessons_start.json');
const { commands, config } = require('npm');

const database = new db_lib.DatabaseApp()
const server = new WWWServer.HttpServer()
let assigmentToEmbed = (assigment) => {
	console.log(assigment)
	let embed = new Discord.MessageEmbed()
	embed.title = assigment.title.substr(0, 40)
	embed.description = assigment.description.substr(0, 80)
	embed.addField("Termin:", new Date(assigment.due).toDateString(), true)
	embed.addField("Przedmiot:", assigment.subject, true)
	embed.addField("Grupa:", assigment.subclass, true)
	embed.setURL('https://kurde-pp.kuczaracza.com/task.html?aid='+assigment.aid)
	return embed
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
					channel.send({embeds: [presence]})

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
				let dueDate = new Date(element.due)
				let timeTo = dueDate.getTime() - now.getTime();
				if (timeTo < 17280000) {
					let embed = assigmentToEmbed(element)
					embed.addField("WAŻNE TERMIN DO", new Date(element.due).toDateString())
					embed.setColor("#FF0000")
					chann.send({embeds: [embed]})

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
		if (now.getHours() == 17) {
			sendReminder()
		}
		now = new Date();
		var delay = 60000 - (now % 60000);
		setTimeout(loop, delay);
	})();
}
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	server.start(43400, database, client)
	surprise(sendPlanMessage)
	server.onAssigmentAddCB = sendNewAssigments;
	database.dscClient = client;

});
let sendNewAssigments = (assigment) => {
	client.channels.fetch(Config.assigments_channel).then((chann) => {

		if (assigment[0] == undefined) {
			if (assigment.due == undefined) {
				chann.send("Brak zadań aktualnie")
				return
			} else {
				chann.send({ embeds: [assigmentToEmbed(assigment)] })
				return
			}
		}

		else {
			assigment.forEach((element, i) => {
					chann.send({ embeds: [assigmentToEmbed(element)] })
			

			})


		}
	})

}

client.on('messageCreate', msg => {
	database.savemessage(msg)
	if (msg.mentions.has(client.user.id)) {
		if (msg.content.includes("zadania")) {

			database.getAssigments({ due: new Date().getTime() }).then((results) => {
				sendNewAssigments(results)
			})
		}
	}
});

client.login(DicordToken.token);
