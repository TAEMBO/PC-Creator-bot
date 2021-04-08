module.exports = {
	run: (client, message, args) => {
		message.delete();
		message.channel.send("User has been muted.");
	},
	name: 'fmute',
	hidden: true
};