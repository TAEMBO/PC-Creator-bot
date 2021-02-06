module.exports = {
	run: (client, message, args) => {
		message.channel.send({ files: ["https://media.discordapp.net/attachments/571031705109135361/698154858158489704/image0-4.jpg?width=1104&height=669"] });
	},
	name: 'drive',
	alias: ['drives'],
	description: 'Provides a picture of each type of storage drive',
	category: 'PC Creator',
	autores: ['what/how', 'is/does/present/look', 'ssd'],
	cooldown: 5000
};