module.exports = {
	run: (client, message, args) => {
		message.delete();
		const e = new client.embed({
			"title": "__Try asking here__",
			"color": 3971825,
			"url": "https://google.com"
		})
		message.channel.send({
			embed: [e]
		});
	},
	name: 'google',
	hidden: true
};