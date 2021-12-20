module.exports = {
	run: async (client, message, args) => {
		await message.channel.send('https://cdn.discordapp.com/attachments/787590275110273035/789403313329405952/A511drhyO4AAAAASUVORK5CYII.png');
		const e = new client.embed({
			"title": "__Bandwidth Calculator__",
			"color": 3971825,
			"url": "https://k.kramerav.com/support/bwcalculator.asp"
		})
		message.channel.send({
			embeds: [e]
		});
	},
	name: 'cable',
	alias: ['bandwidth', 'hdmi'],
	category: 'Real Computers',
	description: 'Shows the bandwidth for HDMI and DisplayPort'
};