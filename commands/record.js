module.exports = {
    run: async (client, message, args) => {
		const achiever = {
			id: '828517833440231427',
			tag: 'SPACE COWBOY :cowboy:#9802'
		}
		const embed = new client.embed()
			.setTitle('__World Record PC__')
			.setDescription('This is the current World Record PC.')
			.addField(':small_blue_diamond: Achieved By', `<@${achiever.id}> ${achiever.tag} (${achiever.id})`)
			.addField(':small_blue_diamond: Details', 'overclocks are needed to get the highest score.\n**CPU**: 150 Base 43 Boost\n**RAM**: 4160\n**GPU**: 4480 and 25610\n• ZALMVN ZMX55 Thermal Paste is required and needs to cover 100% of the CPU.\n• Max overclocking skill is required.\n• Max spec custom CPU is required.')
			.addField(':small_blue_diamond: Score Achieved', '\`128,123\`')
			.setImage('https://cdn.discordapp.com/attachments/787590275110273035/844984976230973440/Untitled-2.png')
			.setColor(client.embedColor)
		message.channel.send(embed);
    },
	name: 'record',
	description: 'Shows the current World Record PC in the game',
	category: 'PC Creator',
	autores: ['record', 'pc', 'benchmark']
};