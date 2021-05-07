module.exports = {
    run: async (client, message, args) => {
		const achiever = {
			id: '537292814011072522',
			tag: 'Mihasa#5788'
		}
		const embed = new client.embed()
			.setTitle('__World Record PC__')
			.setDescription('This is the current World Record PC.')
			.addField(':small_blue_diamond: Achieved By', `<@${achiever.id}> ${achiever.tag} (${achiever.id})`)
			.addField(':small_blue_diamond: Details', 'overclocks are needed to get the highest score.\n**CPU**: 150 Base 43 Boost\n**RAM**: 4160\n**GPU**: 4340 and 24700\n• ZALMVN ZMX55 Thermal Paste is required and needs to cover 100% of the CPU.\n• Max overclocking skill is required.\n• Max spec custom CPU is required.')
			.addField(':small_blue_diamond: Score Achieved', '\`127,964\`')
			.setImage('https://cdn.discordapp.com/attachments/696448442989543445/840000021676294194/Untitled-1.png')
			.setColor(client.embedColor)
		message.channel.send(embed);
    },
	name: 'record',
	description: 'Shows the current World Record PC in the game',
	category: 'PC Creator',
	autores: ['record', 'pc', 'benchmark']
};