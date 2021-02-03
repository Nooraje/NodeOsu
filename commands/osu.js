const link = require("../jsons/links.json")
const config = require("../jsons/configs.json")
const Discord = require("discord.js");

let api = require('../osuapi.js');

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
        //my stupid way to get username
        try {
            if (!args[0]) {
                username = link[message.author.id].nick
            } else if (args[0].length > 20) {
                let mention = message.mentions.users.first();
                username = link[mention.id].nick
            } else {
                username = args[0]
            }
        } catch {
            message.channel.send("Please link yourself. **!link <nick>**")
            return
        }
        api.getuser(username).then(getuser => {
            osuprofilepicture = "http://s.ppy.sh/a/" + getuser[0]["user_id"];
            countryflagicon = "https://www.countryflags.io/" + getuser[0]["country"] + "/flat/64.png";
            username = getuser[0]["username"]
            osuprofilelink = "https://osu.ppy.sh/u/" + username
            pp_rank =
                "**» Rank:** " +
                "#" +
                getuser[0]["pp_rank"] +
                " [" +
                getuser[0]["country"] +
                "#" +
                getuser[0]["pp_country_rank"] +
                "]";
            pp_raw = getuser[0]["pp_raw"];
            accuracy = getuser[0]["accuracy"] / 1;
            accuracyy = accuracy.toFixed(2);
            playcount = "**» Playcount:** " + getuser[0]["playcount"]
            hoursplayedmath = getuser[0]["total_seconds_played"] / 60 / 60;
            hoursplayed = "**» Hours Played:** " + hoursplayedmath.toFixed(0);
            joindate = getuser[0]["join_date"]
            desc =
                `**» Username:** ${username}\n` +
                `${pp_rank}\n` +
                `**» Total PP:** ${pp_raw}\n` +
                `**» Hit Accuracy:** ${accuracyy}%\n` +
                `${playcount}\n` +
                `${hoursplayed}`;
            embed = new Discord.MessageEmbed()
                .setAuthor("osu! Profile for " + `${username}`, countryflagicon, osuprofilelink)
                .setDescription(desc)
                .setThumbnail(osuprofilepicture + `?${api.randomnumber(10000)}`)
                .setColor(message.member.displayHexColor)
                .setFooter("»» Join Date: " + joindate);
            message.channel.send(embed);
        }).catch(err => {
            message.channel.send("Something went wrong.. Please specify a correct nickname.")
        });
    },
};
