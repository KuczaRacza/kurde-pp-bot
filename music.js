
const { joinVoiceChannel, createAudioPlayer, createAudioResource, PlayerSubscription } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const config = require('./config.json')
class MsPlayer {
	constructor() {
		this.playlist = []
	}
	play(link, vcchannel) {

		for (let site of config.allowed_sites) {
			if (link.indexOf("https://" + site) == 0) {

				if (this.plr == undefined) {
					this.plr = createAudioPlayer();
					this.conn = joinVoiceChannel({ channelId: vcchannel, guildId: this.guild.id, adapterCreator: this.guild.voiceAdapterCreator, })
					this.conn.subscribe(this.plr);
					this.playlist_counter = 0

				}

				this.playlist.push(link);
				console.log(this.plr.state.status)


				if (this.plr.state.status == "idle") {

					this.play_from_queue();
					this.plr.on('stateChange', (old_state, new_state) => {
						if (new_state.status == 'idle') {
							this.play_from_queue()
						}

					})

				}
				break;
			}

		}


	}
	play_from_queue = () => {
		if (this.playlist_counter < this.playlist.length) {
			let stream = ytdl(this.playlist[this.playlist_counter], { filter: 'audioonly' });
			let res = createAudioResource(stream, { inlineVolume: false });
			this.playlist_counter++;
			this.conn.rejoin()
			this.conn.subscribe(this.plr);
			this.plr.play(res);
		}
	}



}
module.exports.MsPlayer = MsPlayer;

