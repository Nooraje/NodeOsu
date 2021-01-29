const link = require("../jsons/links.json")
const request = require("request");
const config = require("../jsons/configs.json")
const Discord = require("discord.js");

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
        try {
            if (args[0]) {
                var username = args[0]
            } else {
                var username = link[message.author.id].nick
            }
        } catch {
            message.channel.send("Please link yourself. **!link <nick>**")
            return
        }
        request(
            "https://osu.ppy.sh/api/get_user_recent?k=" + config.apikey + `&u=${username}`,
            function(error, response, body) {
                randomnumber = Math.floor(Math.random() * 10000);
                r = body;
                obj = JSON.parse(r);
                //api callbacks

            }
        );
    },
};