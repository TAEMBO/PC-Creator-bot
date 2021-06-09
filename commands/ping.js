module.exports = { 
	run: (client, message, args) => {
		message.channel.send(`WebSocket Latency: **${client.ws.ping}ms**`);
	},
	name: 'ping',
	description: 'Average latency of bot client\'s shards\' last websocket heartbeat from sending to ack in milliseconds. No it\'s not _your_ ping.',
	shortDescription: 'Average Websocket latency'
};