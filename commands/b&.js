module.exports = {
	run: (client, message, args) => {
		message.delete();
		message.channel.send("You received an honorary ban!");
	},
	name: 'b&',
	hidden: true
};