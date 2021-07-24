module.exports = {
	run: (client, message, args) => {
		message.delete().catch(err => console.log('couldnt delete message when doing b& because', err.message));
		message.channel.send("You received an honorary ban!");
	},
	name: 'b&',
	hidden: true
};