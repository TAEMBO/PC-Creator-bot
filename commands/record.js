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
			.addField(':small_blue_diamond: Details', 'overclocks are needed to get the highest score.\n**CPU**: 153 Base 22 Boost\n**RAM**: 4680\n**GPU**: 7840 and 40300\n• ZALMVN ZMX55 Thermal Paste is required and needs to cover 100% of the CPU.\n• Max overclocking skill is required.')
			.addField(':small_blue_diamond: Score Achieved', '\`207,231\`')
			.setImage('https://cdn.discordapp.com/attachments/838857610358292532/905766073557729290/record.jpg')
			.setColor(client.embedColor)
		message.channel.send({embeds: [embed]});
    },
	name: 'record',
	description: 'Shows the current World Record PC in the game',
	category: 'PC Creator',
	autores: ['record', 'pc', 'benchmark']
};