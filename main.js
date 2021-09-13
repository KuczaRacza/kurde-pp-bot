const Discord = require('discord.js');
//itests required in discord js 13+
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILDS] });
const Config = require('./config.json')
const DicordToken = require("./token.json")
const { randomInt } = require('node:crypto');
const db_lib = require("./databse")
const WWWServer = require("./website")
const lessonTime = require('./lessons_start.json');
//sqlite database wrapper	
const database = new db_lib.DatabaseApp()
//simple http server
const server = new WWWServer.HttpServer()

//assignment object or array of objsc  discord embed
let assigmentToEmbed = (assigment) => {
	console.log(assigment)
	let embed = new Discord.MessageEmbed()
	embed.title = assigment.title.substr(0, 40)
	embed.description = assigment.description.substr(0, 80)
	embed.addField("Termin:", new Date(assigment.due).toDateString(), true)
	embed.addField("Przedmiot:", assigment.subject, true)
	embed.addField("Grupa:", assigment.subclass, true)
	embed.setURL('https://kurde-pp.kuczaracza.com/task.html?aid=' + assigment.aid)
	return embed
}
//send message with next lessons 
//time and nexttime params are time when lesson starts written as string "hh:mm"
function sendPlanMessage(time, nexttime) {
	//fetch destination channel. 
	client.channels.fetch(Config.lesson_plan_channel).then((channel) => {
		let presence = new Discord.MessageEmbed();
		let date = new Date()
		//gets info from database 
		//maybe should I chanege function to async function for more clarity
		database.getLessons(date.getDay(), time).then((res) => {
			database.getLessons(date.getDay(), nexttime).then((nextres) => {
				//checks if there is a lesson  during given time
				if (res.hour != undefined) {
					//writes to embed
					presence.setTitle(res.hour + "  " + res.subject + "  sala " + res.room);
					presence.setColor("#FF0000")
					//if there is next lesson adds to embed too
					if (nextres.hour != undefined) {
						presence.addField(nextres.hour + "  " + nextres.subject + "  " + nextres.room, "PP-kurde-bot")
					}
					//not used
					//adds random image do embed 
					if (Config.lesson_add_images.length > 0) {
						let img = Config.lesson_add_images[randomInt(Config.lesson_add_images.length)]
						presence.setImage(Config.lesson_images_url_prefix + img)
					}
					channel.send({ embeds: [presence] })

				}


			})
		})
	})
}
let sendReminder = () => {
	let now = new Date();
	//gest all active assignment 

	database.getAssigments({ due: now.getTime() }).then((assigs) => {
		client.channels.fetch(Config.assigments_channel).then((chann) => {
			assigs.forEach((element) => {
				let dueDate = new Date(element.due)
				let timeTo = dueDate.getTime() - now.getTime();
				//filters assignments with less than 2 days due
				if (timeTo < 17280000) {
					let embed = assigmentToEmbed(element)
					embed.addField("WAŻNE TERMIN DO", new Date(element.due).toDateString())
					embed.setColor("#FF0000")
					chann.send({ embeds: [embed] })

				}
			})
		})
	})

}
//copy paset from stack overflow
//function executes each minute calls a event callbacks
function surprise(cb) {
	(function loop() {
		var now = new Date();
		//checks for lessons
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
		//send reminder
		/*
		if (now.getHours() == 17) {
			sendReminder()
		}
		*/
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
//bot command sending active assigments 
let sendNewAssigments = (assigment) => {
	client.channels.fetch(Config.assigments_channel).then((chann) => {

		if (assigment[0] == undefined) {
			if (assigment.due == undefined) {
				chann.send("Brak zadań akutalnie")
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
			//arive messages in database
			database.getAssigments({ due: new Date().getTime() }).then((results) => {
				sendNewAssigments(results)
			})
		}
	}
});

client.login(DicordToken.token);
