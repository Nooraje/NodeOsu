const link = require("../jsons/links.json")
const Discord = require("discord.js");
let api = require('../osuapi.js');
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
            var try_counter = 1;
            var i = 0;
            while (i < 100) {
                if (getuser[0]['beatmap_id'] == getuser[i + 1]['beatmap_id']) {
                    i++;
                } else {
                    try_counter = i + 1;
                    break
                }
            }
            desc = ""
            c50 = getuser[0]["count50"]
            c100 = getuser[0]["count100"]
            c300 = getuser[0]["count300"]
            cmiss = getuser[0]["countmiss"]
            var d, t;
            d = new Date();
            d = (d.toLocaleString()).split(' ');
            t = d[1];
            d = d[0].split('/');
            d = d[0] + ' ' + t;
            var date = getuser[0]["date"]
            var formattedDate = moment(date).format('DD.MM.yyyy HH:mm:ss');
            var date_in = new Date(d);
            var date_out = new Date(formattedDate);
            var seconds = Math.abs(date_out.getTime() - date_in.getTime()) / 1000;
            saat = seconds / 3600 - 3
            saniye = saat * 3600
            countryflagicon = "https://www.countryflags.io/" + getuser[0]["country"] + "/flat/64.png";
            acc = api.accuracyCalc(c300, c100, c50, cmiss)
            api.get_pp(getuser[0]["beatmap_id"], getuser[0]["maxcombo"], c50, c100, c300, cmiss, getuser[0]["perfect"], getuser[0]["enabled_mods"])
                .then(function (pp) {
                    api.get_beatmap(getuser[0]["beatmap_id"] * 1)
                        .then(function (getbeatmap) {
                            beatmapsetlink = `https://osu.ppy.sh/beatmapsets/${getbeatmap[0]["beatmapset_id"]}#osu/${getbeatmap[0]["beatmap_id"]}`
                            desc += (`**[${getbeatmap[0]["title"]} [${getbeatmap[0]["version"]}]](${beatmapsetlink})**\n`)
                            star = getbeatmap[0]["difficultyrating"] / 1
                            mod = api.num_to_mod(getuser[0]["enabled_mods"] * 1)
                            desc += (`▸ **[${star.toFixed(2)}★]** +${mod} | ${getuser[0]["score"]} - ${api.get_rank_emote(getuser[0]["rank"])}\n▸ **${pp}**pp | `)
                        })
                    api.get_beatmap(getuser[0]["beatmap_id"] * 1)
                        .then(function (getbeatmap) {
                            var completion = 0;
                            totalhits = parseInt(getuser[0]["countmiss"]) + parseInt(getuser[0]["count50"]) + parseInt(getuser[0]["count100"]) + parseInt(getuser[0]["count300"]);
                            objects = parseInt(getbeatmap[0]["count_normal"]) + parseInt(getbeatmap[0]["count_slider"]) + parseInt(getbeatmap[0]["count_spinner"]);
                            completion = (Math.floor(((totalhits / objects)) * 10000) / 100);
                            beatmap_uid = getbeatmap[0]["beatmap_id"] * 1
                            beatmap_maxcombo = getbeatmap[0]["max_combo"] * 1
                            api.get_if_fc_pp(beatmap_uid, beatmap_maxcombo, c50, c100, c300, getuser[0]["enabled_mods"])
                                .then(function (iffcpp) {
                                    desc += (`IF FC: **${iffcpp}**pp | x${getuser[0]["maxcombo"]}/**${beatmap_maxcombo}**\n▸ ${acc}% | ${c100 * 1}x${api.get_onehundred_emote()} | ${c50 * 1}x${api.get_fifty_emote()} | ${cmiss * 1}${api.get_miss_emote()}\n▸ Try **#${try_counter}** | ${api.secondto(saniye)}\n▸ Map Completion: ${completion}%`)
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