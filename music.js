
const { joinVoiceChannel, createAudioPlayer, createAudioResource, PlayerSubscription } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const config = require('./config.json')
class MsPlayer {
	constructor() {
	}
	play(link, vcchannel) {

		for (let site of config.allowed_sites) {
			if (link.indexOf("https://" + site) == 0) {
				let stream = ytdl(link, { filter: 'audioonly' });
				let plr = createAudioPlayer();
				let res = createAudioResource(stream, { inlineVolume: false });
				let conn = joinVoiceChannel({ channelId: vcchannel, guildId: this.guild.id, adapterCreator: this.guild.voiceAdapterCreator })
				conn.subscribe(plr);
				plr.play(res);
				break;
			}

		}


	}

}
module.exports.MsPlayer = MsPlayer;

