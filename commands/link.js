const link = require("../jsons/links.json")
const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
	name: 'link',
	aliases: ['linkosu', 'linkprofile'],
	cooldown: 2.5,
	description: 'link!',
	args: true,
	usage: '<nickname>',
	guildOnly: true,
	permissions: false,
	execute(message, args) {
		var nick = args[0]
		link[message.author.id] = {
			nick: nick
		}
		fs.writeFile("./jsons/links.json", JSON.stringify(link, null, 4), err => {
			if (err) throw err
			message.channel.send("Your nickname linked as " + `**${nick}**`)
		})
	},
};