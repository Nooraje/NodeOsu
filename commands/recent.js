const link = require("../jsons/links.json")
const config = require("../jsons/configs.json")
const Discord = require("discord.js");
const {Beatmap, Osu: {DifficultyCalculator, PerformanceCalculator}} = require('osu-bpdpc')

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
            message.channel.send("Please link yourself. **!link <nick>**")
            return
        }
        api.get_user_recent(username).then(getuser => {
            text = api.get_pp(getuser[0]["beatmap_id"], getuser[0]["maxcombo"], getuser[0]["count50"], getuser[0]["count100"], getuser[0]["count300"], getuser[0]["countmiss"], getuser[0]["countkatu"], getuser[0]["countgeki"], getuser[0]["perfect"], getuser[0]["enabled_mods"])
            console.log(text)
        })
    },
};