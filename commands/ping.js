module.exports = { 
	run: (client, message, args) => {
		message.channel.send(`Ping: **${client.ws.ping}ms**`);
	},
	name: 'ping'
};