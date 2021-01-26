module.exports = {
	run: (client, message, args) => {
		message.delete();
		message.channel.send("Your honorary ban has been revoked!");
	},
	name: 'unb&',
	hidden: true
};