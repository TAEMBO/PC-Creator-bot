module.exports = {
	run: async (client, message, args) => {
		await message.channel.send('https://cdn.discordapp.com/attachments/787590275110273035/789403313329405952/A511drhyO4AAAAASUVORK5CYII.png');
        const embed = new client.embed()
        .setTitle(`Bandwidth calculator`)
		.setURL('https://k.kramerav.com/support/bwcalculator.asp')
        .setColor(client.embedColor)
        message.channel.send({embeds: [embed]})
	},
	name: 'cable',
	alias: ['bandwidth', 'hdmi'],
	category: 'Real Computers',
	description: 'Shows the bandwidth for HDMI and DisplayPort'
};