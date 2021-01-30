module.exports = {
	run: (client, message, args) => {
		message.channel.send({ files: ["https://media.discordapp.net/attachments/696448442989543445/778668549207490570/IMG_0720_2020_11_08_17_40_41_UTC.png"] });
	},
	name: 'drive',
	alias: ['drives'],
	description: 'Provides a picture of each type of storage drive',
	category: 'PC Creator',
	autores: ['what/how', 'is/does/present', 'ssd']
};