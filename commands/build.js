module.exports = {
	run: (client, message, args) => {
		message.delete();
		message.channel.send("https://www.youtube.com/watch?v=v7MYOpFONCU");
	},
	name: 'build'
};