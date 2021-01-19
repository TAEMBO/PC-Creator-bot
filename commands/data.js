module.exports = {
	run: (client, message, args) => {
		message.delete();
		message.channel.send("https://dontasktoask.com");
	},
	name: 'data',
	alias: ['dontasktoask'],
	hidden: true
};