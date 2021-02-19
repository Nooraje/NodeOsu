const link = require("../../jsons/links.json")
const fs = require('fs');

module.exports = {
	name: 'unlink',
	aliases: ['unlinkosu', 'unlinkprofile'],
	cooldown: 2.5,
	description: 'unlink!',
	args: false,
	usage: '',
	guildOnly: true,
	permissions: false,
	async execute(client, message, args) {
		if(link[message.author.id] != null) {
            var key = message.author.id;
            delete link[key];
            message.channel.send("Done.")
        } else {
            message.channel.send("Link yourself. !link <username>")
        }
        fs.writeFileSync('./jsons/links.json', JSON.stringify(link));
	},
};