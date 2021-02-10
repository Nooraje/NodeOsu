const link = require("../jsons/links.json")
const Discord = require("discord.js");
let api = require('../osuapi.js');

module.exports = {
    name: 'osutop',
    aliases: ['osubest', 'best'],
    cooldown: 2.5,
    description: 'osutop!',
    args: false,
    usage: '<nickname>',
    guildOnly: true,
    permissions: false,
    async execute(message, args) {
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
        api.get_user_best(username).then(getuserbest => {
            api.get_user(username).then(function (getuser) {
                let promise = new Promise((res, rej) => {
                    setTimeout(() => {
                        osutopdesc = ``
                        username = getuser[0]["username"]
                        pp_raw = getuser[0]["pp_raw"];
                        pp_rank = "#" + getuser[0]["pp_rank"] + " " + getuser[0]["country"] + getuser[0]["pp_country_rank"]
                        countryflagicon = "https://www.countryflags.io/" + getuser[0]["country"] + "/flat/64.png";
                        for (i = 0; i < 3; i++) {
                            api.get_beatmap(getuserbest[i]["beatmap_id"] * 1, getuserbest[i]["enabled_mods"] * 1).then(getbeatmap => {
                                d = new Date();
                                var date = getuserbest[i]["date"]
                                ms = new Date(d) - new Date(date)
                                saniye = ((ms / 1000) / 3600 - 3) * 3600
                                beatmapsetlink = `https://osu.ppy.sh/beatmapsets/${getbeatmap[0]["beatmapset_id"]}#osu/${getbeatmap[0]["beatmap_id"]}`
                                star = getbeatmap[0]["difficultyrating"] / 1
                                mod = api.num_to_mod(getuserbest[i]["enabled_mods"] * 1)
                                acc = api.accuracyCalc(getuserbest[i]["count300"], getuserbest[i]["count100"], getuserbest[i]["count50"], getuserbest[i]["countmiss"])
                                osutopdesc += `**1. [${getbeatmap[0]["title"]} [${getbeatmap[0]["version"]}]](${beatmapsetlink})**\n▸ **[${star.toFixed(2)}★]** +${mod} | ${getuserbest[i]["score"]} - ${api.get_rank_emote(getuserbest[i]["rank"])}\n▸ **${(parseInt(getuserbest[i]["pp"]))}**pp | **x${getuserbest[i]["maxcombo"]}/${getbeatmap[0]["max_combo"] * 1}**\n▸ ${acc}% | ${getuserbest[i]["count100"]}x${api.get_onehundred_emote()} | ${getuserbest[i]["count50"]}x${api.get_fifty_emote()} | ${getuserbest[i]["countmiss"]}${api.get_miss_emote()}\n▸ Score Set ${api.secondto(saniye)}\n`
                            })
                        }
                    }, 1000)
                });
                let result = await promise;
                console.log(result)
                embed = new Discord.MessageEmbed()
                    .setAuthor(`Top plays for ${username}\n${pp_raw}pp (${pp_rank})`, countryflagicon, "https://osu.ppy.sh/u/" + username)
                    .setDescription(osutopdesc)
                    .setThumbnail("http://s.ppy.sh/a/" + getuser[0]["user_id"] + `?${api.randomnumber(10000)}`)
                    .setColor(message.member.displayHexColor)
                console.log(`Osutop Command ms: ${message.createdTimestamp - Date.now()}`)
                console.log(osutopdesc)
                message.channel.send(embed);
            })
        }).catch(err => {
            console.log(err)
        });
        message.channel.send("31")
    },
};