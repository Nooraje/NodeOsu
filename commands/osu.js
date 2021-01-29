const link = require("../links.json")
const request = require("request");
const config = require("../configs.json")
const Discord = require("discord.js");

module.exports = {
  name: 'osu',
  aliases: ['profile', 'osuprofile'],
  cooldown: 2.5,
  description: 'osu!',
  args: false,
  usage: '<nickname>',
  guildOnly: true,
  permissions: false,
	execute(message, args) {
    try {
			if (args[1]) {
        var username = args[1]
			} else {
        var username = link[message.author.id].nick
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
	},
};