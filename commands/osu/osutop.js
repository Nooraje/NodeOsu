const link = require("../../jsons/links.json")
const Discord = require("discord.js");
let api = require('../../osuapi.js');
module.exports = {
    name: 'osutop',
    aliases: ['osubest', 'best'],
    cooldown: 2.5,
    description: 'osutop!',
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
            api.get_user_best(username).then(getuserbest => {
                api.get_user(username).then(function (getuser) {
                    let osutopdesc = ``
                    username = getuser[0]["username"]
                    pp_raw = getuser[0]["pp_raw"];
                    pp_rank = "#" + getuser[0]["pp_rank"] + " " + getuser[0]["country"] + getuser[0]["pp_country_rank"]
                    countryflagicon = "https://www.countryflags.io/" + getuser[0]["country"] + "/flat/64.png";
                    let promises = [];
                    for (i = 0; i < 5; i++) {
                        enabled_mods = api.num_to_num_but_diff_increase_mods_only(parseInt(getuserbest[i]["enabled_mods"]))
                        promises.push(api.get_beatmap(getuserbest[i]["beatmap_id"] * 1, enabled_mods))
                    }
                    Promise.all(promises).then(resp => {
                        let i = 0;
                        resp.forEach(getbeatmap => {
                            let d = new Date();
                            let ms = new Date(d) - new Date(getuserbest[i]["date"])
                            let saniye = ((ms / 1000) / 3600 - 3) * 3600
                            let beatmapsetlink = `https://osu.ppy.sh/beatmapsets/${getbeatmap[0]["beatmapset_id"]}#osu/${getbeatmap[0]["beatmap_id"]}`
                            let star = getbeatmap[0]["difficultyrating"] / 1
                            let mod = api.num_to_mod(getuserbest[i]["enabled_mods"] * 1)
                            let score = getuserbest[i]["score"] * 1
                            let acc = api.accuracyCalc(getuserbest[i]["count300"], getuserbest[i]["count100"], getuserbest[i]["count50"], getuserbest[i]["countmiss"])
                            osutopdesc += `**${i + 1}. [${getbeatmap[0]["title"]} [${getbeatmap[0]["version"]}]](${beatmapsetlink})**\n`
                            osutopdesc += `▸ **[${star.toFixed(2)}★]** +${mod} | ${score.toLocaleString()} - ${api.get_rank_emote(getuserbest[i]["rank"])}\n`
                            osutopdesc += `▸ **${(parseInt(getuserbest[i]["pp"]))}**pp | **x${getuserbest[i]["maxcombo"]}/${getbeatmap[0]["max_combo"] * 1}**\n`
                            osutopdesc += `▸ ${acc}% | ${getuserbest[i]["count100"]}x${api.get_onehundred_emote()} | ${getuserbest[i]["count50"]}x${api.get_fifty_emote()} | ${getuserbest[i]["countmiss"]}${api.get_miss_emote()}\n`
                            osutopdesc += `▸ Score Set ${api.secondto(saniye)}\n`;
                            thumbnail = "http://s.ppy.sh/a/" + getuser[0]["user_id"] + `?${api.randomnumber(10000)}`
                            userid = getuser[0]["user_id"]
                            i++;
                        });
                        res(osutopdesc);
                        res(thumbnail);
                        res(userid);
                    })
                }).catch(err => {
                    if (err.message === "Cannot read property 'username' of undefined") {
                        message.channel.send(`~~${username}~~ **was not found.**`)
                    } else {
                        console.log(err)
                    }
                });
            })
        })
        try {
            let osutop = await promise
            let embed = new Discord.MessageEmbed().setAuthor(`Top plays for ${username}\n${pp_raw}pp (${pp_rank})`, countryflagicon, "https://osu.ppy.sh/u/" + userid).setDescription(osutop).setThumbnail(thumbnail).setColor(message.member.displayHexColor)
            message.channel.send(embed).then((msg) => {
                const ping = msg.createdTimestamp - message.createdTimestamp;
                console.log(`Osutop Command MS: ${ping} ms`);
            });
        } catch (err) {
            console.log(err)
        }
    },
};