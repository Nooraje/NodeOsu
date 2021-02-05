const Discord = require("discord.js");

module.exports = {
    name: 'napim',
    aliases: ['napim?'],
    cooldown: 2.5,
    description: 'napim?',
    args: false,
    usage: '',
    guildOnly: true,
    permissions: false,
    execute(message, args) {
        var VC = message.member.voice.channel
        if (!VC)return message.reply("You have to be connected to a voice channel before you can use this command!")
    VC.join()
        .then(connection => {
            const dispatcher = connection.play('D:/nora/soundpad/napim.mp3');
            dispatcher.on("end", end => {VC.leave()});
        })
        .catch(console.error);
    },
};