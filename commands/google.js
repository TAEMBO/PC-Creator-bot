module.exports = {
	run: (client, message, args) => {
		message.delete();
		message.channel.send({
			embed: {
				"title": "__Try asking here__",
				"color": 3971825,
				"url": "https://google.com"
			}
		});
	},
	name: 'google'
};