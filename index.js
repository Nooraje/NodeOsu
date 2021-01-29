const request = require("request");
const json = require("json");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./configs.json")
const link = require("./links.json")
const prefixes = require("./prefixes.json")
const fs = require('fs');


//osu profile command
client.on('message', message => {
  try {
    prefix = prefixes[message.guild.id].prefix
  } catch {
    prefix = config.prefix
  }
	if (!message.content.startsWith(prefix)) return;
	const args = message.content.trim().split(/ +/g);
	const cmd = args[0].slice(prefix.length).toLowerCase(); // case INsensitive, without prefix
	if (cmd === 'osu') {
		try {
			if (!args[1]) {
				var username = link[message.author.id].nick
			} else {
				var username = args[1]
			}
		} catch {
			message.channel.send("Please link yourself. **!link <nick>**")
			return
		}
		request(
			"https://osu.ppy.sh/api/get_user?k=" + config.apikey + `&u=${username}`,
			function (error, response, body) {
				randomnumber = Math.floor(Math.random() * 10000);
				r = body;
				obj = JSON.parse(r);
				//api callbacks
				try {
					osuprofilepicture = "http://s.ppy.sh/a/" + obj[0]["user_id"];
					countryflagicon = "https://www.countryflags.io/" + obj[0]["country"] + "/flat/64.png";
					username = obj[0]["username"]
					osuprofilelink = "https://osu.ppy.sh/u/" + username
					pp_rank =
						"**» Rank:** " +
						"#" +
						obj[0]["pp_rank"] +
						" [" +
						obj[0]["country"] +
						"#" +
						obj[0]["pp_country_rank"] +
						"]";
					pp_raw = obj[0]["pp_raw"];
					accuracy = obj[0]["accuracy"] / 1;
					accuracyy = accuracy.toFixed(2);
					playcount = "**» Playcount:** " + obj[0]["playcount"]
					hoursplayedmath = obj[0]["total_seconds_played"] / 60 / 60;
					hoursplayed = "**» Hours Played:** " + hoursplayedmath.toFixed(0);
					joindate = obj[0]["join_date"]
					//description
					asd =
						`**» Username:** ${username}\n` +
						`${pp_rank}\n` +
						`**» Total PP:** ${pp_raw}\n` +
						`**» Hit Accuracy:** ${accuracyy}%\n` +
						`${playcount}\n` +
						`${hoursplayed}`;
					//embed
					embed = new Discord.MessageEmbed()
						.setAuthor("osu! Profile", countryflagicon, osuprofilelink)
						.setDescription(asd)
						.setThumbnail(osuprofilepicture + `?${randomnumber}`)
						.setColor("#1db35e")
						.setFooter("»» Join Date: " + joindate);
					message.channel.send(embed);
				} catch (err) {
					message.channel.send("Something went wrong.. Please specify a correct nickname.")
				}
			}
		);
	}
});

//link command
client.on('message', message => {
  try {
    prefix = prefixes[message.guild.id].prefix
  } catch {
    prefix = config.prefix
  }
	if (!message.content.startsWith(prefix)) return;
	const args = message.content.trim().split(/ +/g);
	const cmd = args[0].slice(prefix.length).toLowerCase(); // case INsensitive, without prefix
	if (cmd === 'link') {
		if (!args[1]) {
			message.channel.send("Please specify a nickname")
		} else {
			var nick = args[1]
			link[message.author.id] = {
				nick: nick
			}
			fs.writeFile("./links.json", JSON.stringify(link, null, 4), err => {
				if (err) throw err
				message.channel.send("Your nickname linked as " + `**${nick}**`)
			})
		}
	}
});

//setprefix command
client.on('message', message => {
  try {
    prefix = prefixes[message.guild.id].prefix
  } catch {
    prefix = config.prefix
  }
	if (!message.content.startsWith(prefix)) return;
	const args = message.content.trim().split(/ +/g);
	const cmd = args[0].slice(prefix.length).toLowerCase(); // case INsensitive, without prefix
	if (cmd === 'setprefix') {
		if (!args[1]) {
			message.channel.send("Please specify a prefix")
		} else {
			var prefix = args[1]
			prefixes[message.guild.id] = {
				prefix: prefix
			}
			fs.writeFile("./prefixes.json", JSON.stringify(prefixes, null, 4), err => {
				if (err) throw err
				message.channel.send("Your prefix linked as " + `**${prefix}**`)
			})
		}
	}
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.token);