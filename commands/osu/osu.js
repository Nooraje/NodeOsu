const link = require("../../jsons/links.json")
const Discord = require("discord.js");
let api = require('../../osuapi.js');
module.exports = {
    name: 'osu',
    aliases: ['profile', 'osuprofile'],
    cooldown: 2.5,
    description: 'osu!',
    args: false,
    usage: '<nickname>',
    guildOnly: true,
    permissions: false,
    async execute(client, message, args) {
        //my stupid way to get username
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
        let promise = new Promise((res, rej) => {
            let promises = [];
            promises.push(api.get_user(username))
            Promise.all(promises).then(resp => {
                resp.forEach(getuser => {
                    username = getuser[0]["username"]
                    countryflagicon = "https://www.countryflags.io/" + getuser[0]["country"] + "/flat/64.png";
                    pp_rank = "**▸ Rank:** " + "#" + getuser[0]["pp_rank"] + " [" + getuser[0]["country"] + "#" + getuser[0]["pp_country_rank"] + "]";
                    pp_raw = getuser[0]["pp_raw"];
                    accuracy = (getuser[0]["accuracy"] / 1).toFixed(2);
                    playcount = "**▸ Playcount:** " + getuser[0]["playcount"]
                    hoursplayedmath = getuser[0]["total_seconds_played"] / 60 / 60;
                    hoursplayed = "**▸ Hours Played:** " + hoursplayedmath.toFixed(0);
                    thumbnail = "http://s.ppy.sh/a/" + getuser[0]["user_id"] + `?${api.randomnumber(10000)}`
                    userid = getuser[0]["user_id"]
                    osuprofilelink = "https://osu.ppy.sh/u/" + userid
                    osudesc = `**▸ Username:** ${username}\n` + `${pp_rank}\n` + `**▸ Total PP:** ${pp_raw}\n` + `**▸ Hit Accuracy:** ${accuracy}%\n` + `${playcount}\n` + `${hoursplayed}`;
                })
                res(osudesc);
            }).catch((err) => {
                if (err.message === "Cannot read property 'username' of undefined") {
                    return message.channel.send(`~~${username}~~ **was not found.**`)
                } else {
                    console.log(err)
                }
            })
        })
        try {
            let osudesc = await promise
            embed = new Discord.MessageEmbed().setAuthor("osu! Profile for " + `${username}`, countryflagicon, osuprofilelink).setDescription(osudesc).setThumbnail(thumbnail).setColor(message.member.displayHexColor)
            message.channel.send(embed).then((msg) => {
                const ping = msg.createdTimestamp - message.createdTimestamp;
                console.log(`Osu Command MS: ${ping} ms`);
            });
        } catch (err) {
            console.log(err);
        }
    },
};