module.exports = {
    run: async (client, message, args) => {
		const achiever = {
			id: '695229647021015040',
			tag: '¥£$#7660'
		}
		const embed = new client.embed()
			.setTitle('__World Record PC__')
			.setDescription('This is the current World Record PC.')
			.addField(':small_blue_diamond: Achieved By', `<@${achiever.id}> ${achiever.tag} (${achiever.id})`)
			.addField(':small_blue_diamond: Details', 'overclocks are needed to get the highest score.\n**CPU**: 150 Base 43 Boost\n**RAM**: 13000\n**GPU**: 7849 and 40300\n• ZALMVN ZMX55 Thermal Paste is required and needs to cover 100% of the CPU.\n• Max overclocking skill is required.\n• Max spec custom CPU is required.')
			.addField(':small_blue_diamond: Score Achieved', '\`155,390\`')
			.setImage('https://media.discordapp.net/attachments/838857610358292532/873115363355799552/image1.png')
			.setColor(client.embedColor)
		message.channel.send(embed);
    },
	name: 'record',
	description: 'Shows the current World Record PC in the game',
	category: 'PC Creator',
	autores: ['record', 'pc', 'benchmark']
};