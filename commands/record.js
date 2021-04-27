module.exports = {
    run: async (client, message, args) => {
        await message.channel.send({embed: {
			"title": "__World Record PC__",
			"description": "This is the current World Record PC achieved by <@537292814011072522> [**Mihasa#5788**], overclocks are needed to get the highest score.\n**CPU**: 150 Base 43 Boost\n**RAM**: 4160\n**GPU**: 4340 and 24700\n• ZALMVN ZMX55 Thermal Paste is required and needs to cover 100% of the CPU.\n• Max overclocking skill is required.\n• Max spec custom CPU is required.\n\nScore achieved: __127,964__",
			"color": 3971825}});
		message.channel.send('https://cdn.discordapp.com/attachments/696448442989543445/836309534913069126/Untitled-1.png')
    },
	name: 'record',
	description: 'Shows the current World Record PC in the game',
	category: 'PC Creator',
	autores: ['record', 'pc', 'benchmark']
};