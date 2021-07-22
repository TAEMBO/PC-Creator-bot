module.exports = {
	run: (client, message, args) => {
		const embed = new client.embed()
			.setTitle('This is a watercooler.')
			.setImage("https://cdn.discordapp.com/attachments/571031705109135361/807483439695396934/IMG_0716_2020_11_08_17_40_41_UTC.PNG")
			.setColor(client.embedColor)
		message.channel.send(embed);
	},
	name: 'aio',
	description: 'Provides a picture of what a watercooler looks like',
	category: 'PC Creator',
	autores: ['what/how', 'is/look', 'water cool/aio/watercool']
};