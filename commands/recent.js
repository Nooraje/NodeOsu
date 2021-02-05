const link = require("../jsons/links.json")
const Discord = require("discord.js");
let api = require('../osuapi.js');

module.exports = {
    name: 'recent',
    aliases: ['r', 'rs'],
    cooldown: 2.5,
    description: 'recent!',
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
            return message.channel.send("Please link yourself. **!link <nick>**")
        }
        api.get_user_recent(username).then(getuser => {
            desc = ""
            c50 = getuser[0]["count50"]
            c100 = getuser[0]["count100"]
            c300 = getuser[0]["count300"]
            cmiss = getuser[0]["countmiss"]
            countryflagicon = "https://www.countryflags.io/" + getuser[0]["country"] + "/flat/64.png";
            acc = api.accuracyCalc(c300, c100, c50, cmiss)
            api.get_pp(getuser[0]["beatmap_id"], getuser[0]["maxcombo"], c50, c100, c300, cmiss, getuser[0]["perfect"], getuser[0]["enabled_mods"])
                .then(function (pp) {
                    //console.log(Date.now())
                    api.get_beatmap(getuser[0]["beatmap_id"] * 1)
                        .then(function (getbeatmap) {
                            beatmapsetlink = `https://osu.ppy.sh/beatmapsets/${getbeatmap[0]["beatmapset_id"]}#osu/${getbeatmap[0]["beatmap_id"]}`
                            desc += (`[${getbeatmap[0]["title"]} [${getbeatmap[0]["version"]}]](${beatmapsetlink})\n`)
                            star = getbeatmap[0]["difficultyrating"] / 1
                            mod = api.num_to_mod(getuser[0]["enabled_mods"] * 1)
                            console.log(mod)
                            console.log(getuser[0]["rank"])
                            desc += (`▸ **[${star.toFixed(2)}★]** +${mod} | ${getuser[0]["score"]} - ${api.get_rank_emote(getuser[0]["rank"])}\n▸ **${pp}**pp | `)
                        })
                    api.get_beatmap(getuser[0]["beatmap_id"] * 1)
                        .then(function (getbeatmap) {
                            beatmap_uid = getbeatmap[0]["beatmap_id"] * 1
                            beatmap_maxcombo = getbeatmap[0]["max_combo"] * 1
                            api.get_if_fc_pp(beatmap_uid, beatmap_maxcombo, c50, c100, c300, getuser[0]["enabled_mods"])
                                .then(function (iffcpp) {
                                    desc += (`IF FC: **${iffcpp}**pp | x${getuser[0]["maxcombo"]}/**${beatmap_maxcombo}**\n▸ ${acc}% | ${c100 * 1}x${api.get_onehundred_emote()} | ${c50 * 1}x${api.get_fifty_emote()} | ${cmiss * 1}${api.get_miss_emote()}\n`)
                                    api.get_user(username).then(getuser => {
                                        countryflagicon = "https://www.countryflags.io/" + getuser[0]["country"] + "/flat/64.png";
                                        username = getuser[0]["username"]
                                        osuprofilelink = "https://osu.ppy.sh/u/" + username
                                        osuprofilepicture = "http://s.ppy.sh/a/" + getuser[0]["user_id"];
                                        pp_raw = getuser[0]["pp_raw"];
                                        pp_rank =
                                            "#" +
                                            getuser[0]["pp_rank"] +
                                            " " +
                                            getuser[0]["country"] +
                                            getuser[0]["pp_country_rank"]
                                        embed = new Discord.MessageEmbed()
                                            .setAuthor(`${username}: ${pp_raw}pp\n(${pp_rank})`, countryflagicon, osuprofilelink)
                                            .setDescription(desc)
                                            .setThumbnail(osuprofilepicture + `?${api.randomnumber(10000)}`)
                                            .setColor(message.member.displayHexColor)
                                            .setImage(`https://assets.ppy.sh/beatmaps/${getbeatmap[0]['beatmapset_id']}/covers/cover.jpg`)
                                        message.channel.send(embed);
                                    })
                                })
                        })
                })
        }).catch(err => {
            return message.channel.send("Something went wrong.. Please specify a correct nickname.")
        });
    },
};