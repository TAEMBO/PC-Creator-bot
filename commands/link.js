module.exports = {
	run: (client, message, args) => {
		message.delete();
		message.channel.send({ files: ["https://cdn.discordapp.com/attachments/741171217393778778/786107691352850472/unknown.png"] });
	},
	name: 'link',
	alias: ['pcpplink'],
	hidden: true
};