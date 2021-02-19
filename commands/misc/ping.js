module.exports = {
    name: 'ping',
    cooldown: 2.5,
    description: 'Ping!',
    guildOnly: true,
    permissions: false,
    async execute(client, message, args) {
      message.channel.send('Pinging...').then(sent => {
        sent.edit(`Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
    });
	},
};