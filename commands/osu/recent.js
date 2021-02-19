const link = require("../../jsons/links.json")
const Discord = require("discord.js");
let api = require('../../osuapi.js');
const moment = require("moment")
module.exports = {
	name: 'recent',
	aliases: ['r', 'rs'],
	cooldown: 2.5,
	description: 'recent!',
	args: false,
	usage: '<nickname>',
	guildOnly: true,
	permissions: false,
	async execute(client, message, args) {
		//my stupid way to get username
		let username;
		try {
			if (!args[0]) {
				username = link[message.author.id].nick
			} else if (args[0].length > 20) {
				username = link[message.mentions.users.first().id].nick
			} else {
				username = args[0]
			}
		} catch {
			return message.channel.send("Please link yourself. **!link <nick>**")
		}
		api.get_user_recent(username).then(recent => {
			let try_counter = 1;
			let i = 0;
			while (i < 100) {
				if (recent[0]['beatmap_id'] === recent[i + 1]['beatmap_id']) {
					i++;
				} else {
					try_counter = i + 1;
					break
				}
			}
			let recentdesc = ""
			let c50 = recent[0]["count50"]
			let c100 = recent[0]["count100"]
			let c300 = recent[0]["count300"]
			let cmiss = recent[0]["countmiss"]
			let d = new Date();
			let ms = new Date(d) - new Date(recent[0]["date"])
			let saniye = ((ms / 1000) / 3600 - 3) * 3600
			let countryflagicon = "https://www.countryflags.io/" + recent[0]["country"] + "/flat/64.png";
			let acc = api.accuracyCalc(c300, c100, c50, cmiss)
			api.get_pp(parseInt(recent[0]["beatmap_id"]), acc * 1, parseInt(recent[0]["maxcombo"]), parseInt(cmiss), parseInt(recent[0]["enabled_mods"])).then(function (pp) {
				enabled_mods = api.num_to_num_but_diff_increase_mods_only(parseInt(recent[0]["enabled_mods"]))
				api.get_beatmap(recent[0]["beatmap_id"] * 1, enabled_mods).then(function (getbeatmap) {
					let beatmapsetlink = `https://osu.ppy.sh/beatmapsets/${getbeatmap[0]["beatmapset_id"]}#osu/${getbeatmap[0]["beatmap_id"]}`
					recentdesc += (`**[${getbeatmap[0]["title"]} [${getbeatmap[0]["version"]}]](${beatmapsetlink})**\n`)
					let star = getbeatmap[0]["difficultyrating"] / 1
					let mod = api.num_to_mod(recent[0]["enabled_mods"] * 1)
					recentdesc += (`▸ **[${star.toFixed(2)}★]** +${mod} | ${recent[0]["score"]} - ${api.get_rank_emote(recent[0]["rank"])}\n▸ **${pp}**pp | `)
					let comptext;
					if (recent[0]["rank"] == "F") {
						let completion = 0;
						totalhits = parseInt(recent[0]["countmiss"]) + parseInt(recent[0]["count50"]) + parseInt(recent[0]["count100"]) + parseInt(recent[0]["count300"]);
						objects = parseInt(getbeatmap[0]["count_normal"]) + parseInt(getbeatmap[0]["count_slider"]) + parseInt(getbeatmap[0]["count_spinner"]);
						completion = (Math.floor(((totalhits / objects)) * 10000) / 100);
						comptext = `\n▸ Map Completion: ${completion}%`
					} else {
						comptext = ``
					}
					beatmap_uid = getbeatmap[0]["beatmap_id"] * 1
					beatmap_maxcombo = getbeatmap[0]["max_combo"] * 1
					let iffcacc = api.accuracyCalc(c300 + cmiss, c100, c50, 0)
					api.get_if_fc_pp(parseInt(beatmap_uid), iffcacc * 1, parseInt(beatmap_maxcombo), parseInt(recent[0]["enabled_mods"])).then(function (iffcpp) {
						recentdesc += (`IF FC: **${iffcpp}**pp | x${recent[0]["maxcombo"]}/**${beatmap_maxcombo}**\n▸ ${acc}% | ${c100 * 1}x${api.get_onehundred_emote()} | ${c50 * 1}x${api.get_fifty_emote()} | ${cmiss * 1}${api.get_miss_emote()}\n▸ Try **#${try_counter}** | ${api.secondto(saniye)}${comptext}`)
						api.get_user(username).then(getuser => {
							countryflagicon = "https://www.countryflags.io/" + getuser[0]["country"] + "/flat/64.png";
							username = getuser[0]["username"]
							pp_raw = getuser[0]["pp_raw"];
							pp_rank = "#" + getuser[0]["pp_rank"] + " " + getuser[0]["country"] + getuser[0]["pp_country_rank"]
							embed = new Discord.MessageEmbed().setAuthor(`${username}: ${pp_raw}pp\n(${pp_rank})`, countryflagicon, "https://osu.ppy.sh/u/" + getuser[0]["user_id"]).setDescription(recentdesc).setThumbnail("http://s.ppy.sh/a/" + getuser[0]["user_id"] + `?${api.randomnumber(10000)}`).setColor(message.member.displayHexColor).setImage(`https://assets.ppy.sh/beatmaps/${getbeatmap[0]['beatmapset_id']}/covers/cover.jpg`)
							return message.channel.send(embed).then((msg) => {
								const ping = msg.createdTimestamp - message.createdTimestamp;
								console.log(`Recent Command MS: ${ping} ms`);
							});
						})
					})
				})
			})
		}).catch(err => {
			if (err.message == "Cannot read property 'beatmap_id' of undefined") {
				message.channel.send(`~~${username}~~ **did not submit anything recently.**`)
			} else {
				console.log(err)
			}
		});
	},
};