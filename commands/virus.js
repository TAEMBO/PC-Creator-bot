module.exports = {
    run: (client, message, args) => {
		const embed = new client.embed()
			.setTitle('Viruses in PC Creator')
			.setDescription("Go to the online shop in the menu, and under the OS section you will find a list of programs. Select either Eset or Avast (they’re the same) and buy it. Then go to customer’s PC and turn it on to the desktop, next press the install button, followed by the small backpack icon, you will then see your antivirus there where you can download it.")
			.setImage('https://media.discordapp.net/attachments/571031705109135361/823605061003378708/antivirus.png')
			.setColor(client.embedColor)
        message.channel.send(embed);
    },
	name: 'virus',
	alias: ['antivirus'],
	description: 'Provides help with viruses task',
	category: 'PC Creator',
	autores: ['virus/antivirus', 'remove/get/delete/clean']
};