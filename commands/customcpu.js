module.exports = {
	run: (client, message, args) => {
		const embed = new client.embed()
			.setTitle('This is how custom CPUs were made.')
			.setImage("https://media.discordapp.net/attachments/696448442989543445/865040800646561834/Screenshot_2021-02-12-17-34-34-411_com.png")
			.setFooter('You cannot make custom CPUs anymore. The feature to manufacture them was removed in an update.')
			.setColor(client.embedColor)
		message.channel.send(embed);
	},
	name: 'customcpu',
	description: 'Provides a picture of how custom CPUs were made',
	category: 'PC Creator',
    alias: ['cc']
};