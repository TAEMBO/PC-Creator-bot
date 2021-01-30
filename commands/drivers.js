module.exports = {
	run: (client, message, args) => {
		message.channel.send({ content: 'How to install fresh drivers:', files: ["https://media.discordapp.net/attachments/571031705109135361/805148849018109952/image0.png"] });
	},
	name: 'drivers',
	alias: ['driver'],
	description: 'Offers help with updating drivers',
	category: 'PC Creator',
	autores: ['update/install', 'driver']
};