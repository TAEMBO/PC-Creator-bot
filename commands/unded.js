module.exports = {
	run: (client, message, args) => {
		message.delete();
		message.channel.send("https://tenor.com/view/the-dancing-dorito-i-revive-this-chat-dance-gif-14308244");
	},
	name: 'ping'
};