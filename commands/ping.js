module.exports = { 
	run: (client, message, args) => {
		message.channel.send(`Ping: **${client.ws.ping}ms**`);
	},
	name: 'ping',
	description: 'Shows amount of time it takes for the bot to respond',
	cooldown: 0
};