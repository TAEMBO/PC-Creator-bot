module.exports = {
	run: async (client, message, args) => {
		message.delete();
		await message.channel.send({ files: ["https://cdn.discordapp.com/attachments/787590275110273035/789403313329405952/A511drhyO4AAAAASUVORK5CYII.png"] });
		message.channel.send({
			embed: {
				"title": "__Bandwidth Calculator__",
				"color": 3971825,
				"url": "https://k.kramerav.com/support/bwcalculator.asp"
			}
		});
	},
	name: 'cable',
	alias: ['bandwidth', 'hdmi'],
	hidden: true
};